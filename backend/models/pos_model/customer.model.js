// models/Customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    phonePrimary: { type: String, required: true },
    phoneAlternate: { type: String },
    email: { type: String, required: true, unique: true },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    loyaltyProgram: { type: String, default: "No Loyalty Program" },
   loyaltyPoints: { type: Number, default: 0 },
redeemedPoints: { type: Number, default: 0 },
    communicationEmail: { type: Boolean, default: true },
    communicationSms: { type: Boolean, default: false },
    communicationPush: { type: Boolean, default: false },
    preferences: { type: String },
    isActive: { type: Boolean, default: true },
    customerId: { type: String, unique: true },
    loyaltyCardNumber: { type: String, unique: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch'},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
