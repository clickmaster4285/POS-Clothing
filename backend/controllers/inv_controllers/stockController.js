const Stock = require('../../models/inv_model/stock.model');
const StockAdjustment = require('../../models/inv_model/stock.model');
const StockTransfer = require('../../models/inv_model/stock.model');
const Product = require('../../models/inv_model/product.model');

exports.getStockByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { location, lowStock, search, category, page = 1, limit = 50 } = req.query;
    
    let query = { branch: branchId };
    
    if (location) query.location = location;
    if (lowStock === 'true') query.isLowStock = true;
    
    // Add product filtering if search or category provided
    if (search || category) {
      const productQuery = {};
      if (search) {
        productQuery.$or = [
          { productName: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } }
        ];
      }
      if (category) productQuery.category = category;
      
      const products = await Product.find(productQuery).select('_id');
      const productIds = products.map(p => p._id);
      query.product = { $in: productIds };
    }
    
    const stocks = await Stock.find(query)
      .populate('product', 'productName sku primaryImage')
      .populate('branch', 'name code')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ isLowStock: -1, updatedAt: -1 });
    
    // Get variant details for each stock
    for (let stock of stocks) {
      const product = await Product.findById(stock.product);
      if (product) {
        const variant = product.variants.id(stock.variantId);
        stock.variantDetails = variant;
      }
    }
    
    const total = await Stock.countDocuments(query);
    
    // Calculate summary
    const totalValue = stocks.reduce((sum, stock) => {
      const variant = stock.variantDetails;
      if (variant && variant.price) {
        return sum + (stock.currentStock * variant.price.costPrice);
      }
      return sum;
    }, 0);
    
    const lowStockCount = await Stock.countDocuments({ ...query, isLowStock: true });
    
    res.json({
      success: true,
      data: stocks,
      summary: {
        totalItems: total,
        totalValue,
        lowStockCount,
        outOfStockCount: await Stock.countDocuments({ ...query, currentStock: 0 })
      },
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

exports.adjustStock = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { adjustmentType, reason, items, remarks } = req.body;
    
    // Validate adjustment type
    const validTypes = ['add', 'remove', 'transfer', 'damage', 'return'];
    if (!validTypes.includes(adjustmentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid adjustment type'
      });
    }
    
    // Create stock adjustment record
    const adjustment = new StockAdjustment({
      branch: branchId,
      adjustmentType,
      reason,
      items,
      adjustedBy: req.user.id,
      remarks,
      status: 'pending' // Requires approval
    });
    
    // If immediate adjustment is allowed (small amounts)
    if (adjustmentType === 'add' || adjustmentType === 'damage') {
      adjustment.status = 'approved';
      adjustment.approvedBy = req.user.id;
      adjustment.approvalDate = new Date();
      
      // Apply stock changes
      for (const item of items) {
        const stock = await Stock.findOne({
          product: item.product,
          variantId: item.variantId,
          branch: branchId
        });
        
        if (!stock) {
          throw new Error(`Stock not found for product ${item.product}`);
        }
        
        if (adjustmentType === 'add') {
          stock.currentStock += item.quantity;
        } else if (adjustmentType === 'damage') {
          stock.damagedStock += item.quantity;
          stock.currentStock -= item.quantity;
        }
        
        await stock.save();
      }
      
      adjustment.status = 'completed';
    }
    
    await adjustment.save();
    
    res.status(201).json({
      success: true,
      data: adjustment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.transferStock = async (req, res) => {
  try {
    const { fromBranch, toBranch, items, notes } = req.body;
    
    // Generate transfer number
    const transferCount = await StockTransfer.countDocuments();
    const transferNumber = `TR${String(transferCount + 1).padStart(6, '0')}`;
    
    // Validate items have sufficient stock
    for (const item of items) {
      const sourceStock = await Stock.findOne({
        product: item.product,
        variantId: item.variantId,
        branch: fromBranch
      });
      
      if (!sourceStock || sourceStock.availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.product}`
        });
      }
    }
    
    // Create transfer record
    const transfer = new StockTransfer({
      transferNumber,
      fromBranch,
      toBranch,
      items,
      requestedBy: req.user.id,
      notes,
      status: 'pending' // Requires approval
    });
    
    await transfer.save();
    
    // Create stock adjustment for source branch
    const adjustment = new StockAdjustment({
      branch: fromBranch,
      adjustmentType: 'transfer',
      reason: `Transfer to branch ${toBranch}`,
      items: items.map(item => ({
        ...item,
        toLocation: 'in-transit'
      })),
      adjustedBy: req.user.id,
      referenceNumber: transferNumber,
      remarks: `Stock transfer ${transferNumber}`
    });
    
    await adjustment.save();
    
    res.status(201).json({
      success: true,
      data: transfer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.receiveTransfer = async (req, res) => {
  try {
    const { transferId } = req.params;
    const { receivedItems } = req.body;
    
    const transfer = await StockTransfer.findById(transferId);
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }
    
    // Update received quantities
    for (const receivedItem of receivedItems) {
      const transferItem = transfer.items.find(item => 
        item.product.toString() === receivedItem.product &&
        item.variantId.toString() === receivedItem.variantId
      );
      
      if (transferItem) {
        transferItem.receivedQuantity = receivedItem.receivedQuantity;
        transferItem.transferredQuantity = receivedItem.receivedQuantity;
        
        // Update destination stock
        const destStock = await Stock.findOne({
          product: receivedItem.product,
          variantId: receivedItem.variantId,
          branch: transfer.toBranch
        });
        
        if (destStock) {
          destStock.currentStock += receivedItem.receivedQuantity;
          destStock.inTransitStock -= receivedItem.receivedQuantity;
          await destStock.save();
        } else {
          // Create new stock record if doesn't exist
          const newStock = new Stock({
            product: receivedItem.product,
            variantId: receivedItem.variantId,
            branch: transfer.toBranch,
            location: 'warehouse',
            currentStock: receivedItem.receivedQuantity,
            availableStock: receivedItem.receivedQuantity
          });
          await newStock.save();
        }
        
        // Update source stock (remove from in-transit)
        const sourceStock = await Stock.findOne({
          product: receivedItem.product,
          variantId: receivedItem.variantId,
          branch: transfer.fromBranch
        });
        
        if (sourceStock) {
          sourceStock.inTransitStock -= receivedItem.receivedQuantity;
          await sourceStock.save();
        }
      }
    }
    
    // Check if all items received
    const allReceived = transfer.items.every(item => 
      item.receivedQuantity >= item.quantity
    );
    
    if (allReceived) {
      transfer.status = 'completed';
      transfer.actualDeliveryDate = new Date();
    } else {
      transfer.status = 'partially-received';
    }
    
    transfer.receivedBy = req.user.id;
    await transfer.save();
    
    res.json({
      success: true,
      data: transfer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const { branchId } = req.params;
    
    const lowStockItems = await Stock.find({
      branch: branchId,
      isLowStock: true
    })
    .populate('product', 'productName sku supplierInfo')
    .populate('branch', 'name');
    
    // Get variant details
    for (let stock of lowStockItems) {
      const product = await Product.findById(stock.product);
      if (product) {
        stock.variantDetails = product.variants.id(stock.variantId);
      }
    }
    
    // Group by supplier for reorder suggestions
    const supplierGroups = {};
    lowStockItems.forEach(stock => {
      if (stock.product.supplierInfo && stock.product.supplierInfo.supplier) {
        const supplierId = stock.product.supplierInfo.supplier._id || stock.product.supplierInfo.supplier;
        if (!supplierGroups[supplierId]) {
          supplierGroups[supplierId] = {
            supplier: stock.product.supplierInfo.supplier,
            items: []
          };
        }
        supplierGroups[supplierId].items.push({
          product: stock.product,
          variant: stock.variantDetails,
          stock: stock
        });
      }
    });
    
    res.json({
      success: true,
      data: lowStockItems,
      suggestions: Object.values(supplierGroups),
      count: lowStockItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getStockHistory = async (req, res) => {
  try {
    const { productId, variantId, branchId } = req.query;
    
    let query = {};
    if (productId) query.product = productId;
    if (variantId) query['items.variantId'] = variantId;
    if (branchId) query.branch = branchId;
    
    const adjustments = await StockAdjustment.find(query)
      .populate('adjustedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    
    const transfers = await StockTransfer.find({
      $or: [
        { fromBranch: branchId },
        { toBranch: branchId }
      ]
    })
    .populate('fromBranch toBranch requestedBy approvedBy receivedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json({
      success: true,
      data: {
        adjustments,
        transfers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};