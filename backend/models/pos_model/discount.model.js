// models/DiscountPromotion.js
const mongoose = require("mongoose");

const discountPromotionSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["BOGO", "Discount", "Mix & Match"],
      default: "Discount",
    },

       couponCode: {
      type: String,
      trim: true,
      unique: true, // ensures no two promotions share the same code
         sparse: true, // allows multiple null/undefined values
       default: null
    },

    // Targeted Items
    qualifyingCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" } // e.g., 
    ],
    qualifyingProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" } // specific items
    ],

    // Discount Info
    discountDescription: {
      type: String, // e.g., "Buy 1 Get 1 Free" or "20% off"
    },
    amountType: {
      type: String,
      enum: ["Fixed", "Percentage"],
    },

    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch',  },
      
    amountValue: {
      type: Number,
      min: 0,
    },
    quantityRules: {
      type: String, // e.g., "Min 2 identical items"
    },

    // Validity Period
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    hasExpiration: {
      type: Boolean,
      default: false,
    },
    expirationDate: {
      type: Date,
    },

    // Auto-apply and Priority
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    autoApply: {
      type: Boolean,
      default: true, // Most store promotions auto-apply
    },

    // Flags for stacking / combination
    allowFurtherDiscounts: {
      type: Boolean,
      default: true, // can combine with other offers
    },

    // Status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscountPromotion", discountPromotionSchema);
