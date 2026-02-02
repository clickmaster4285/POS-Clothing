const mongoose = require("mongoose");
// Stock Schema
const stockSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  location: {
    type: String,
    enum: ['warehouse', 'store', 'showroom'],
    required: true
  },
  storageDetails: {
    rack: String,
    shelf: String,
    bin: String
  },
  currentStock: {
    type: Number,
    default: 0,
    min: 0
  },
  reservedStock: {
    type: Number,
    default: 0,
    min: 0
  },
  availableStock: {
    type: Number,
    default: 0,
    min: 0
  },
  inTransitStock: {
    type: Number,
    default: 0,
    min: 0
  },
  damagedStock: {
    type: Number,
    default: 0,
    min: 0
  },
  reorderPoint: Number,
  reorderQuantity: Number,
  lastRestockDate: Date,
  lastSoldDate: Date,
  stockValue: Number, // calculated field
  isLowStock: {
    type: Boolean,
    default: false
  },
  stockAlerts: [{
    type: {
      type: String,
      enum: ['low', 'out', 'expiring']
    },
    triggeredAt: Date,
    resolved: Boolean,
    resolvedAt: Date
  }]
});

// Stock Adjustment Schema
const stockAdjustmentSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  adjustmentType: {
    type: String,
    enum: ['add', 'remove', 'transfer', 'damage', 'return'],
    required: true
  },
  reason: {
    type: String,
    required: true
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
    fromLocation: String,
    toLocation: String,
    remarks: String
  }],
  adjustedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: Date,
  referenceNumber: String,
  remarks: String
}, {
  timestamps: true
});

// Stock Transfer Schema
const stockTransferSchema = new mongoose.Schema({
  transferNumber: {
    type: String,
    unique: true,
    required: true
  },
  fromBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  fromLocation: String,
  toBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  toLocation: String,
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
    transferredQuantity: {
      type: Number,
      default: 0
    },
    receivedQuantity: {
      type: Number,
      default: 0
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'in-transit', 'partially-received', 'completed', 'cancelled'],
    default: 'draft'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  notes: String,
  documents: [String]
}, {
  timestamps: true
});


const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
const StockAdjustment = mongoose.model('StockAdjustment', stockAdjustmentSchema);
module.exports.StockAdjustment = StockAdjustment;
const StockTransfer = mongoose.model('StockTransfer', stockTransferSchema);
module.exports.StockTransfer = StockTransfer;