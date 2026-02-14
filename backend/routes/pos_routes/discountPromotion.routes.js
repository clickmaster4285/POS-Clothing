// routes/discountPromotionRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/pos_controllers/discountPromotionController");
const auth = require("../../middlewares/auth")
router.use(auth);

// CRUD Routes
router.post("/", controller.createPromotion);
router.get("/", controller.getAllPromotions);
router.get("/:id", controller.getPromotionById);
router.put("/:id", controller.updatePromotion);
router.delete("/:id", controller.deletePromotion);

module.exports = router;
