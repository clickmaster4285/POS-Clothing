// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const auth = require('../middlewares/auth');

// Supplier Profile Routes
router.post('/',auth, supplierController.createSupplier);
router.get('/',auth, supplierController.getAllSuppliers);
router.get('/:id',auth, supplierController.getSupplierById);
router.put('/:id',auth, supplierController.updateSupplier);
router.delete('/:id', auth,supplierController.deleteSupplier);

// Banking Details Routes
router.post('/suppliers/:id/banking',auth, supplierController.addBankingDetails);
router.get('/suppliers/:id/banking',auth, supplierController.getBankingDetails);

// Product Catalog Routes
router.post('/suppliers/:id/products',auth, supplierController.addProductToCatalog);
router.get('/suppliers/:id/products',auth, supplierController.getSupplierCatalog);

// Order History Routes
router.post('/suppliers/:id/orders',auth, supplierController.createOrder);
router.get('/suppliers/:id/orders',auth, supplierController.getSupplierOrders);

// Payment Routes
router.post('/suppliers/:id/payments',auth, supplierController.processPayment);
router.get('/suppliers/:id/payments',auth, supplierController.getPaymentHistory);

// Performance Metrics Routes
router.put('/suppliers/:id/metrics', auth, supplierController.updatePerformanceMetrics);
router.get('/suppliers/:id/metrics',auth, supplierController.getPerformanceMetrics);

// Payment Schedule Routes
router.get('/suppliers/:id/schedule',auth, supplierController.getPaymentSchedule);
router.post('/suppliers/reminders',auth, supplierController.sendPaymentReminders);

// Dashboard & Reports Routes
router.get('/suppliers/:id/dashboard',auth, supplierController.getSupplierDashboard);
router.get('/suppliers/:id/reports',auth, supplierController.getSupplierReports);

module.exports = router;