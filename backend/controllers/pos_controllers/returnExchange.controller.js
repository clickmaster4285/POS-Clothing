const ReturnExchange = require("../../models/pos_model/returnExchange.model");
const { Transaction } = require("../../models/pos_model/transaction.model");
const { Stock}= require('../../models/inv_model/stock.model');

// GET all return/exchange transactions
const getAllReturnExchanges = async (req, res) => {
  try {
    const transactions = await ReturnExchange.find().sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET return/exchange by original transaction ID
const getByOriginalTransaction = async (req, res) => {
  try {
    const { originalTransactionId } = req.params;
    const transactions = await ReturnExchange.find({ originalTransactionId });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const createReturnExchange = async (req, res) => {
  try {
    const payload = req.body;
    const userId = req.user._id;
    
    // Use branch from payload or user
    const branchId = payload.branch || req.user.branch_id;
    
    console.log("🏢 Using branch:", branchId);
    console.log("📦 Received payload:", payload);

    // 1️⃣ Create Return/Exchange Record
    const txnNumber = `RE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newReturn = new ReturnExchange({
      transactionNumber: txnNumber,
      ...payload,
      branch: branchId
    });
    await newReturn.save();

    // 2️⃣ Link to Original Transaction
    if (payload.originalTransactionId) {
      await Transaction.findByIdAndUpdate(payload.originalTransactionId, {
        $push: { returnExchangeIds: newReturn._id }
      });
    }

    // 3️⃣ Update Stock based on type
    if (payload.type === "return") {
      // ----- RETURN LOGIC -----
      for (const item of payload.items) {
        if (!item.variantId) {
          console.warn(`⚠️ Missing variantId for item ${item.productId}. Skipping stock update.`);
          continue;
        }

        const stockDoc = await Stock.findOne({
          product: item.productId,
          variantId: item.variantId,
          branch: branchId,
          color: item.color || "Default"
        });

        if (stockDoc) {
          stockDoc.currentStock += item.quantity;
          stockDoc.availableStock += item.quantity;
          stockDoc.history.push({
            action: "return",  // ✅ Using allowed enum value
            quantity: item.quantity,
            user: userId,
            timestamp: new Date()
          });
          await stockDoc.save();
          console.log(`✅ RETURN: Added ${item.quantity} back to stock. New stock: ${stockDoc.currentStock}`);
        } else {
          console.error(`❌ No stock record found for RETURN item:`, {
            product: item.productId,
            variant: item.variantId,
            color: item.color
          });
        }
      }
    } 
    else if (payload.type === "exchange") {
      // ----- EXCHANGE LOGIC -----
      
      // 1️⃣ Add original item back to stock
      if (payload.originalItem) {
        const originalStock = await Stock.findOne({
          product: payload.originalItem.productId,
          variantId: payload.originalItem.variantId,
          branch: branchId,
          color: payload.originalItem.color || "Default"
        });

        if (originalStock) {
          originalStock.currentStock += payload.originalItem.quantity;
          originalStock.availableStock += payload.originalItem.quantity;
          originalStock.history.push({
            action: "return",  // ✅ Using allowed enum value
            quantity: payload.originalItem.quantity,
            user: userId,
            timestamp: new Date()
          });
          await originalStock.save();
          console.log(`✅ EXCHANGE: Added original item back. New stock: ${originalStock.currentStock}`);
        } else {
          console.error(`❌ No stock record found for original item:`, {
            product: payload.originalItem.productId,
            variant: payload.originalItem.variantId,
            color: payload.originalItem.color
          });
        }
      }

      // 2️⃣ Deduct new exchanged item from stock
      if (payload.newItem) {
        const newStock = await Stock.findOne({
          product: payload.newItem.productId,
          variantId: payload.newItem.variantId,
          branch: branchId,
          color: payload.newItem.color || "Default"
        });

        if (newStock) {
          // Check if enough stock
          if (newStock.currentStock < payload.newItem.quantity) {
            console.warn(`⚠️ Insufficient stock for new item: ${newStock.currentStock} < ${payload.newItem.quantity}`);
          }
          
          newStock.currentStock -= payload.newItem.quantity;
          newStock.availableStock -= payload.newItem.quantity;
          newStock.history.push({
            action: "sale",  // ✅ Using allowed enum value (negative quantity indicates sale)
            quantity: -payload.newItem.quantity,
            user: userId,
            timestamp: new Date()
          });
          await newStock.save();
          console.log(`✅ EXCHANGE: Deducted new item. New stock: ${newStock.currentStock}`);
        } else {
          console.error(`❌ No stock record found for new item:`, {
            product: payload.newItem.productId,
            variant: payload.newItem.variantId,
            color: payload.newItem.color
          });
        }
      }
    }

    return res.status(201).json({ success: true, transaction: newReturn });

  } catch (err) {
    console.error("Return/Exchange creation error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};



const voidReturnExchange = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await ReturnExchange.findByIdAndUpdate(
      id,
      { status: "voided" },
      { new: true }
    );

    if (!transaction)
      return res.status(404).json({ success: false, message: "Transaction not found" });

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE a return/exchange (e.g., payment adjustment)
const updateReturnExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const transaction = await ReturnExchange.findByIdAndUpdate(
      id,
      payload,
      { new: true }
    );

    if (!transaction)
      return res.status(404).json({ success: false, message: "Transaction not found" });

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// const getTransactionFullDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const transaction = await Transaction.findById(id)
//       .populate("returnExchangeIds")
//       .lean();

//     if (!transaction) {
//       return res.status(404).json({ success: false, message: "Transaction not found" });
//     }

//     // Build a map of original cart items with unique identifiers
//     // Use combination of productId and item index to handle duplicate products
//     const originalItemsMap = new Map();
//     transaction.cartItems.forEach((item, index) => {



//       const itemKey = `${item.productId}_${index}`; // Unique per cart entry
    
//       originalItemsMap.set(itemKey, {
//         id: itemKey,
//         productId: item.productId,
//         name: item.name,
//         purchasedQty: item.quantity,
//         returnedQty: 0,
//         exchangedQty: 0,
//         remainingQty: item.quantity,
//         unitPrice: item.unitPrice,
//         size: item.size,
//         color: item.color,
//         sku: item.sku,
//         discountPercent: item.discountPercent || 0,
//         status: 'purchased' // purchased, returned, exchanged, partially_returned
//       });
//     });

//     let returns = [];
//     let exchanges = [];
//     let additionalPaymentTotal = 0;
//     let refundTotal = 0;

//     // Process all return/exchange records
//     transaction.returnExchangeIds.forEach(record => {
//       if (record.type === "return") {
//         returns.push(record);
//         refundTotal += record.payment?.refundAmount || 0;
//       } else if (record.type === "exchange") {
//         exchanges.push(record);
//       }

//       // Track which original items are affected by this return/exchange
//       record.items.forEach(item => {
//         if (record.type === "return") {
//           // Find and update the specific original item
//           // Need to match by productId and possibly other attributes
//           let remainingToReturn = item.quantity;
          
//           // First try to find items with remaining quantity
//           const eligibleItems = Array.from(originalItemsMap.entries())
//             .filter(([_, sold]) =>
//               sold.productId === item.productId &&
//               sold.remainingQty > 0
//             )
//             .sort((a, b) => {
//               // Prioritize items with lower unit price first (FIFO in terms of value)
//               return a[1].unitPrice - b[1].unitPrice;
//             });

//           for (const [itemKey, sold] of eligibleItems) {
//             if (remainingToReturn <= 0) break;
            
//             const returnQty = Math.min(remainingToReturn, sold.remainingQty);
//             sold.returnedQty += returnQty;
//             sold.remainingQty -= returnQty;
//             remainingToReturn -= returnQty;
            
//             // Update status
//             if (sold.remainingQty === 0) {
//               sold.status = 'returned';
//             } else {
//               sold.status = 'partially_returned';
//             }
//           }
//         }

//         if (record.type === "exchange") {
//           if (item.quantity < 0) {
//             // This is the returned item in exchange
//             const returnQty = Math.abs(item.quantity);
//             let remainingToExchange = returnQty;
            
//             const eligibleItems = Array.from(originalItemsMap.entries())
//               .filter(([_, sold]) =>
//                 sold.productId === item.productId &&
//                 sold.remainingQty > 0
//               )
//               .sort((a, b) => a[1].unitPrice - b[1].unitPrice);

//             for (const [itemKey, sold] of eligibleItems) {
//               if (remainingToExchange <= 0) break;
              
//               const exchangeQty = Math.min(remainingToExchange, sold.remainingQty);
//               sold.exchangedQty += exchangeQty;
//               sold.remainingQty -= exchangeQty;
//               remainingToExchange -= exchangeQty;
              
//               if (sold.remainingQty === 0) {
//                 sold.status = 'exchanged';
//               } else {
//                 sold.status = 'partially_exchanged';
//               }
//             }
//           } else {
//             // This is the new item from exchange
//             // Don't add to original items - these are exchange items
//             // We'll handle them separately in exchangeItems
//           }
//         }
//       });

//       if (record.mode === "exchange_with_payment" && record.payment?.additionalPayment) {
//         additionalPaymentTotal += record.payment.additionalPayment.amount || 0;
//       }
//     });

//     // Convert map to array and filter out fully returned/exchanged items if needed
//     let soldItems = Array.from(originalItemsMap.values());
    
//     // Optional: Filter out items with zero remaining quantity
//     // soldItems = soldItems.filter(item => item.remainingQty > 0);

//     // Calculate exchange summary - items received in exchange
//     const exchangeItems = [];
//     exchanges.forEach(ex => {
//       ex.items.forEach(item => {
//         if (item.quantity > 0) { // New items received in exchange
//           exchangeItems.push({
//             ...item,
//             exchangeTransactionId: ex._id,
//             exchangeDate: ex.createdAt
//           });
//         }
//       });
//     });

//     // Calculate financial summary
//     const originalSubtotal = transaction.totals.subtotal;
//     const returnedValue = returns.reduce((sum, ret) =>
//       sum + (ret.totals?.grandTotal || 0), 0);
    
//     const exchangeValue = exchanges.reduce((sum, ex) =>
//       sum + (ex.totals?.grandTotal || 0), 0);

//     const updatedTotals = {
//       subtotal: originalSubtotal,
//       originalGrandTotal: transaction.totals.grandTotal,
//       returnedValue,
//       exchangeValue,
//       additionalPaymentTotal,
//       refundTotal,
//       netAmount: originalSubtotal - returnedValue + additionalPaymentTotal,
//       grandTotal: originalSubtotal - returnedValue + additionalPaymentTotal
//     };

//     res.json({
//       success: true,
//       transactionNumber: transaction.transactionNumber,
//       status: transaction.status,
      
//       // Sales summary
//       summary: {
//         totalItemsPurchased: transaction.cartItems.reduce((sum, i) => sum + i.quantity, 0),
//         totalItemsReturned: soldItems.reduce((sum, i) => sum + i.returnedQty, 0),
//         totalItemsExchanged: soldItems.reduce((sum, i) => sum + i.exchangedQty, 0),
//         totalItemsRemaining: soldItems.reduce((sum, i) => sum + i.remainingQty, 0),
//         uniqueProductsCount: new Set(transaction.cartItems.map(i => i.productId)).size
//       },
      
//       // Original purchase items with return/exchange tracking
//       soldItems,
      
//       // Return transactions
//       returns: returns.map(ret => ({
//         _id: ret._id,
//         transactionNumber: ret.transactionNumber,
//         status: ret.status,
//         items: ret.items,
//         totals: ret.totals,
//         payment: ret.payment,
//         notes: ret.notes,
//         createdAt: ret.createdAt,
//         reason: ret.items[0]?.returnReason // First return reason
//       })),
      
//       // Exchange transactions
//       exchanges: exchanges.map(ex => ({
//         _id: ex._id,
//         transactionNumber: ex.transactionNumber,
//         status: ex.status,
//         items: ex.items,
//         totals: ex.totals,
//         payment: ex.payment,
//         notes: ex.notes,
//         createdAt: ex.createdAt
//       })),
      
//       // Items received from exchanges
//       exchangeItems,
      
//       // Payment information
//       originalPayment: transaction.payment,
      
//       // Financial summary
//       updatedTotals,
      
//       // Metadata
//       createdAt: transaction.createdAt,
//       lastModified: transaction.updatedAt
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


const getTransactionFullDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
      .populate("returnExchangeIds")
      .lean();

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // Build a map of original cart items with unique identifiers
    // Use combination of productId and item index to handle duplicate products
    const originalItemsMap = new Map();
    transaction.cartItems.forEach((item, index) => {
      const itemKey = `${item.productId}_${index}`; // Unique per cart entry
      
      originalItemsMap.set(itemKey, {
        id: itemKey,
        productId: item.productId,
        variantId: item.variantId || null, // Added variantId
        name: item.name,
        purchasedQty: item.quantity,
        returnedQty: 0,
        exchangedQty: 0,
        remainingQty: item.quantity,
        unitPrice: item.unitPrice,
        size: item.size,
        color: item.color || null, // Added color (with fallback to null)
        sku: item.sku,
        discountPercent: item.discountPercent || 0,
        status: 'purchased' // purchased, returned, exchanged, partially_returned
      });
    });

    let returns = [];
    let exchanges = [];
    let additionalPaymentTotal = 0;
    let refundTotal = 0;

    // Process all return/exchange records
    transaction.returnExchangeIds.forEach(record => {
      if (record.type === "return") {
        returns.push(record);
        refundTotal += record.payment?.refundAmount || 0;
      } else if (record.type === "exchange") {
        exchanges.push(record);
      }

      // Track which original items are affected by this return/exchange
      record.items.forEach(item => {
        if (record.type === "return") {
          // Find and update the specific original item
          // Need to match by productId and possibly other attributes
          let remainingToReturn = item.quantity;
          
          // First try to find items with remaining quantity
          const eligibleItems = Array.from(originalItemsMap.entries())
            .filter(([_, sold]) => 
              sold.productId === item.productId && 
              sold.remainingQty > 0
            )
            .sort((a, b) => {
              // Prioritize items with lower unit price first (FIFO in terms of value)
              return a[1].unitPrice - b[1].unitPrice;
            });

          for (const [itemKey, sold] of eligibleItems) {
            if (remainingToReturn <= 0) break;
            
            const returnQty = Math.min(remainingToReturn, sold.remainingQty);
            sold.returnedQty += returnQty;
            sold.remainingQty -= returnQty;
            remainingToReturn -= returnQty;
            
            // Update status
            if (sold.remainingQty === 0) {
              sold.status = 'returned';
            } else {
              sold.status = 'partially_returned';
            }
          }
        }

        if (record.type === "exchange") {
          if (item.quantity < 0) {
            // This is the returned item in exchange
            const returnQty = Math.abs(item.quantity);
            let remainingToExchange = returnQty;
            
            const eligibleItems = Array.from(originalItemsMap.entries())
              .filter(([_, sold]) => 
                sold.productId === item.productId && 
                sold.remainingQty > 0
              )
              .sort((a, b) => a[1].unitPrice - b[1].unitPrice);

            for (const [itemKey, sold] of eligibleItems) {
              if (remainingToExchange <= 0) break;
              
              const exchangeQty = Math.min(remainingToExchange, sold.remainingQty);
              sold.exchangedQty += exchangeQty;
              sold.remainingQty -= exchangeQty;
              remainingToExchange -= exchangeQty;
              
              if (sold.remainingQty === 0) {
                sold.status = 'exchanged';
              } else {
                sold.status = 'partially_exchanged';
              }
            }
          } else {
            // This is the new item from exchange
            // Don't add to original items - these are exchange items
            // We'll handle them separately in exchangeItems
          }
        }
      });

      if (record.mode === "exchange_with_payment" && record.payment?.additionalPayment) {
        additionalPaymentTotal += record.payment.additionalPayment.amount || 0;
      }
    });

    // Convert map to array and filter out fully returned/exchanged items if needed
    let soldItems = Array.from(originalItemsMap.values());
    
    // Optional: Filter out items with zero remaining quantity
    // soldItems = soldItems.filter(item => item.remainingQty > 0);

    // Calculate exchange summary - items received in exchange
    const exchangeItems = [];
    exchanges.forEach(ex => {
      ex.items.forEach(item => {
        if (item.quantity > 0) { // New items received in exchange
          exchangeItems.push({
            ...item,
            variantId: item.variantId || null, // Add variantId for exchange items
            color: item.color || null, // Add color for exchange items
            exchangeTransactionId: ex._id,
            exchangeDate: ex.createdAt
          });
        }
      });
    });

    // Calculate financial summary
    const originalSubtotal = transaction.totals.subtotal;
    const returnedValue = returns.reduce((sum, ret) => 
      sum + (ret.totals?.grandTotal || 0), 0);
    
    const exchangeValue = exchanges.reduce((sum, ex) => 
      sum + (ex.totals?.grandTotal || 0), 0);

    const updatedTotals = {
      subtotal: originalSubtotal,
      originalGrandTotal: transaction.totals.grandTotal,
      returnedValue,
      exchangeValue,
      additionalPaymentTotal,
      refundTotal,
      netAmount: originalSubtotal - returnedValue + additionalPaymentTotal,
      grandTotal: originalSubtotal - returnedValue + additionalPaymentTotal
    };

    res.json({
      success: true,
      transactionNumber: transaction.transactionNumber,
      status: transaction.status,
      
      // Sales summary
      summary: {
        totalItemsPurchased: transaction.cartItems.reduce((sum, i) => sum + i.quantity, 0),
        totalItemsReturned: soldItems.reduce((sum, i) => sum + i.returnedQty, 0),
        totalItemsExchanged: soldItems.reduce((sum, i) => sum + i.exchangedQty, 0),
        totalItemsRemaining: soldItems.reduce((sum, i) => sum + i.remainingQty, 0),
        uniqueProductsCount: new Set(transaction.cartItems.map(i => i.productId)).size
      },
      
      // Original purchase items with return/exchange tracking
      soldItems,
      
      // Return transactions
      returns: returns.map(ret => ({
        _id: ret._id,
        transactionNumber: ret.transactionNumber,
        status: ret.status,
        items: ret.items.map(item => ({
          ...item,
          variantId: item.variantId || null, // Add variantId for return items
          color: item.color || null // Add color for return items
        })),
        totals: ret.totals,
        payment: ret.payment,
        notes: ret.notes,
        createdAt: ret.createdAt,
        reason: ret.items[0]?.returnReason // First return reason
      })),
      
      // Exchange transactions
      exchanges: exchanges.map(ex => ({
        _id: ex._id,
        transactionNumber: ex.transactionNumber,
        status: ex.status,
        items: ex.items.map(item => ({
          ...item,
          variantId: item.variantId || null, // Add variantId for exchange items
          color: item.color || null // Add color for exchange items
        })),
        totals: ex.totals,
        payment: ex.payment,
        notes: ex.notes,
        createdAt: ex.createdAt
      })),
      
      // Items received from exchanges
      exchangeItems,
      
      // Payment information
      originalPayment: transaction.payment,
      
      // Financial summary
      updatedTotals,
      
      // Metadata
      createdAt: transaction.createdAt,
      lastModified: transaction.updatedAt
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllReturnExchanges,
  getByOriginalTransaction,
  createReturnExchange,
  voidReturnExchange,
  updateReturnExchange,
  getTransactionFullDetails,
};
