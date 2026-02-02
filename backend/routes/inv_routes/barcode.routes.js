const express = require('express');
const router = express.Router();

const barcodeController = require('../../controllers/inv_controllers/barcodeController');

const auth = require('../../middlewares/auth');



// Barcode Routes
router.post('/barcodes/generate', auth, barcodeController.generateBarcode);
router.get('/barcodes', auth, barcodeController.getBarcodes);
router.get('/barcodes/scan/:barcode', auth, barcodeController.scanBarcode);
router.post('/label-templates', auth, barcodeController.createLabelTemplate);
router.get('/label-templates', auth, barcodeController.getLabelTemplates);
router.post('/print-jobs/branch/:branchId', auth, barcodeController.createPrintJob);
router.post('/print-jobs/:jobId/process', auth, barcodeController.processPrintJob);
router.get('/print-jobs/branch/:branchId', auth, barcodeController.getPrintJobs);



module.exports = router;