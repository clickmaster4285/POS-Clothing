const {StockAdjustment , StockTransfer , Stock}= require('../../models/inv_model/stock.model');
const Branch = require("../../models/branch.model")
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
exports.getAllStock = async (req, res) => {
  try {
    const {
      location,
      lowStock,
      search,
      category,
      page = 1,
      limit = 50
    } = req.query;

    let query = {};

    if (location) query.location = location;
    if (lowStock === 'true') query.isLowStock = true;

    // 🔍 Product filtering
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
      query.product = { $in: products.map(p => p._id) };
    }

    const stocks = await Stock.find(query)
      .populate({
        path: 'product',
        select: 'productName sku variants primaryImage'
      })
      .populate({
        path: 'branch',
        select: 'branch_name'
      })
      .sort({ isLowStock: -1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const formattedStocks = stocks.map(stock => {
      let variant = null;

      // 1️⃣ Try matching by variantId
      if (stock.variantId && stock.product?.variants?.length) {
        variant = stock.product.variants.find(
          v => String(v._id) === String(stock.variantId)
        );
      }

      // 2️⃣ Fallback → first variant (SAFE default)
      if (!variant && stock.product?.variants?.length) {
        variant = stock.product.variants[0];
      }

      const variantName = variant
        ? [variant.size, variant.color, variant.style, variant.fitType]
            .filter(Boolean)
            .join(' / ')
        : null;

      return {
        ...stock,
        branchName: stock.branch?.branch_name ?? null,
        variantName
      };
    });

    const total = await Stock.countDocuments(query);

    res.json({
      success: true,
      data: formattedStocks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
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



// exports.adjustStock = async (req, res) => {
//   try {
//     const { branchId } = req.params;
//     const { adjustmentType, reason, items, remarks } = req.body;

//     const validTypes = ['add', 'remove', 'transfer', 'damage', 'return'];
//     if (!validTypes.includes(adjustmentType)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid adjustment type'
//       });
//     }

// const branchDoc = await Branch.findById(branchId)

// if (!branchDoc) {
//   return res.status(404).json({
//     success: false,
//     message: "Branch not found"
//   })
// }

//     const branchLocation = `${branchDoc.branch_name}, ${branchDoc.address.city}`
  

//     const adjustment = new StockAdjustment({
//       branch: branchId,
//       adjustmentType,
//       reason,
//       items,
//       adjustedBy: req.user.id,
//       remarks,
//       status: 'pending'
//     });

//     if (adjustmentType === 'add' || adjustmentType === 'damage') {
//       adjustment.status = 'approved';
//       adjustment.approvedBy = req.user.id;
//       adjustment.approvalDate = new Date();

//       for (const item of items) {
//         let stock = await Stock.findOne({
//           product: item.product,
//           variantId: item.variantId,
//           branch: branchId
//         });

//         // ✅ ADD: create stock if it doesn't exist
//         if (!stock && adjustmentType === 'add') {
//           await Stock.create({
//             product: item.product,
//             variantId: item.variantId,
//             branch: branchId,
//              location: branchLocation,
//             currentStock: item.quantity,
//             availableStock: item.quantity,
//             damagedStock: 0,
//             inTransitStock: 0
//           });
//           continue;
//         }

//         if (!stock) {
//           throw new Error(`Stock not found for product ${item.product}`);
//         }

//         if (adjustmentType === 'add') {
//           stock.currentStock += item.quantity;
//           stock.availableStock += item.quantity;
//         }

//         if (adjustmentType === 'damage') {
//           if (stock.currentStock < item.quantity) {
//             throw new Error("Insufficient stock for damage adjustment");
//           }
//           stock.currentStock -= item.quantity;
//           stock.availableStock -= item.quantity;
//           stock.damagedStock += item.quantity;
//         }

//         await stock.save();
//       }

//       adjustment.status = 'completed';
//     }

//     await adjustment.save();

//     res.status(201).json({
//       success: true,
//       data: adjustment
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// exports.adjustStock = async (req, res) => {
//   try {
//     const { branchId } = req.params;
//     const { adjustmentType, reason, items, remarks } = req.body;

//     const validTypes = ['add', 'remove', 'damage'];
//     if (!validTypes.includes(adjustmentType)) {
//       return res.status(400).json({ success: false, message: 'Invalid adjustment type' });
//     }

//     const branchDoc = await Branch.findById(branchId);
//     if (!branchDoc) return res.status(404).json({ success: false, message: "Branch not found" });

//     const branchLocation = `${branchDoc.branch_name}, ${branchDoc.address.city}`;

//     const adjustment = new StockAdjustment({
//       branch: branchId,
//       adjustmentType,
//       reason,
//       items,
//       adjustedBy: req.user.id,
//       remarks,
//       status: 'pending'
//     });

//     for (const item of items) {
//       // 1️⃣ Update branch stock
//       let stock = await Stock.findOne({
//         product: item.product,
//         variantId: item.variantId,
//         branch: branchId
//       });

//       if (!stock && adjustmentType === 'add') {
//         stock = await Stock.create({
//           product: item.product,
//           variantId: item.variantId,
//           branch: branchId,
//           location: branchLocation,
//           currentStock: item.quantity,
//           availableStock: item.quantity,
//           damagedStock: 0,
//           inTransitStock: 0
//         });
//       }

//       if (!stock && adjustmentType !== 'add') {
//         throw new Error(`Stock not found for product ${item.product}`);
//       }

//       if (adjustmentType === 'add') {
//         stock.currentStock += item.quantity;
//         stock.availableStock += item.quantity;
//       } else if (adjustmentType === 'remove') {
//         if (stock.currentStock < item.quantity) throw new Error('Insufficient stock to remove');
//         stock.currentStock -= item.quantity;
//         stock.availableStock -= item.quantity;
//       } else if (adjustmentType === 'damage') {
//         if (stock.currentStock < item.quantity) throw new Error('Insufficient stock for damage');
//         stock.currentStock -= item.quantity;
//         stock.availableStock -= item.quantity;
//         stock.damagedStock += item.quantity;
//       }

//       await stock.save();

//       // 2️⃣ Update product variant quantity
//       const product = await Product.findById(item.product);
//       if (!product) throw new Error(`Product ${item.product} not found`);

//       const variant = product.variants.id(item.variantId);
//       if (!variant) throw new Error(`Variant ${item.variantId} not found`);

//       if (adjustmentType === 'add') {
//         // User added stock → decrease total product quantity
//         variant.quantity = (Number(variant.quantity) || 0) - Number(item.quantity);
//       } else if (adjustmentType === 'remove') {
//         // User removed stock → increase total product quantity
//         variant.quantity = (Number(variant.quantity) || 0) + Number(item.quantity);
//       }
//       // damage does not change total product quantity

//       // 3️⃣ Add variant stock history
//       variant.stockHistory.push({
//         date: new Date(),
//         quantityChange:
//           adjustmentType === 'add'
//             ? -Number(item.quantity)
//             : adjustmentType === 'remove'
//             ? Number(item.quantity)
//             : -Number(item.quantity),
//         reason,
//         changedBy: req.user.id
//       });

//       await product.save();
//     }

//     adjustment.status = 'completed';
//     adjustment.approvalDate = new Date();
//     adjustment.approvedBy = req.user.id;

//     await adjustment.save();

//     res.status(201).json({ success: true, data: adjustment });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };



exports.adjustStock = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { adjustmentType, reason, items, remarks } = req.body;

    const validTypes = ["add", "remove", "damage"];
    if (!validTypes.includes(adjustmentType)) {
      return res.status(400).json({ success: false, message: "Invalid adjustment type" });
    }

    const branchDoc = await Branch.findById(branchId);
    if (!branchDoc) return res.status(404).json({ success: false, message: "Branch not found" });

    const branchLocation = `${branchDoc.branch_name}, ${branchDoc.address.city}`;

    // Create a new StockAdjustment document
    const adjustment = new StockAdjustment({
      branch: branchId,
      adjustmentType,
      reason,
      items,
      adjustedBy: req.user.id,
      remarks,
      status: "pending",
    });

    // Process each item in the adjustment
    for (const item of items) {
      // 1️⃣ Find stock for this branch and variant
      let stock = await Stock.findOne({
        product: item.product,
        variantId: item.variantId,
        branch: branchId,
      });

      // Handle first-time stock creation (only for 'add')
      if (!stock) {
        if (adjustmentType === "add") {
          stock = await Stock.create({
            product: item.product,
            variantId: item.variantId,
            branch: branchId,
            location: branchLocation,
            currentStock: item.quantity,
            availableStock: item.quantity,
            damagedStock: 0,
            inTransitStock: 0,
          });
        } else {
          // Cannot remove or damage stock that does not exist
          throw new Error(`Stock not found for product ${item.product} and variant ${item.variantId}`);
        }
      } else {
        // Stock exists → update based on adjustment type
        if (adjustmentType === "add") {
          stock.currentStock += item.quantity;
          stock.availableStock += item.quantity;
        } else if (adjustmentType === "remove") {
          if (stock.currentStock < item.quantity) throw new Error("Insufficient stock to remove");
          stock.currentStock -= item.quantity;
          stock.availableStock -= item.quantity;
        } else if (adjustmentType === "damage") {
          if (stock.currentStock < item.quantity) throw new Error("Insufficient stock for damage");
          stock.currentStock -= item.quantity;
          stock.availableStock -= item.quantity;
          stock.damagedStock += item.quantity;
        }
      }

      await stock.save();

      // 2️⃣ Update product variant quantity
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product ${item.product} not found`);

      const variant = product.variants.id(item.variantId);
      if (!variant) throw new Error(`Variant ${item.variantId} not found`);

      if (adjustmentType === "add") {
        // When stock is added → decrease variant total quantity
        variant.quantity = (Number(variant.quantity) || 0) - Number(item.quantity);
      } else if (adjustmentType === "remove") {
        // When stock is removed → increase variant total quantity
        variant.quantity = (Number(variant.quantity) || 0) + Number(item.quantity);
      }
      // Damage does not change total variant quantity

      // 3️⃣ Add stock history to variant
      variant.stockHistory.push({
        date: new Date(),
        quantityChange:
          adjustmentType === "add"
            ? -Number(item.quantity)
            : adjustmentType === "remove"
            ? Number(item.quantity)
            : -Number(item.quantity), // damage counts as negative change
        reason,
        changedBy: req.user.id,
      });

      await product.save();
    }

    // Mark adjustment as completed
    adjustment.status = "completed";
    adjustment.approvalDate = new Date();
    adjustment.approvedBy = req.user.id;

    await adjustment.save();

    res.status(201).json({ success: true, data: adjustment });
  } catch (error) {
    console.error("Adjust stock error:", error.message);
    res.status(400).json({ success: false, message: error.message });
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
      
      console.log("sourceStock" , sourceStock)
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
      availableStock: { $lt: 5 }   // 🔥 ONLY rule
    })
      .populate('product', 'productName sku supplierInfo primaryImage')
      .populate('branch', 'branch_name')
      .lean();

    // Attach variant details
    for (const stock of lowStockItems) {
      const product = await Product.findById(stock.product).select('variants');
      stock.variantDetails =
        product?.variants?.find(v => String(v._id) === String(stock.variantId)) || null;
    }

    res.json({
      success: true,
      threshold: 5,
      count: lowStockItems.length,
      data: lowStockItems
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

// stock.controller.js
exports.receiveStock = async (req, res) => {
  try {
    const { branchId } = req.params;           
    const { items, supplierId, purchaseOrderId, notes } = req.body;

    

    for (const item of items) {
      let stock = await Stock.findOne({
        product: item.product,
        variantId: item.variantId,
        branch: branchId
      });

      const quantity = Number(item.quantity);

      if (!stock) {
        // First time — create stock record
        stock = new Stock({
          product: item.product,
          variantId: item.variantId,
          branch: branchId,
          currentStock: quantity,
          availableStock: quantity,     
          damagedStock: 0,
          inTransitStock: 0,
          location: item.location || 'main-warehouse', 
          lastReceived: new Date(),
          
        });
      } else {
        // Already exists → just add
        stock.currentStock += quantity;
        stock.availableStock += quantity;
        stock.lastReceived = new Date();
      }

      await stock.save();
    }

   

    res.status(201).json({
      success: true,
      message: `Received ${items.length} item(s) successfully`,
   
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};



exports.getStockAdjustments = async (req, res) => {
  try {
    const {
      branchId,
      status,
      adjustmentType,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (branchId) query.branch = branchId;
    if (status) query.status = status;
    if (adjustmentType) query.adjustmentType = adjustmentType;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const adjustments = await StockAdjustment.find(query)
      .populate({
        path: 'branch',
        select: 'branch_name'
      })
      .populate('adjustedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await StockAdjustment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: adjustments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch adjustments'
    });
  }
};

// ────────────────────────────────────────────────
// 3. Get All Stock Transfers (new)
exports.getStockTransfers = async (req, res) => {
  try {
    const {
      branchId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (branchId) {
      query.$or = [
        { fromBranch: branchId },
        { toBranch: branchId }
      ];
    }

    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transfers = await StockTransfer.find(query)
       .populate({
        path: 'fromBranch',
        select: 'branch_name'
      })
         .populate({
        path: 'toBranch',
        select: 'branch_name'
      })
     
     
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('receivedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    const total = await StockTransfer.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transfers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transfers'
    });
  }
};
