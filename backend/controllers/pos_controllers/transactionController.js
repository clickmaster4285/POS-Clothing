const { Transaction } = require("../../models/pos_model/transaction.model");
const mongoose = require("mongoose");
const { Stock } = require('../../models/inv_model/stock.model')




// GET all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE / SAVE transaction
const createTransaction = async (req, res) => {
 
  try {
    const payload = req.body;
   

    const transactionData = {
      transactionNumber: payload.transactionNumber,
      status: payload.status || "active",
     customer: payload.customer || {},
      cartItems: payload.cartItems,
      totals: payload.totals,
      loyalty: payload.loyalty,
      payment: payload.payment,
      coupon: payload.coupon || { code: null, discountAmount: 0, applied: false },
      timestamp: payload.timestamp || Date.now(),
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    res.status(201).json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const createTransaction = async (req, res) => {
//   try {
//     const payload = req.body;
//     console.log("Payload received:", JSON.stringify(payload, null, 2));

//     const user = req.user; // auth middleware sets req.user
//     const branchId = user.branch_id;

//     if (!branchId) {
//       return res.status(400).json({
//         success: false,
//         message: "Branch ID is required for stock deduction",
//       });
//     }

//     // Loop through cart items
//     for (const item of payload.cartItems) {
//       // Normalize color to string
//       const colorStr = typeof item.color === "object" ? item.color.name : item.color;
//       item.color = colorStr;

//       // Build stock query dynamically
//       const stockQuery = {
//         product: item.productId,
//         branch: branchId,
//         color: colorStr,
//       };
//       if (item.variantId) stockQuery.variantId = item.variantId;

//       console.log("Searching stock for:", stockQuery);

//       // Find stock record
//       const stockRecord = await Stock.findOne(stockQuery);

//       if (!stockRecord) {
//         console.log(
//           `No stock found for product: ${item.name}, variantId: ${item.variantId}, color: ${colorStr}, branch: ${branchId}`
//         );
//         return res.status(400).json({
//           success: false,
//           message: `Stock not found for product ${item.name}, color ${colorStr}`,
//         });
//       } else {
//         console.log("Matched stock record:", stockRecord);
//       }

//       // Check available stock
//       if (stockRecord.availableStock < item.quantity) {
//         console.log(
//           `Insufficient stock for ${item.name}. Available: ${stockRecord.availableStock}, Requested: ${item.quantity}`
//         );
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for product ${item.name}, color ${colorStr}`,
//         });
//       }

//       // Deduct stock
//       stockRecord.currentStock -= item.quantity;
//       stockRecord.availableStock -= item.quantity;
//       stockRecord.lastSoldDate = new Date();
//       stockRecord.isLowStock = stockRecord.availableStock <= (stockRecord.reorderPoint || 5);
//       await stockRecord.save();

//       console.log(
//         `Stock updated for product ${item.name}, new availableStock: ${stockRecord.availableStock}`
//       );
//     }

//     // Build transaction object
//     const transactionData = {
//       transactionNumber: payload.transactionNumber,
//       status: payload.status || "active",
//       customer: payload.customer || {},
//       cartItems: payload.cartItems,
//       totals: payload.totals,
//       loyalty: payload.loyalty,
//       payment: payload.payment,
//       coupon: payload.coupon || { code: null, discountAmount: 0, applied: false },
//       timestamp: payload.timestamp || new Date(),
//       branch: branchId,
//       createdBy: user._id,
//     };

//     console.log(
//       "Transaction data ready to save:",
//       JSON.stringify(transactionData, null, 2)
//     );

//     // Save transaction
//     const transaction = new Transaction(transactionData);
//     await transaction.save();

//     console.log("Transaction saved successfully:", transaction._id);

//     res.status(201).json({ success: true, transaction });
//   } catch (err) {
//     console.error("Transaction error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// GET transactions by status (active, held, void)


const getTransactionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const transactions = await Transaction.find({ status }).sort({ createdAt: -1 });
    res.json({ success: true, status, transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// HOLD a transaction
const holdTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { status: "held" },
      { new: true }
    );

    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all held transactions
const getHeldTransactions = async (req, res) => {
  try {
    const heldTransactions = await Transaction.find({ status: "held" });
    res.json({ success: true, heldTransactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VOID a transaction
const voidTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { status: "void" },
      { new: true }
    );

    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VOID a held transaction
const voidHeldTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, status: "held" },
      { status: "void" },
      { new: true }
    );

    if (!transaction) return res.status(404).json({ success: false, message: "Held transaction not found" });

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GENERATE receipt for a transaction
const generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });

    const receiptText = `
===== RECEIPT =====
Transaction #: ${transaction.transactionNumber}
Status: ${transaction.status}
Date: ${transaction.timestamp.toLocaleString()}

Customer: ${transaction.customer.customerFirstName || ""} ${transaction.customer.customerLastName || ""}
Email: ${transaction.customer.customerEmail || ""}

---- Items ----
${transaction.cartItems.map(
  (item, i) =>
    `${i + 1}. ${item.name} [${item.size}, ${item.color?.name || ""}] x${item.quantity} - Unit: $${item.unitPrice} - Tax: ${item.taxPercent}%`
).join("\n")}

---- Totals ----
Subtotal: $${transaction.totals.subtotal.toFixed(2)}
Tax: $${transaction.totals.totalTax.toFixed(2)}
Loyalty Discount: $${transaction.loyalty.loyaltyDiscount.toFixed(2)}
Coupon Discount: $${transaction.coupon.discountAmount.toFixed(2)}
Grand Total: $${transaction.totals.grandTotal.toFixed(2)}

Payment: ${transaction.payment.paymentMethod}
Amount Tendered: $${transaction.payment.amountTendered.toFixed(2)}
Change Due: $${transaction.payment.changeDue.toFixed(2)}

Thank you for your purchase!
====================
`;

    res.json({
      success: true,
      receipt: {
        transactionId: transaction._id,
        transactionNumber: transaction.transactionNumber,
        customer: transaction.customer,
        items: transaction.cartItems,
        totals: transaction.totals,
        payment: transaction.payment,
        receiptText,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH a held transaction to completed
const completeHeldTransaction = async (req, res) => {
 
  try {
    const { id } = req.params;
    const { paymentMethod, amountTendered, changeDue } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, status: "held" },
      {
        status: "completed",
        payment: {
          paymentMethod,
          amountTendered,
          changeDue,
          timestamp: new Date(),
        },
      },
      { new: true }
    );

    if (!transaction)
      return res
        .status(404)
        .json({ success: false, message: "Held transaction not found" });

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  getAllTransactions,
  createTransaction,
  getTransactionsByStatus,
  holdTransaction,
  getHeldTransactions,
  voidTransaction,
  voidHeldTransaction,
  generateReceipt,
  completeHeldTransaction
};
