const express = require('express');
const router = express.Router();

const categoryBrandController = require('../../controllers/inv_controllers/categoryBrandController');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');
const checkPermission = require('../../middlewares/checkPermission');
const { PERMISSIONS_OBJECT } = require('../../config/permissions');

// Local constant for easier permission management
const BrandPermissions = PERMISSIONS_OBJECT.INVENTORY.BRANDS;

// All routes in this file require authentication
router.use(auth);

// Create a new brand
router.post(
  '/',
  checkPermission([BrandPermissions.CREATE]),
  upload.single("logo"),
  categoryBrandController.createBrand
);

// Get all brands
router.get(
  '/',
  checkPermission([BrandPermissions.READ]),
  categoryBrandController.getBrands
);

// Update a brand by ID
router.put(
  '/:id',
  checkPermission([BrandPermissions.UPDATE]),
  upload.single("logo"),
  categoryBrandController.updateBrand
);

// Soft delete a brand by ID
router.delete(
  '/:id',
  checkPermission([BrandPermissions.DELETE]),
  categoryBrandController.deleteBrand
);

module.exports = router;
