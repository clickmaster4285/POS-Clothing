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

// Goods Receipt Note Schema
const goodsReceiptSchema = new mongoose.Schema({
  grnNumber: {
    type: String,
    unique: true,
    required: true
  },
  purchaseOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  receiptDate: {
    type: Date,
    default: Date.now
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    variantId: mongoose.Schema.Types.ObjectId,
    orderedQuantity: Number,
    receivedQuantity: Number,
    acceptedQuantity: Number,
    rejectedQuantity: Number,
    rejectionReason: String,
    qualityStatus: {
      type: String,
      enum: ['pending', 'passed', 'failed']
    },
    remarks: String
  }],
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed'],
    default: 'draft'
  },
  notes: String,
  storageLocation: String
}, {
  timestamps: true
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
const GoodsReceipt = mongoose.model('GoodsReceipt', goodsReceiptSchema);

module.exports = {
  PurchaseOrder,
  GoodsReceipt
};