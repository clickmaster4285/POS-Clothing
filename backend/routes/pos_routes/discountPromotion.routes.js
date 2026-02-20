const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const checkPermission = require("../../middlewares/checkPermission");
const { PERMISSIONS_OBJECT } = require("../../config/permissions");

const controller = require("../../controllers/pos_controllers/discountPromotionController");

// Discounts & Promotions permissions
const PROMOTION_PERMISSIONS = PERMISSIONS_OBJECT.POINT_OF_SALE.DISCOUNTS_PROMOTIONS;

router.use(auth);

// Create a new promotion
router.post(
  "/",
  checkPermission([PROMOTION_PERMISSIONS.CREATE]),
  controller.createPromotion
);

// Get all promotions
router.get(
  "/",
  checkPermission([PROMOTION_PERMISSIONS.READ]),
  controller.getAllPromotions
);

// Get a single promotion by ID
router.get(
  "/:id",
  checkPermission([PROMOTION_PERMISSIONS.READ]),
  controller.getPromotionById
);

// Update a promotion
router.put(
  "/:id",
  checkPermission([PROMOTION_PERMISSIONS.UPDATE]),
  controller.updatePromotion
);

// Delete a promotion
router.delete(
  "/:id",
  checkPermission([PROMOTION_PERMISSIONS.DELETE]),
  controller.deletePromotion
);

module.exports = router;