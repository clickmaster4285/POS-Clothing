const express = require('express');
const router = express.Router();

const stockController = require('../../controllers/inv_controllers/stockController');
const auth = require('../../middlewares/auth');
const checkPermission = require('../../middlewares/checkPermission');
const { PERMISSIONS_OBJECT } = require('../../config/permissions');

// Inventory permissions
const INVENTORY_PERMISSIONS = PERMISSIONS_OBJECT.INVENTORY; 


router.get(
  '/branch/:branchId',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.READ]),
  stockController.getStockByBranch
);

router.get(
  '/',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.READ]),
  stockController.getAllStock
);

router.get(
  '/adjust',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.READ]),
  stockController.getStockAdjustments
);

router.get(
  '/transfer',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.READ]),
  stockController.getStockTransfers
);

router.post(
  '/:branchId/recieve',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.UPDATE]),
  stockController.receiveStock
);

router.post(
  '/:branchId/adjust',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.UPDATE]),
  stockController.adjustStock
);

router.post(
  '/transfer',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.CREATE]),
  stockController.transferStock
);

router.post(
  '/:transferId/receive',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.UPDATE]),
  stockController.receiveTransfer
);

router.get(
  '/:branchId/alerts',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.READ]),
  stockController.getLowStockAlerts
);

router.get(
  '/history',
  auth,
  checkPermission([INVENTORY_PERMISSIONS.STOCK_MANAGEMENT.READ]),
  stockController.getStockHistory
);

module.exports = router;