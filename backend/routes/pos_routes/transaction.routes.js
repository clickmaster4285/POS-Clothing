const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");

// Import controllers
const {
  getAllTransactions,
  createTransaction,
  getTransactionsByStatus,
  holdTransaction,
  getHeldTransactions,
  voidTransaction,
  voidHeldTransaction,
  generateReceipt
} = require("../../controllers/pos_controllers/transactionController");

// Apply auth middleware to all routes
router.use(auth);

// Create a new transaction
router.post("/create", createTransaction);

// Get all transactions
router.get("/", getAllTransactions);

// Get transactions by status (active, held, void)
router.get("/status/:status", getTransactionsByStatus);

// Hold a transaction
router.post("/hold/:id", holdTransaction);

// Get all held transactions
router.get("/held", getHeldTransactions);

// Void a transaction
router.post("/void/:id", voidTransaction);

// Void a held transaction
router.post("/void-held/:id", voidHeldTransaction);

// Generate receipt for a transaction
router.get("/receipt/:id", generateReceipt);

module.exports = router;
