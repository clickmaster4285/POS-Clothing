const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");

// Import controllers
const {
  getAllTransactions,
  createTransaction,
  getHeldTransactions,
  voidTransaction,
  voidHeldTransaction,
  completeHeldTransaction,
  getTransactionsByCustomer
} = require("../../controllers/pos_controllers/transactionController");

// Apply auth middleware to all routes
router.use(auth);

// Create a new transaction
router.post("/create", createTransaction);

// Get all transactions
router.get("/", getAllTransactions);

// Get all held transactions
router.get("/held", getHeldTransactions);

// Void a transaction
router.post("/void/:id", voidTransaction);

// Void a held transaction
router.post("/void-held/:id", voidHeldTransaction);

router.patch("/held/:id/complete", completeHeldTransaction);

router.get("/:customerId", getTransactionsByCustomer);


module.exports = router;
