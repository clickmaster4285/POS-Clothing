const express = require('express');
const router = express.Router();


const purchaseOrderController = require('../../controllers/inv_controllers/purchaseOrderController');

const auth = require('../../middlewares/auth');

router.post('/purchase-orders/branch/:branchId', auth, purchaseOrderController.createPurchaseOrder);
router.get('/purchase-orders/branch/:branchId', auth, purchaseOrderController.getPurchaseOrders);
router.put('/purchase-orders/:poId/approve', auth, purchaseOrderController.approvePurchaseOrder);
router.post('/purchase-orders/:poId/receive', auth, purchaseOrderController.receiveGoods);
router.put('/purchase-orders/:poId/cancel', auth, purchaseOrderController.cancelPurchaseOrder);
router.get('/purchase-orders/branch/:branchId/analytics', auth, purchaseOrderController.getPurchaseOrderAnalytics);

module.exports = router;