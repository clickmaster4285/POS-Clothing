const express = require('express');
const router = express.Router();

const stockController = require('../../controllers/inv_controllers/stockController');

const auth = require('../../middlewares/auth');


router.get('/branch/:branchId', auth, stockController.getStockByBranch);

router.get('/', auth, stockController.getAllStock);

router.get('/adjust', auth, stockController.getStockAdjustments);
router.get('/transfer', auth, stockController.getStockTransfers);

router.post('/:branchId/recieve', auth, stockController.receiveStock);

router.post('/:branchId/adjust', auth, stockController.adjustStock);

router.post('/transfer', auth, stockController.transferStock);

router.post('/:transferId/receive', auth, stockController.receiveTransfer);

router.get('/:branchId/alerts', auth, stockController.getLowStockAlerts);
router.get('/history', auth, stockController.getStockHistory);


module.exports = router;