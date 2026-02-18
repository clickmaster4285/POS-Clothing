const express = require('express');
const router = express.Router();

const categoryBrandController = require('../../controllers/inv_controllers/categoryBrandController');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');
const checkPermission = require('../../middlewares/checkPermission');
const { PERMISSIONS_OBJECT } = require('../../config/permissions');

// Local constant for easier permission management
const CategoryPermissions = PERMISSIONS_OBJECT.INVENTORY.CATEGORIES_DEPARTMENTS;

// All routes in this file require authentication
router.use(auth);

// Create a new category
router.post(
  '/',
  checkPermission([CategoryPermissions.CREATE]),
  upload.single("image"),
  categoryBrandController.createCategory
);

// Get all categories
router.get(
  '/',
  checkPermission([CategoryPermissions.READ]),
  categoryBrandController.getCategories
);

// Update a category by ID
router.put(
  '/:id',
  checkPermission([CategoryPermissions.UPDATE]),
  upload.single("image"),
  categoryBrandController.updateCategory
);

// Soft delete a category by ID
router.delete(
  '/:id',
  checkPermission([CategoryPermissions.DELETE]),
  categoryBrandController.deleteCategory
);

module.exports = router;
