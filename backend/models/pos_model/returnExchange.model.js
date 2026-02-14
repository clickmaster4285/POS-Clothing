const mongoose = require("mongoose");

const returnExchangeSchema = new mongoose.Schema(
{
  transactionNumber: { type: String, required: true, unique: true },

 
  type: { type: String, required: true },

  
  mode: { type: String,  default: "normal" },

  
  originalTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", default: null },

 
  exchangeGroupId: { type: String, default: null },

  status: { type: String, default: "completed" },


  customer: {
    customerId: String,
    customerFirstName: String,
    customerLastName: String,
    customerEmail: String
  },

 
  items: [
    {
      productId: String,
      productId: String,
      name: String,
      quantity: Number,
      size: String,
      color: String,
      unitPrice: Number,         
      originalUnitPrice: Number, 
      discountPercent: Number,
      returnReason: String        
    }
  ],

 
  totals: {
    subtotal: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true } 
  },

  // Payment information
payment: {
  method: { type: String, required: true },
  amountTendered: { type: Number, default: 0 },
  changeDue: { type: Number, default: 0 },
  appliedCredit: { type: Number, default: 0 },
  additionalPayment: {
    method: { type: String },
    amount: { type: Number, default: 0 },
    amountTendered: { type: Number, default: 0 },
    change: { type: Number, default: 0 },
    timestamp: { type: Date }
  },
  refundAmount: { type: Number, default: 0 },
  originalPaymentMethod: { type: String }
},


  // Optional notes about return/exchange
  notes: { type: String }
},
{ timestamps: true }
);

module.exports = mongoose.model("ReturnExchange", returnExchangeSchema);
