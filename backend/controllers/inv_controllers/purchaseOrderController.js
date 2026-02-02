const PurchaseOrder = require('../../models/inv_model/purchase.model');
const GoodsReceipt = require('../../models/inv_model/purchase.model');
const Product = require('../../models/inv_model/product.model');
const Stock = require('../../models/inv_model/stock.model');
//const Supplier = require('../models/Supplier');

exports.createPurchaseOrder = async (req, res) => {
  try {
    const { branchId } = req.params;
    const poData = req.body;
    
    // Generate PO number
    const poCount = await PurchaseOrder.countDocuments({ branch: branchId });
    const poNumber = `PO${branchId.slice(-3)}${String(poCount + 1).padStart(6, '0')}`;
    
    // Calculate totals
    let subtotal = 0;
    poData.items = await Promise.all(poData.items.map(async item => {
      const product = await Product.findById(item.product);
      const variant = product.variants.id(item.variantId);
      
      const unitCost = item.unitCost || variant.price.costPrice;
      const lineTotal = unitCost * item.quantity;
      subtotal += lineTotal;
      
      return {
        ...item,
        unitCost,
        lineTotal
      };
    }));
    
    const tax = poData.tax || subtotal * 0.18; // 18% default tax
    const shippingCost = poData.shippingCost || 0;
    const totalAmount = subtotal + tax + shippingCost;
    
    const purchaseOrder = new PurchaseOrder({
      poNumber,
      branch: branchId,
      ...poData,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      createdBy: req.user.id
    });
    
    await purchaseOrder.save();
    
    res.status(201).json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPurchaseOrders = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { status, supplier, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let query = { branch: branchId };
    
    if (status) query.status = status;
    if (supplier) query.supplier = supplier;
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) query.orderDate.$gte = new Date(startDate);
      if (endDate) query.orderDate.$lte = new Date(endDate);
    }
    
    const purchaseOrders = await PurchaseOrder.find(query)
      .populate('supplier', 'supplierName contactPerson')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('items.product', 'productName sku')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ orderDate: -1 });
    
    // Add variant details
    for (let po of purchaseOrders) {
      for (let item of po.items) {
        const product = await Product.findById(item.product);
        if (product) {
          item.variantDetails = product.variants.id(item.variantId);
        }
      }
    }
    
    const total = await PurchaseOrder.countDocuments(query);
    
    // Calculate summary
    const summary = await PurchaseOrder.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: purchaseOrders,
      summary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.approvePurchaseOrder = async (req, res) => {
  try {
    const { poId } = req.params;
    
    const purchaseOrder = await PurchaseOrder.findById(poId);
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    if (purchaseOrder.status !== 'pending-approval') {
      return res.status(400).json({
        success: false,
        message: 'Purchase order is not pending approval'
      });
    }
    
    purchaseOrder.status = 'approved';
    purchaseOrder.approvedBy = req.user.id;
    purchaseOrder.sentDate = new Date();
    
    await purchaseOrder.save();
    
    res.json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.receiveGoods = async (req, res) => {
  try {
    const { poId } = req.params;
    const { items, qualityChecks, storageLocation, notes } = req.body;
    
    const purchaseOrder = await PurchaseOrder.findById(poId)
      .populate('branch', 'name');
    
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    // Generate GRN number
    const grnCount = await GoodsReceipt.countDocuments();
    const grnNumber = `GRN${String(grnCount + 1).padStart(6, '0')}`;
    
    // Create receipt items
    const receiptItems = await Promise.all(items.map(async item => {
      const poItem = purchaseOrder.items.find(poItem => 
        poItem.product.toString() === item.product &&
        poItem.variantId.toString() === item.variantId
      );
      
      if (!poItem) {
        throw new Error(`Item not found in purchase order: ${item.product}`);
      }
      
      const acceptedQuantity = item.receivedQuantity - (item.rejectedQuantity || 0);
      const qualityStatus = qualityChecks?.[item.product]?.[item.variantId] || 'pending';
      
      // Update PO item received quantities
      poItem.receivedQuantity += acceptedQuantity;
      poItem.rejectedQuantity += (item.rejectedQuantity || 0);
      
      return {
        product: item.product,
        variantId: item.variantId,
        orderedQuantity: poItem.quantity,
        receivedQuantity: item.receivedQuantity,
        acceptedQuantity,
        rejectedQuantity: item.rejectedQuantity || 0,
        rejectionReason: item.rejectionReason,
        qualityStatus,
        remarks: item.remarks
      };
    }));
    
    // Create goods receipt
    const goodsReceipt = new GoodsReceipt({
      grnNumber,
      purchaseOrder: poId,
      branch: purchaseOrder.branch._id,
      items: receiptItems,
      receivedBy: req.user.id,
      storageLocation,
      notes
    });
    
    await goodsReceipt.save();
    
    // Update stock for accepted items
    for (const item of receiptItems) {
      if (item.acceptedQuantity > 0) {
        let stock = await Stock.findOne({
          product: item.product,
          variantId: item.variantId,
          branch: purchaseOrder.branch._id
        });
        
        if (!stock) {
          stock = new Stock({
            product: item.product,
            variantId: item.variantId,
            branch: purchaseOrder.branch._id,
            location: storageLocation || 'warehouse',
            currentStock: 0,
            availableStock: 0
          });
        }
        
        stock.currentStock += item.acceptedQuantity;
        stock.lastRestockDate = new Date();
        await stock.save();
      }
    }
    
    // Update PO status
    const allReceived = purchaseOrder.items.every(item => 
      item.receivedQuantity >= item.quantity
    );
    
    if (allReceived) {
      purchaseOrder.status = 'received';
    } else {
      purchaseOrder.status = 'partially-received';
    }
    
    await purchaseOrder.save();
    
    res.status(201).json({
      success: true,
      data: goodsReceipt
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.cancelPurchaseOrder = async (req, res) => {
  try {
    const { poId } = req.params;
    const { reason } = req.body;
    
    const purchaseOrder = await PurchaseOrder.findById(poId);
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    if (['received', 'partially-received', 'cancelled'].includes(purchaseOrder.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel purchase order with status: ${purchaseOrder.status}`
      });
    }
    
    purchaseOrder.status = 'cancelled';
    purchaseOrder.notes = reason;
    await purchaseOrder.save();
    
    res.json({
      success: true,
      message: 'Purchase order cancelled successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPurchaseOrderAnalytics = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { period = 'month' } = req.query;
    
    const startDate = new Date();
    if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'quarter') {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    // Get PO statistics
    const poStats = await PurchaseOrder.aggregate([
      {
        $match: {
          branch: branchId,
          orderDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalPOs: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          avgDeliveryTime: { $avg: { $subtract: ['$sentDate', '$orderDate'] } }
        }
      }
    ]);
    
    // Get supplier performance
    const supplierPerformance = await PurchaseOrder.aggregate([
      {
        $match: {
          branch: branchId,
          orderDate: { $gte: startDate },
          status: 'received'
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplier',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' },
      {
        $group: {
          _id: '$supplier._id',
          supplierName: { $first: '$supplier.supplierName' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);
    
    // Get category-wise spending
    const categorySpending = await PurchaseOrder.aggregate([
      {
        $match: {
          branch: branchId,
          orderDate: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.categoryName' },
          totalSpent: { $sum: '$items.lineTotal' }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        poStats: poStats[0] || {},
        supplierPerformance,
        categorySpending
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};