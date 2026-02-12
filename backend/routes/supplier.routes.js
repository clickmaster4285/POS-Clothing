// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const auth = require('../middlewares/auth');

const checkPermission = require('../middlewares/checkPermission');
const { PERMISSIONS_OBJECT } = require('../config/permissions');

router.use(auth);

router.post(
  '/',
  checkPermission(PERMISSIONS_OBJECT.SUPPLIERS.CREATE),
  supplierController.createSupplier
);

// Get all suppliers
router.get(
  '/',
  checkPermission(PERMISSIONS_OBJECT.SUPPLIERS.READ),
  supplierController.getAllSuppliers
);

// Get a single supplier by ID
router.get(
  '/:id',
  checkPermission(PERMISSIONS_OBJECT.SUPPLIERS.READ),
  supplierController.getSupplierById
);

// Update a supplier by ID
router.put(
  '/:id',
  checkPermission(PERMISSIONS_OBJECT.SUPPLIERS.UPDATE),
  supplierController.updateSupplier
);

// Soft delete a supplier by ID
router.delete(
  '/:id',
  checkPermission(PERMISSIONS_OBJECT.SUPPLIERS.DELETE),
  supplierController.deleteSupplier
);

module.exports = router;
