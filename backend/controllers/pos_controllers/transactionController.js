const { Transaction } = require("../../models/pos_model/transaction.model");
const mongoose = require("mongoose");
const { Stock } = require('../../models/inv_model/stock.model')

const Branch = require("../../models/branch.model")


// GET all transactions
const getAllTransactions = async (req, res) => {
  try {
    // Fetch all transactions, sorted by newest first
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};



// controllers/transactionController.js

exports.getTransactionsByBranch = async (req, res) => {
  try {
    const user = req.user; // logged-in user
    if (!user?.branch_id) {
      return res.status(400).json({
        success: false,
        message: "User does not have a branch assigned",
      });
    }

    const branchId = user.branch_id;
    const { status, search, startDate, endDate, page = 1, limit = 50 } = req.query;

    // Build query
    let query = { branch: branchId };

    if (status) query.status = status; // e.g., 'completed', 'pending'
    if (startDate || endDate) query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);

    // Search by transaction number
    if (search) {
      query.transactionNumber = { $regex: search, $options: "i" };
    }

    // Count total for pagination
    const total = await Transaction.countDocuments(query);

    // Fetch transactions with pagination & sorting
    const transactions = await Transaction.find(query)
      .populate({
        path: "createdBy",
        select: "name email",
      })
      .populate({
        path: "cartItems.product",
        select: "productName sku",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Optional: Calculate summary stats for this branch
    const completedTransactions = transactions.filter(tx => tx.status === "completed");
    const totalSales = completedTransactions.reduce(
      (sum, tx) => sum + tx.cartItems.reduce((sub, item) => sub + (item.totalPrice || 0), 0),
      0
    );
    const totalItemsSold = completedTransactions.reduce(
      (sum, tx) => sum + tx.cartItems.reduce((sub, item) => sub + (item.quantity || 0), 0),
      0
    );

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
      summary: {
        totalTransactions: total,
        totalSales,
        totalItemsSold,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};



const createTransaction = async (req, res) => {
  try {
    const payload = req.body;


    // Get user and branch
    const user = req.user; // auth middleware sets req.user
   let branchId;

// Admin can select any branch
if (user.role === "admin") {
    branchId = payload.branch;
} else {
    // Manager or normal user uses their own branch
    branchId = user.branch_id;
}

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "Branch ID is required for stock deduction",
      });
    }

    // Loop through cart items and check/deduct stock
    for (const item of payload.cartItems) {
      // Normalize color
      const colorStr = typeof item.color === "object" ? item.color.name : item.color;
      item.color = colorStr;

      // Build stock query
      const stockQuery = {
        product: item.productId,
        branch: branchId,
        color: colorStr,
      };
      if (item.variantId) stockQuery.variantId = item.variantId;

     

      const stockRecord = await Stock.findOne(stockQuery);

      if (!stockRecord) {
      
        return res.status(400).json({
          success: false,
          message: `Stock not found for product ${item.name}, color ${colorStr}`,
        });
      }

      // Check if enough stock is available
      if (stockRecord.availableStock < item.quantity) {
      
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.name}, color ${colorStr}`,
        });
      }

      // Deduct stock
      stockRecord.currentStock -= item.quantity;
      stockRecord.availableStock -= item.quantity;
      stockRecord.lastSoldDate = new Date();
      stockRecord.isLowStock = stockRecord.availableStock <= (stockRecord.reorderPoint || 5);


      stockRecord.history.push({
      action: "sale",
      quantity: -item.quantity,
      user: user._id,
      timestamp: new Date(),
     
    });

      await stockRecord.save();

   
    }

    // Build transaction object
    const transactionData = {
      transactionNumber: payload.transactionNumber,
      status: payload.status || "active",
      customer: payload.customer || {},
      cartItems: payload.cartItems,
      totals: payload.totals,
      loyalty: payload.loyalty,
      payment: payload.payment,
      coupon: payload.coupon || { code: null, discountAmount: 0, applied: false },
      timestamp: payload.timestamp || new Date(),
      branch: branchId,       // must match schema
      createdBy: user._id,    // must match schema
    };

 

    // Save transaction
    const transaction = new Transaction(transactionData);
    await transaction.save();

  

    res.status(201).json({ success: true, transaction });
  } catch (err) {
    console.error("Transaction error:", err);

    // Handle validation errors separately
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    res.status(500).json({ success: false, message: err.message });
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


const getTransactionsByCustomer = async (req, res) => {
  try {
    const { customerId } = req?.params; // This is Mongo _id (string)

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    // Optional: Validate Mongo ObjectId format
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Customer ID format",
      });
    }

    const transactions = await Transaction.find({
      "customer.customerId": customerId, // 👈 important
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });

  } catch (error) {
    console.error("Error fetching transactions by customer:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



module.exports = {
  getAllTransactions,
  createTransaction,
  getHeldTransactions,
  voidTransaction,
  voidHeldTransaction,
  completeHeldTransaction,
  getTransactionsByCustomer
};
