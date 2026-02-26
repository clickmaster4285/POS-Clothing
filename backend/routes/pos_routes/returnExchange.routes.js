const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const checkPermission = require("../../middlewares/checkPermission");
const { PERMISSIONS_OBJECT } = require("../../config/permissions");

const returnExchangeController = require("../../controllers/pos_controllers/returnExchange.controller");

// POS Return/Exchange permissions
const POS_PERMISSIONS = PERMISSIONS_OBJECT.POINT_OF_SALE.RETURNS_EXCHANGES; // map to the correct menu

// Apply auth middleware globally
router.use(auth);

// Get all return/exchange transactions
router.get(
  "/",
  checkPermission([POS_PERMISSIONS.READ]),
  returnExchangeController.getAllReturnExchanges
);

// Get all return/exchange for a specific original transaction
router.get(
  "/original/:originalTransactionId",
  checkPermission([POS_PERMISSIONS.READ]),
  returnExchangeController.getByOriginalTransaction
);

// Create a new return/exchange
router.post(
  "/create",
  checkPermission([POS_PERMISSIONS.CREATE]),
  returnExchangeController.createReturnExchange
);

// Void a return/exchange
router.patch(
  "/void/:id",
  checkPermission([POS_PERMISSIONS.UPDATE]), // voiding is considered an update
  returnExchangeController.voidReturnExchange
);

// Update a return/exchange (payment adjustment, notes, etc.)
router.patch(
  "/update/:id",
  checkPermission([POS_PERMISSIONS.UPDATE]),
  returnExchangeController.updateReturnExchange
);

// Get full details of a return/exchange transaction
router.get(
  "/detail/:id",
  checkPermission([POS_PERMISSIONS.READ]),
  returnExchangeController.getTransactionFullDetails
);

module.exports = router;