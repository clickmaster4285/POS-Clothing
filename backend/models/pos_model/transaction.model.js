const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionNumber: { type: String, required: true, unique: true },
    status: { type: String, default: "active" },

    // Customer reference + minimal info
    customer: {
      customerId: { type: String },
      customerFirstName: { type: String },
      customerLastName: { type: String },
      customerEmail: { type: String },
    },

    // Cart Items
    cartItems: [
      {
        id: { type: String, required: true }, // unique cart item id
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        color: { name: { type: String } },
        unitPrice: { type: Number, required: true },
        discountPercent: { type: Number, default: 0 },
        taxPercent: { type: Number, default: 0 },
        image: { type: String, default: "" },
      },
    ],

    // Totals
    totals: {
      subtotal: { type: Number, required: true },
      totalTax: { type: Number, required: true },
      totalDiscount: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
      taxBreakdown: [
        {
          rate: { type: Number, required: true },
          amount: { type: Number, required: true },
        },
      ],
    },

    // Loyalty Info
    loyalty: {
      loyaltyDiscount: { type: Number, default: 0 },
      pointsEarned: { type: Number, default: 0 },
      pointsRedeemed: { type: Number, default: 0 },
      redeemPoints: { type: Boolean, default: false },
    },

    // Coupon placeholder for future module
    coupon: {
      code: { type: String, default: null },
      discountAmount: { type: Number, default: 0 },
      applied: { type: Boolean, default: false },
    },

    // Payment Info
    payment: {
      amountTendered: { type: Number, required: true },
      changeDue: { type: Number, required: true },
      paymentMethod: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },

    // Transaction timestamp
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { Transaction };
