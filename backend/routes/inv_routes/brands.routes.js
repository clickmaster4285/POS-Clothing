const express = require('express');
const router = express.Router();

const categoryBrandController = require('../../controllers/inv_controllers/categoryBrandController');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');



router.post('/', auth, upload.single("logo"), categoryBrandController.createBrand);
router.get('/', auth, categoryBrandController.getBrands);
router.put('/:id', auth,upload.single("image"), categoryBrandController.updateBrand);
router.delete('/:id', auth, categoryBrandController.deleteBrand);



module.exports = router;