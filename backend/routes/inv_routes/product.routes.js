const express = require('express');
const router = express.Router();
const productController = require('../../controllers/inv_controllers/productController');
const auth = require('../../middlewares/auth');
const checkPermission = require('../../middlewares/checkPermission');
const { productUpload } = require('../../middlewares/upload');
const { PERMISSIONS_OBJECT } = require('../../config/permissions');
const upload = require('../../middlewares/upload');

// Local constant for easier permission management
const ProductPermissions = PERMISSIONS_OBJECT.INVENTORY.PRODUCT_DATABASE;

// Create a new product
router.post(
  '/',
  auth,
  checkPermission([ProductPermissions.CREATE]),
upload.array("images", 10),// replaces upload.array("images", 10)
  productController.createProduct
);

// Get all products
router.get(
  '/',
  auth,
  checkPermission([ProductPermissions.READ]),
  productController.getProducts
);

// Get a single product by ID
router.get(
  '/:id',
  auth,
  checkPermission([ProductPermissions.READ]),
  productController.getProductById
);

// Update a product by ID
router.put(
  '/:id',
  auth,
  checkPermission([ProductPermissions.UPDATE]),
 upload.array("images", 10),
  productController.updateProduct
);

// Delete a product by ID
router.delete(
  '/:id',
  auth,
  checkPermission([ProductPermissions.DELETE]),
  productController.deleteProduct
);

// Add a variant to a product
router.post(
  '/:id/variants',
  auth,
  checkPermission([ProductPermissions.CREATE]),
  productController.addProductVariant
);

// Update variant price
router.put(
  '/:productId/variants/:variantId/price',
  auth,
  checkPermission([ProductPermissions.UPDATE]),
  productController.updateVariantPrice
);

// Update variant quantity
router.patch(
  '/:productId/:variantId',
  auth,
  checkPermission([ProductPermissions.UPDATE]),
  productController.updateVariantQuantity
);

module.exports = router;
