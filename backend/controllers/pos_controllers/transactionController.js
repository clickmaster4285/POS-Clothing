const { Transaction } = require("../../models/pos_model/transaction.model");

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
      customer: {
        customerId: payload.customer.customerId,
        customerFirstName: payload.customer.firstName,
        customerLastName: payload.customer.lastName,
        customerEmail: payload.customer.email,
      },
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

module.exports = {
  getAllTransactions,
  createTransaction,
  getTransactionsByStatus,
  holdTransaction,
  getHeldTransactions,
  voidTransaction,
  voidHeldTransaction,
  generateReceipt,
};
