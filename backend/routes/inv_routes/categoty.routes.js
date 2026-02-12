const express = require('express');
const router = express.Router();

const categoryBrandController = require('../../controllers/inv_controllers/categoryBrandController');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');
const checkPermission = require('../../middlewares/checkPermission');
const { PERMISSIONS_OBJECT } = require('../../config/permissions');

router.use(auth);

// Category & Brand Routes
router.post('/', checkPermission(PERMISSIONS_OBJECT.CATEGORIES.CREATE), upload.single("image"), categoryBrandController.createCategory);

router.get('/', checkPermission(PERMISSIONS_OBJECT.CATEGORIES.READ), categoryBrandController.getCategories);

router.put('/:id', checkPermission(PERMISSIONS_OBJECT.CATEGORIES.UPDATE), upload.single("image"), categoryBrandController.updateCategory);

router.delete('/:id', checkPermission(PERMISSIONS_OBJECT.CATEGORIES.DELETE), categoryBrandController.deleteCategory);




module.exports = router;