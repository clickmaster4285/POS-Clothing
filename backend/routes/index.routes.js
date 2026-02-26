
const express = require('express');
const router = express.Router();

const auth = require('./auth.routes');
const user = require('./user.routes');
const branch = require('./branch.routes');

//inv
const productRoutes = require('./inv_routes/product.routes');

const purchaseRoutes = require('./inv_routes/purchase.routes');
const stockRoutes = require('./inv_routes/stock.routes');
const auditRoutes = require('./inv_routes/audit.routes');
const categoryRoutes = require('./inv_routes/categoty.routes');
const brandRoutes = require('./inv_routes/brands.routes');
const supplier = require('./supplier.routes')
const locationRoutes = require("./location.routes");
const customers = require("./pos_routes/customer.routes")
const trasaction = require('./pos_routes/transaction.routes')
const returnExchange = require('./pos_routes/returnExchange.routes')
const discount = require('./pos_routes/discountPromotion.routes')
const settings = require('./settings.routes')
const terminal = require('./terminal.routes')

router.use('/auth', auth);
router.use('/users', user);
router.use('/branches', branch);
//inv routes
router.use('/products', productRoutes);

router.use('/purchases', purchaseRoutes);
router.use('/stock', stockRoutes);
router.use('/audits', auditRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/suppliers', supplier);
router.use("/locations", locationRoutes);
router.use('/customers', customers);
router.use('/transactions', trasaction);
router.use('/returnExchange', returnExchange)
router.use('/discount', discount);
router.use('/settings', settings);
router.use('/terminals', terminal);

module.exports = router;