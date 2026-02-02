
const mongoose = require("mongoose");

// Barcode Schema
const barcodeSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: mongoose.Schema.Types.ObjectId,
  barcode: {
    type: String,
    unique: true,
    required: true
  },
  barcodeType: {
    type: String,
    enum: ['EAN13', 'UPC', 'Code128', 'QR', 'Custom'],
    default: 'EAN13'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  printedCount: {
    type: Number,
    default: 0
  },
  lastPrinted: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Barcode Label Template Schema
const labelTemplateSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: true
  },
  templateType: {
    type: String,
    enum: ['product', 'shelf', 'price'],
    default: 'product'
  },
  size: {
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['mm', 'inch']
    }
  },
  layout: {
    orientation: {
      type: String,
      enum: ['portrait', 'landscape']
    },
    columns: Number,
    rows: Number
  },
  fields: [{
    fieldName: String,
    fieldType: String,
    position: {
      x: Number,
      y: Number
    },
    fontSize: Number,
    isBold: Boolean,
    isRequired: Boolean
  }],
  includes: {
    price: Boolean,
    size: Boolean,
    color: Boolean,
    sku: Boolean,
    barcode: Boolean,
    brand: Boolean
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Barcode Print Job Schema
const printJobSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabelTemplate'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    variantId: mongoose.Schema.Types.ObjectId,
    barcode: String,
    quantity: Number,
    printedQuantity: {
      type: Number,
      default: 0
    }
  }],
  totalLabels: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  printedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  printerName: String,
  printDate: Date,
  notes: String
}, {
  timestamps: true
});

// Export Models
const Barcode = mongoose.model('Barcode', barcodeSchema);
const LabelTemplate = mongoose.model('LabelTemplate', labelTemplateSchema);
const PrintJob = mongoose.model('PrintJob', printJobSchema);
module.exports = {
  Barcode,
  LabelTemplate,
  PrintJob
};