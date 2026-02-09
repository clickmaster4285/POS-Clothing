const express = require('express');
const router = express.Router();

// Import controllers
const productController = require('../../controllers/inv_controllers/productController');


const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');


router.post('/', auth, upload.array("images", 10)
, productController.createProduct);

router.get('/', auth, productController.getProducts);

router.get('/:id', auth, productController.getProductById);

router.put('/:id', auth, upload.array("images", 10)
, productController.updateProduct);

router.delete('/:id', auth, productController.deleteProduct);

router.post('/:id/variants', auth, productController.addProductVariant);

router.put('/:productId/variants/:variantId/price', auth, productController.updateVariantPrice);

router.patch('/:productId/:variantId', auth, productController.updateVariantQuantity);

module.exports = router;