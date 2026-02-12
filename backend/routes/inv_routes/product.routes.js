const express = require('express');
const router = express.Router();

// Import controllers
const productController = require('../../controllers/inv_controllers/productController');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');


const checkPermission = require('../../middlewares/checkPermission');
const { PERMISSIONS_OBJECT } = require('../../config/permissions');


router.use(auth);

router.post('/', checkPermission('products:create'), upload.array("images", 10)
, productController.createProduct);

router.get('/',checkPermission('products:read'), productController.getProducts);

router.get('/:id',checkPermission('products:read'), productController.getProductById);

router.put('/:id', checkPermission('products:update'), upload.array("images", 10)
, productController.updateProduct);

router.delete('/:id', checkPermission('products:delete'), productController.deleteProduct);

router.post('/:id/variants',checkPermission('products:create'), productController.addProductVariant);

router.put('/:productId/variants/:variantId/price', checkPermission('products:update'), productController.updateVariantPrice);

router.patch('/:productId/:variantId', checkPermission('products:update'), productController.updateVariantQuantity);

module.exports = router;