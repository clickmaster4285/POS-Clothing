const express = require('express');
const router = express.Router();

const categoryBrandController = require('../../controllers/inv_controllers/categoryBrandController');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

const checkPermission = require('../../middlewares/checkPermission');
const { PERMISSIONS_OBJECT } = require('../../config/permissions');

router.use(auth);

router.post('/',checkPermission(PERMISSIONS_OBJECT.CATEGORIES.CREATE), upload.single("logo"), categoryBrandController.createBrand);

router.get('/', checkPermission(PERMISSIONS_OBJECT.CATEGORIES.READ), categoryBrandController.getBrands);

router.put('/:id', checkPermission(PERMISSIONS_OBJECT.CATEGORIES.UPDATE), upload.single("logo"), categoryBrandController.updateBrand);


router.delete('/:id',  checkPermission(PERMISSIONS_OBJECT.CATEGORIES.DELETE), categoryBrandController.deleteBrand);



module.exports = router;