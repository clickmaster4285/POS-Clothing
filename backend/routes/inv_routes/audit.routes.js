const express = require('express');
const router = express.Router();

const stockAuditController = require('../../controllers/inv_controllers/auditController');

const auth = require('../../middlewares/auth');

// Audit Routes
router.post('/stock-count/branch/:branchId/start', auth, stockAuditController.startStockCount);
router.put('/stock-count/:countId/update', auth, stockAuditController.updateStockCount);
router.put('/stock-count/:countId/complete', auth, stockAuditController.completeStockCount);
router.get('/cycle-counts/branch/:branchId', auth, stockAuditController.getCycleCounts);
router.post('/cycle-counts/branch/:branchId', auth, stockAuditController.createCycleCount);
router.post('/cycle-counts/:countId/run', auth, stockAuditController.runCycleCount);
router.get('/audit-reports/branch/:branchId', auth, stockAuditController.getAuditReports);
router.post('/audit-reports/branch/:branchId', auth, stockAuditController.createAuditReport);
router.put('/audit-reports/:reportId/actions/:actionId', auth, stockAuditController.updateCorrectiveAction);



module.exports = router;