const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const checkPermission = require("../../middlewares/checkPermission");
const { PERMISSIONS_OBJECT } = require("../../config/permissions");

const {
  getAllTransactions,
  createTransaction,
  getHeldTransactions,
  voidTransaction,
  voidHeldTransaction,
  completeHeldTransaction,
  getTransactionsByCustomer
} = require("../../controllers/pos_controllers/transactionController");

// POS Transaction permissions
const POS_PERMISSIONS = PERMISSIONS_OBJECT.POINT_OF_SALE.TRANSACTION;

// Apply auth middleware globally
router.use(auth);

// Create a new transaction
router.post(
  "/create",
  checkPermission([POS_PERMISSIONS.CREATE]),
  createTransaction
);

// Get all transactions
router.get(
  "/",
  checkPermission([POS_PERMISSIONS.READ]),
  getAllTransactions
);

// Get all held transactions
router.get(
  "/held",
  checkPermission([POS_PERMISSIONS.READ]),
  getHeldTransactions
);

// Void a transaction
router.post(
  "/void/:id",
  checkPermission([POS_PERMISSIONS.UPDATE]), // voiding is considered an update
  voidTransaction
);

// Void a held transaction
router.post(
  "/void-held/:id",
  checkPermission([POS_PERMISSIONS.UPDATE]),
  voidHeldTransaction
);

// Complete a held transaction
router.patch(
  "/held/:id/complete",
  checkPermission([POS_PERMISSIONS.UPDATE]),
  completeHeldTransaction
);

// Get transactions by customer
router.get(
  "/:customerId",
  checkPermission([POS_PERMISSIONS.READ]),
  getTransactionsByCustomer
);

module.exports = router;