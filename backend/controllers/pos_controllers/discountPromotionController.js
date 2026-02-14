// controllers/discountPromotionController.js
const DiscountPromotion = require("../../models/pos_model/discount.model");
const {
  Category,
} = require('../../models/inv_model/category.model');
// Create a new promotion
exports.createPromotion = async (req, res) => {
  try {
    const promotionData = req.body;

    const promotion = new DiscountPromotion(promotionData);
    await promotion.save();

    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create promotion" });
  }
};

// Get all promotions
// Get all promotions with populated category names
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await DiscountPromotion.find({ status: "active" })
      .sort({ startDate: -1 })
      .populate({
        path: "qualifyingCategories", // field to populate
        select: "categoryName categoryCode -_id", // return only these fields
        model: Category
      });

    res.status(200).json({ success: true, data: promotions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch promotions" });
  }
};

// Get single promotion by ID
exports.getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await DiscountPromotion.findById(id);

    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    res.status(200).json({ success: true, data: promotion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch promotion" });
  }
};

// Update a promotion
exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const promotion = await DiscountPromotion.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    res.status(200).json({ success: true, data: promotion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update promotion" });
  }
};

// Delete a promotion
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    // Find promotion and update status
    const promotion = await DiscountPromotion.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    res.status(200).json({ success: true, message: "Promotion set to inactive", data: promotion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to deactivate promotion" });
  }
};