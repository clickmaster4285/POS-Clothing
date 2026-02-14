const ReturnExchange = require("../../models/pos_model/returnExchange.model");
const { Transaction } = require("../../models/pos_model/transaction.model");


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

// CREATE a return or exchange
// const createReturnExchange = async (req, res) => {
//   try {
//     const payload = req.body;
// console.log("payload" ,payload)
//     // Generate transaction number
//     const txnNumber = `RE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//     const newTransaction = new ReturnExchange({
//       transactionNumber: txnNumber,
//       type: payload.type,
//       mode: payload.mode || "normal",
//       originalTransactionId: payload.originalTransactionId || null,
//       exchangeGroupId: payload.exchangeGroupId || null,
//       customer: payload.customer,
//       items: payload.items,
//       totals: payload.totals,
//       payment: payload.payment,
//       notes: payload.notes || ""
//     });

//     await newTransaction.save();

//     res.status(201).json({ success: true, transaction: newTransaction });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// const createReturnExchange = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const payload = req.body;

//     const originalTransaction = await Transaction.findById(
//       payload.originalTransactionId
//     ).session(session);

//     if (!originalTransaction) {
//       throw new Error("Original transaction not found");
//     }

//     // 🔥 VALIDATION + UPDATE RETURNED QUANTITY
//     payload.items.forEach(returnedItem => {
//       const originalItem = originalTransaction.cartItems.find(
//         item => item.productId === returnedItem.productId
//       );

//       if (!originalItem) {
//         throw new Error("Product not found in original transaction");
//       }

//       const availableQty =
//         originalItem.quantity - originalItem.returnedQuantity;

//       if (returnedItem.quantity > availableQty) {
//         throw new Error(
//           `Cannot return more than available (${availableQty})`
//         );
//       }

//       originalItem.returnedQuantity += returnedItem.quantity;
//     });

//     // 🔥 UPDATE SUMMARY
//     originalTransaction.returnSummary.totalReturnedAmount += payload.totals.subtotal;
//     originalTransaction.returnSummary.totalRefunded += payload.payment.refundAmount || 0;
//     originalTransaction.returnSummary.totalCreditIssued += payload.payment.appliedCredit || 0;

//     // 🔥 CHECK IF FULLY RETURNED
//     const allReturned = originalTransaction.cartItems.every(
//       item => item.quantity === item.returnedQuantity
//     );

//     originalTransaction.returnSummary.status = allReturned
//       ? "fully_returned"
//       : "partial";

//     await originalTransaction.save({ session });

//     // 🔥 CREATE RETURN RECORD
//     const reNumber = `RE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//     const newReturn = new ReturnExchange({
//       transactionNumber: reNumber,
//       ...payload
//     });

//     await newReturn.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({ success: true, transaction: newReturn });

//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// VOID a return/exchange

const createReturnExchange = async (req, res) => {

  try {
    const payload = req.body;

    // 1️⃣ Save return/exchange
    const txnNumber = `RE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newReturn = new ReturnExchange({
      transactionNumber: txnNumber,
      ...payload
    });

    await newReturn.save();

    // 2️⃣ Update original transaction to link this return/exchange
    await Transaction.findByIdAndUpdate(payload.originalTransactionId, {
      $push: { returnExchangeIds: newReturn._id }
    });

    res.status(201).json({ success: true, transaction: newReturn });

  } catch (err) {
    console.error("ReturnExchange creation error:", err);
    res.status(500).json({ success: false, error: err.message });
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
        name: item.name,
        purchasedQty: item.quantity,
        returnedQty: 0,
        exchangedQty: 0,
        remainingQty: item.quantity,
        unitPrice: item.unitPrice,
        size: item.size,
        color: item.color,
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
        items: ret.items,
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
        items: ex.items,
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
