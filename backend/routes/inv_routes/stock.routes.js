const express = require('express');
const router = express.Router();

const stockController = require('../../controllers/inv_controllers/stockController');

const auth = require('../../middlewares/auth');


router.get('/stock/branch/:branchId', auth, stockController.getStockByBranch);
router.post('/stock/branch/:branchId/adjust', auth, stockController.adjustStock);
router.post('/stock/transfer', auth, stockController.transferStock);
router.post('/stock/transfer/:transferId/receive', auth, stockController.receiveTransfer);
router.get('/stock/branch/:branchId/alerts', auth, stockController.getLowStockAlerts);
router.get('/stock/history', auth, stockController.getStockHistory);


module.exports = router;