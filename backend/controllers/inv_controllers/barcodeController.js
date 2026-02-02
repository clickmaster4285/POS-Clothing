const Barcode = require('../../models/inv_model/barcode.model');
const LabelTemplate = require('../../models/inv_model/barcode.model');
const PrintJob = require('../../models/inv_model/barcode.model');
const Product = require('../../models/inv_model/product.model');

exports.generateBarcode = async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    
    // Check if barcode already exists
    const existingBarcode = await Barcode.findOne({
      product: productId,
      variantId
    });
    
    if (existingBarcode) {
      return res.json({
        success: true,
        data: existingBarcode,
        message: 'Barcode already exists'
      });
    }
    
    // Generate new barcode
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Generate EAN13 barcode
    const generateEAN13 = () => {
      let ean = '2'; // Starting digit for internal use
      for (let i = 0; i < 11; i++) {
        ean += Math.floor(Math.random() * 10);
      }
      
      // Calculate check digit
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(ean[i]) * (i % 2 === 0 ? 1 : 3);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      
      return ean + checkDigit;
    };
    
    const barcode = new Barcode({
      product: productId,
      variantId,
      barcode: generateEAN13(),
      barcodeType: 'EAN13',
      branch: req.body.branch,
      createdBy: req.user.id
    });
    
    await barcode.save();
    
    res.status(201).json({
      success: true,
      data: barcode
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBarcodes = async (req, res) => {
  try {
    const { branchId, productId, search, page = 1, limit = 50 } = req.query;
    
    let query = {};
    if (branchId) query.branch = branchId;
    if (productId) query.product = productId;
    if (search) {
      query.$or = [
        { barcode: { $regex: search, $options: 'i' } },
        { 'product.productName': { $regex: search, $options: 'i' } }
      ];
    }
    
    const barcodes = await Barcode.find(query)
      .populate('product', 'productName sku primaryImage')
      .populate('branch', 'name')
      .populate('createdBy', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Add variant details
    for (let barcode of barcodes) {
      const product = await Product.findById(barcode.product);
      if (product) {
        barcode.variantDetails = product.variants.id(barcode.variantId);
      }
    }
    
    const total = await Barcode.countDocuments(query);
    
    res.json({
      success: true,
      data: barcodes,
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

exports.scanBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    
    const barcodeRecord = await Barcode.findOne({ barcode })
      .populate('product', 'productName sku brand category variants price primaryImage')
      .populate('branch', 'name location');
    
    if (!barcodeRecord) {
      return res.status(404).json({
        success: false,
        message: 'Barcode not found'
      });
    }
    
    // Get product details
    const product = await Product.findById(barcodeRecord.product);
    const variant = product.variants.id(barcodeRecord.variantId);
    
    // Get stock information
    const stock = await Stock.findOne({
      product: barcodeRecord.product,
      variantId: barcodeRecord.variantId,
      branch: barcodeRecord.branch
    });
    
    // Update printed count
    barcodeRecord.printedCount += 1;
    barcodeRecord.lastPrinted = new Date();
    await barcodeRecord.save();
    
    res.json({
      success: true,
      data: {
        barcode: barcodeRecord,
        product: {
          ...product.toObject(),
          variant: variant
        },
        stock,
        branch: barcodeRecord.branch
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createLabelTemplate = async (req, res) => {
  try {
    const templateData = req.body;
    
    // Validate required fields
    if (!templateData.fields || templateData.fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Template must have at least one field'
      });
    }
    
    const labelTemplate = new LabelTemplate({
      ...templateData,
      createdBy: req.user.id
    });
    
    await labelTemplate.save();
    
    // If this is set as default, update other templates
    if (templateData.isDefault) {
      await LabelTemplate.updateMany(
        { _id: { $ne: labelTemplate._id }, templateType: templateData.templateType },
        { $set: { isDefault: false } }
      );
    }
    
    res.status(201).json({
      success: true,
      data: labelTemplate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getLabelTemplates = async (req, res) => {
  try {
    const { templateType } = req.query;
    
    let query = {};
    if (templateType) query.templateType = templateType;
    
    const templates = await LabelTemplate.find(query)
      .populate('createdBy', 'name')
      .sort({ isDefault: -1, createdAt: -1 });
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createPrintJob = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { templateId, items, printerName, notes } = req.body;
    
    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items to print'
      });
    }
    
    // Calculate total labels
    const totalLabels = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const printJob = new PrintJob({
      branch: branchId,
      template: templateId,
      items,
      totalLabels,
      printerName,
      notes,
      printedBy: req.user.id
    });
    
    await printJob.save();
    
    res.status(201).json({
      success: true,
      data: printJob
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.processPrintJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const printJob = await PrintJob.findById(jobId)
      .populate('template')
      .populate('items.product', 'productName sku')
      .populate('branch', 'name');
    
    if (!printJob) {
      return res.status(404).json({
        success: false,
        message: 'Print job not found'
      });
    }
    
    if (printJob.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Print job is already ${printJob.status}`
      });
    }
    
    // Update printed quantities
    for (let item of printJob.items) {
      item.printedQuantity = item.quantity;
      
      // Update barcode printed count
      const barcode = await Barcode.findOne({
        product: item.product,
        variantId: item.variantId,
        barcode: item.barcode
      });
      
      if (barcode) {
        barcode.printedCount += item.quantity;
        barcode.lastPrinted = new Date();
        await barcode.save();
      }
    }
    
    printJob.status = 'completed';
    printJob.printDate = new Date();
    await printJob.save();
    
    // Generate label data for printing
    const labelData = await Promise.all(printJob.items.map(async item => {
      const product = await Product.findById(item.product);
      const variant = product.variants.id(item.variantId);
      
      return {
        productName: product.productName,
        sku: variant.variantSku || product.sku,
        barcode: item.barcode,
        price: variant.price?.retailPrice,
        size: variant.size,
        color: variant.color,
        brand: product.brand,
        quantity: item.quantity
      };
    }));
    
    res.json({
      success: true,
      data: {
        printJob,
        labels: labelData,
        totalLabels: printJob.totalLabels
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPrintJobs = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let query = { branch: branchId };
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const printJobs = await PrintJob.find(query)
      .populate('template', 'templateName')
      .populate('printedBy', 'name')
      .populate('items.product', 'productName')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await PrintJob.countDocuments(query);
    
    res.json({
      success: true,
      data: printJobs,
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