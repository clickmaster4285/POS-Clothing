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



router.post('/tags', auth, categoryBrandController.createTag);
router.get('/tags', auth, categoryBrandController.getTags);
router.post('/tags/:tagId/products/:productId', auth, categoryBrandController.applyTagToProduct);
router.delete('/tags/:tagId/products/:productId', auth, categoryBrandController.removeTagFromProduct);
router.get('/analytics/category-brand', auth, categoryBrandController.getCategoryBrandAnalytics);

module.exports = router;