
const express = require('express');
const router = express.Router();

const auth = require('./auth.routes');
const user = require('./user.routes');
const branch = require('./branch.routes');

//inv
const productRoutes = require('./inv_routes/product.routes');
const barcodeRoutes = require('./inv_routes/barcode.routes');
const purchaseRoutes = require('./inv_routes/purchase.routes');
const stockRoutes = require('./inv_routes/stock.routes');
const auditRoutes = require('./inv_routes/audit.routes');
const categoryRoutes = require('./inv_routes/categoty.routes');
const brandRoutes = require('./inv_routes/brands.routes');
const supplier = require('./supplier.routes')

router.use('/auth', auth);
router.use('/user', user);
router.use('/branches', branch);
//inv routes
router.use('/products', productRoutes);
router.use('/barcodes', barcodeRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/stocks', stockRoutes);
router.use('/audits', auditRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/suppliers', supplier);

module.exports = router;