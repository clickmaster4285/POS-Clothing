const mongoose = require("mongoose");
// Purchase Order Schema
const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    unique: true,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  expectedDeliveryDate: Date,
  deliveryAddress: String,
  paymentTerms: String,
  currency: {
    type: String,
    default: 'USD'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    variantId: mongoose.Schema.Types.ObjectId,
    quantity: {
      type: Number,
      required: true
    },
    unitCost: Number,
    lineTotal: Number,
    receivedQuantity: {
      type: Number,
      default: 0
    },
    rejectedQuantity: {
      type: Number,
      default: 0
    }
  }],
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['draft', 'pending-approval', 'approved', 'sent', 'partially-received', 'received', 'cancelled'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sentDate: Date,
  notes: String,
  attachments: [String]
}, {
  timestamps: true
});



const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = { PurchaseOrder };