const express = require('express');
const router = express.Router();

const categoryBrandController = require('../../controllers/inv_controllers/categoryBrandController');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

// Category & Brand Routes
router.post('/', auth, upload.single("image"),  categoryBrandController.createCategory);
router.get('/', auth, categoryBrandController.getCategories);
router.put('/:id', auth,upload.single("image"), categoryBrandController.updateCategory);
router.delete('/:id', auth, categoryBrandController.deleteCategory);




module.exports = router;