const ReturnExchange = require("../../models/pos_model/returnExchange.model");

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
const createReturnExchange = async (req, res) => {
  try {
    const payload = req.body;
console.log("payload" ,payload)
    // Generate transaction number
    const txnNumber = `RE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newTransaction = new ReturnExchange({
      transactionNumber: txnNumber,
      type: payload.type,
      mode: payload.mode || "normal",
      originalTransactionId: payload.originalTransactionId || null,
      exchangeGroupId: payload.exchangeGroupId || null,
      customer: payload.customer,
      items: payload.items,
      totals: payload.totals,
      payment: payload.payment,
      notes: payload.notes || ""
    });

    await newTransaction.save();

    res.status(201).json({ success: true, transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// VOID a return/exchange
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

module.exports = {
  getAllReturnExchanges,
  getByOriginalTransaction,
  createReturnExchange,
  voidReturnExchange,
  updateReturnExchange
};
