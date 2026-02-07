const Product = require('../../models/inv_model/product.model');
const { Stock } = require('../../models/inv_model/stock.model');
const {Supplier} = require('../../models/supplier.model')
// const Category = require('../models/Category');
// const Brand = require('../models/Brand');

exports.createProduct = async (req, res) => {
  console.log('req.body' , req.body)
  try {
    const productData = { ...req.body }; // avoid mutating req.body directly

    // 1. Generate main product SKU if missing
    if (!productData.sku) {
      const count = await Product.countDocuments();
      productData.sku = `PROD${String(count + 1).padStart(6, '0')}`;
    }

    // Clean / normalize base SKU (recommended)
    const baseSku = (productData.sku || "").trim().toUpperCase();

    // 2. Generate variant SKUs – only if variants exist
    if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
      productData.variants = productData.variants.map((variant, index) => {
        // Skip generation if user already provided a variantSku
        if (variant.variantSku) {
          return variant;
        }

        // Size code: first 2 uppercase letters or fallback
        let sizeCode = "XX";
        if (variant.size && typeof variant.size === "string" && variant.size.trim()) {
          sizeCode = variant.size.trim().toUpperCase().substring(0, 2);
        }

        // Color code: first 3 uppercase letters or fallback
        let colorCode = "XXX";
        if (variant.color && typeof variant.color === "string" && variant.color.trim()) {
          colorCode = variant.color.trim().toUpperCase().substring(0, 3);
        }

        // Final format: [product-sku]-[size]-[color]
        // Example: TSHIRT001-M-BLK
        variant.variantSku = `${baseSku}-${sizeCode}-${colorCode}`;

        // Optional: add index if you have many similar variants
        // variant.variantSku += `-${String(index + 1).padStart(2, '0')}`;

        return variant;
      });
    }

    // 3. Create the document
    const product = new Product(productData);

    // Optional: basic validation before save
    // You can add more checks here if you want to enforce rules
    if (product.variants?.length > 0) {
      const hasDuplicateSkus = new Set(
        product.variants.map(v => v.variantSku)
      ).size !== product.variants.length;

      if (hasDuplicateSkus) {
        throw new Error("Generated variant SKUs contain duplicates – please review sizes/colors");
      }
    }

    await product.save();

    // 4. Create stock records (your existing logic – unchanged)
    if (req.body.branches && req.body.branches.length > 0) {
      const stockPromises = req.body.branches.flatMap(branchId =>
        product.variants.map(async (variant) => {
          const stock = new Stock({
            product: product._id,
            variantId: variant._id,          
            branch: branchId,
            location: "warehouse",
            currentStock: 0,
            availableStock: 0
          });
          await stock.save();
        })
      );
      await Promise.all(stockPromises);
    }

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create product"
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, brand, department, inStock } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (department) query.department = department;
    
    const products = await Product.find(query)
      .populate('category', 'categoryName')
      .populate('brand', 'brandName')
     .populate({
        path: 'supplierInfo.supplier',
        select: 'company_name'   // ← correct field name
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    // Add stock information if requested
    if (inStock === 'true' && req.query.branch) {
      for (let product of products) {
        for (let variant of product.variants) {
          const stock = await Stock.findOne({
            product: product._id,
            variantId: variant._id,
            branch: req.query.branch
          });
          variant.stockInfo = stock || { currentStock: 0 };
        }
      }
    }
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
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

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'categoryName')
      .populate('brand', 'brandName')
      .populate('supplierInfo.supplier', 'supplierName');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get stock across all branches
    if (req.query.includeStock === 'true') {
      const stocks = await Stock.find({ product: product._id })
        .populate('branch', 'name code')
        .lean();
      
      product.variants = product.variants.map(variant => {
        const variantStocks = stocks.filter(s => 
          s.variantId.toString() === variant._id.toString()
        );
        return {
          ...variant.toObject(),
          stocks: variantStocks
        };
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  console.log('req.body' , req.body)
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if product has stock in any branch
    const existingStock = await Stock.findOne({ product: product._id });
    if (existingStock && existingStock.currentStock > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with existing inventory'
      });
    }
    
    // Soft delete by marking as inactive
    product.isActive = false;
    await product.save();
    
    // Delete stock records
    await Stock.deleteMany({ product: product._id });
    
    res.json({
      success: true,
      message: 'Product deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



exports.addProductVariant = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const variantData = req.body;
    const variantCount = product.variants.length;
    
    // Generate variant SKU
    const variantCode = variantData.size ? variantData.size.substring(0, 2) : 'VR';
    const colorCode = variantData.color ? variantData.color.substring(0, 3) : 'DEF';
    variantData.variantSku = `${product.sku}-${colorCode}-${variantCode}-${String(variantCount + 1).padStart(2, '0')}`;
    
    product.variants.push(variantData);
    await product.save();
    
    // Create stock records for all branches
    if (req.body.branches && req.body.branches.length > 0) {
      const newVariant = product.variants[product.variants.length - 1];
      const stockPromises = req.body.branches.map(async branchId => {
        const stock = new Stock({
          product: product._id,
          variantId: newVariant._id,
          branch: branchId,
          location: 'warehouse',
          currentStock: 0,
          availableStock: 0
        });
        await stock.save();
      });
      await Promise.all(stockPromises);
    }
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateVariantPrice = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const priceData = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
    }
    
    // Add to price history before updating
    if (!variant.priceHistory) variant.priceHistory = [];
    
    variant.priceHistory.push({
      date: new Date(),
      price: variant.price.retailPrice,
      type: 'previous',
      changedBy: req.user.id
    });
    
    // Update price
    variant.price = { ...variant.price, ...priceData };
    variant.priceHistory.push({
      date: new Date(),
      price: priceData.retailPrice || variant.price.retailPrice,
      type: 'update',
      changedBy: req.user.id
    });
    
    await product.save();
    
    res.json({
      success: true,
      data: variant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

