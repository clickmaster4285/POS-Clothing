const StockCount = require('../../models/inv_model/audit.model');
const CycleCount = require('../../models/inv_model/audit.model');
const AuditReport = require('../../models/inv_model/audit.model');
const Stock = require('../../models/inv_model/stock.model');
const Product = require('../../models/inv_model/product.model');

exports.startStockCount = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { countType, location, categories, brands, notes } = req.body;
    
    // Generate count number
    const countCount = await StockCount.countDocuments();
    const countNumber = `CNT${branchId.slice(-3)}${String(countCount + 1).padStart(6, '0')}`;
    
    // Build query for items to count
    let productQuery = {};
    if (categories && categories.length > 0) {
      productQuery.category = { $in: categories };
    }
    if (brands && brands.length > 0) {
      productQuery.brand = { $in: brands };
    }
    
    const products = await Product.find(productQuery).select('_id variants');
    
    // Prepare count items with expected quantities
    const countItems = [];
    for (const product of products) {
      for (const variant of product.variants) {
        const stock = await Stock.findOne({
          product: product._id,
          variantId: variant._id,
          branch: branchId,
          ...(location && { location })
        });
        
        if (stock) {
          countItems.push({
            product: product._id,
            variantId: variant._id,
            expectedQuantity: stock.currentStock,
            countedQuantity: 0,
            variance: 0
          });
        }
      }
    }
    
    const stockCount = new StockCount({
      countNumber,
      branch: branchId,
      countType,
      location,
      countedBy: [req.user.id],
      items: countItems,
      notes
    });
    
    await stockCount.save();
    
    res.status(201).json({
      success: true,
      data: stockCount
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateStockCount = async (req, res) => {
  try {
    const { countId } = req.params;
    const { items } = req.body;
    
    const stockCount = await StockCount.findById(countId);
    if (!stockCount) {
      return res.status(404).json({
        success: false,
        message: 'Stock count not found'
      });
    }
    
    if (stockCount.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Stock count is not in progress'
      });
    }
    
    // Update counted quantities
    for (const updatedItem of items) {
      const countItem = stockCount.items.find(item => 
        item.product.toString() === updatedItem.product &&
        item.variantId.toString() === updatedItem.variantId
      );
      
      if (countItem) {
        countItem.countedQuantity = updatedItem.countedQuantity;
        countItem.variance = updatedItem.countedQuantity - countItem.expectedQuantity;
        countItem.variancePercent = countItem.expectedQuantity > 0 ? 
          (countItem.variance / countItem.expectedQuantity) * 100 : 0;
        countItem.remarks = updatedItem.remarks;
      }
    }
    
    // Update totals
    stockCount.totalExpected = stockCount.items.reduce((sum, item) => sum + item.expectedQuantity, 0);
    stockCount.totalCounted = stockCount.items.reduce((sum, item) => sum + item.countedQuantity, 0);
    stockCount.totalVariance = stockCount.items.reduce((sum, item) => sum + item.variance, 0);
    
    await stockCount.save();
    
    res.json({
      success: true,
      data: stockCount
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.completeStockCount = async (req, res) => {
  try {
    const { countId } = req.params;
    
    const stockCount = await StockCount.findById(countId);
    if (!stockCount) {
      return res.status(404).json({
        success: false,
        message: 'Stock count not found'
      });
    }
    
    if (stockCount.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Stock count is not in progress'
      });
    }
    
    stockCount.status = 'completed';
    await stockCount.save();
    
    // Create audit report for discrepancies
    if (Math.abs(stockCount.totalVariance) > 0) {
      const discrepancies = stockCount.items.filter(item => item.variance !== 0);
      
      const auditReport = new AuditReport({
        branch: stockCount.branch,
        reportType: 'discrepancy',
        period: {
          startDate: stockCount.countDate,
          endDate: new Date()
        },
        findings: discrepancies.map(item => ({
          description: `Stock variance for product ${item.product}`,
          product: item.product,
          variantId: item.variantId,
          quantity: Math.abs(item.variance),
          value: 0, // Can be calculated with product cost
          reason: item.variance > 0 ? 'Overstock' : 'Shrinkage'
        })),
        totalShrinkage: Math.abs(stockCount.totalVariance),
        shrinkagePercent: stockCount.totalExpected > 0 ? 
          (Math.abs(stockCount.totalVariance) / stockCount.totalExpected) * 100 : 0,
        preparedBy: req.user.id
      });
      
      await auditReport.save();
    }
    
    res.json({
      success: true,
      data: stockCount,
      message: 'Stock count completed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCycleCounts = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { activeOnly } = req.query;
    
    let query = { branch: branchId };
    if (activeOnly === 'true') {
      query.isActive = true;
    }
    
    const cycleCounts = await CycleCount.find(query)
      .populate('categories', 'categoryName')
      .populate('brands', 'brandName')
      .populate('createdBy', 'name')
      .sort({ nextCountDate: 1 });
    
    // Get upcoming counts
    const upcomingCounts = cycleCounts.filter(count => 
      count.isActive && count.nextCountDate <= new Date()
    );
    
    res.json({
      success: true,
      data: cycleCounts,
      upcomingCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createCycleCount = async (req, res) => {
  try {
    const { branchId } = req.params;
    const cycleCountData = req.body;
    
    // Calculate next count date based on frequency
    const nextCountDate = new Date();
    switch (cycleCountData.frequency) {
      case 'daily':
        nextCountDate.setDate(nextCountDate.getDate() + 1);
        break;
      case 'weekly':
        nextCountDate.setDate(nextCountDate.getDate() + 7);
        break;
      case 'monthly':
        nextCountDate.setMonth(nextCountDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextCountDate.setMonth(nextCountDate.getMonth() + 3);
        break;
    }
    
    const cycleCount = new CycleCount({
      branch: branchId,
      ...cycleCountData,
      nextCountDate,
      createdBy: req.user.id
    });
    
    await cycleCount.save();
    
    res.status(201).json({
      success: true,
      data: cycleCount
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.runCycleCount = async (req, res) => {
  try {
    const { countId } = req.params;
    
    const cycleCount = await CycleCount.findById(countId);
    if (!cycleCount || !cycleCount.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Cycle count not found or inactive'
      });
    }
    
    if (cycleCount.nextCountDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cycle count is not due yet'
      });
    }
    
    // Start a new stock count
    const countData = {
      countType: 'cycle',
      location: cycleCount.location,
      categories: cycleCount.categories,
      brands: cycleCount.brands
    };
    
    const countCount = await StockCount.countDocuments();
    const countNumber = `CYC${cycleCount.branch.slice(-3)}${String(countCount + 1).padStart(6, '0')}`;
    
    // Build query for items to count
    let productQuery = {};
    if (cycleCount.categories && cycleCount.categories.length > 0) {
      productQuery.category = { $in: cycleCount.categories };
    }
    if (cycleCount.brands && cycleCount.brands.length > 0) {
      productQuery.brand = { $in: cycleCount.brands };
    }
    
    const products = await Product.find(productQuery).select('_id variants');
    
    const countItems = [];
    for (const product of products) {
      for (const variant of product.variants) {
        const stock = await Stock.findOne({
          product: product._id,
          variantId: variant._id,
          branch: cycleCount.branch,
          ...(cycleCount.location && { location: cycleCount.location })
        });
        
        if (stock) {
          countItems.push({
            product: product._id,
            variantId: variant._id,
            expectedQuantity: stock.currentStock,
            countedQuantity: 0,
            variance: 0
          });
        }
      }
    }
    
    const stockCount = new StockCount({
      countNumber,
      branch: cycleCount.branch,
      countType: 'cycle',
      location: cycleCount.location,
      countedBy: [req.user.id],
      items: countItems
    });
    
    await stockCount.save();
    
    // Update cycle count schedule
    let nextDate = new Date();
    switch (cycleCount.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
    }
    
    cycleCount.lastCountDate = new Date();
    cycleCount.nextCountDate = nextDate;
    await cycleCount.save();
    
    res.status(201).json({
      success: true,
      data: stockCount,
      message: 'Cycle count started successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAuditReports = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { reportType, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let query = { branch: branchId };
    
    if (reportType) query.reportType = reportType;
    if (startDate || endDate) {
      query.reportDate = {};
      if (startDate) query.reportDate.$gte = new Date(startDate);
      if (endDate) query.reportDate.$lte = new Date(endDate);
    }
    
    const auditReports = await AuditReport.find(query)
      .populate('preparedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('correctiveActions.responsible', 'name email')
      .populate('findings.product', 'productName sku')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ reportDate: -1 });
    
    const total = await AuditReport.countDocuments(query);
    
    // Get summary statistics
    const summary = await AuditReport.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$reportType',
          count: { $sum: 1 },
          totalShrinkage: { $sum: '$totalShrinkage' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: auditReports,
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

exports.createAuditReport = async (req, res) => {
  try {
    const { branchId } = req.params;
    const reportData = req.body;
    
    const auditReport = new AuditReport({
      branch: branchId,
      ...reportData,
      preparedBy: req.user.id
    });
    
    await auditReport.save();
    
    res.status(201).json({
      success: true,
      data: auditReport
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCorrectiveAction = async (req, res) => {
  try {
    const { reportId, actionId } = req.params;
    const { status, comments } = req.body;
    
    const auditReport = await AuditReport.findById(reportId);
    if (!auditReport) {
      return res.status(404).json({
        success: false,
        message: 'Audit report not found'
      });
    }
    
    const action = auditReport.correctiveActions.id(actionId);
    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Corrective action not found'
      });
    }
    
    action.status = status;
    if (comments) {
      action.comments = comments;
    }
    
    await auditReport.save();
    
    res.json({
      success: true,
      data: action
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};