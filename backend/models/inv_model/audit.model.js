const mongoose = require("mongoose");


const stockCountSchema = new mongoose.Schema({
  countNumber: {
    type: String,
    unique: true,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  location: String,
  countType: {
    type: String,
    enum: ['physical', 'cycle', 'annual'],
    required: true
  },
  countDate: {
    type: Date,
    default: Date.now
  },
  countedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    variantId: mongoose.Schema.Types.ObjectId,
    expectedQuantity: Number,
    countedQuantity: Number,
    variance: Number,
    variancePercent: Number,
    remarks: String
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'approved'],
    default: 'scheduled'
  },
  totalExpected: Number,
  totalCounted: Number,
  totalVariance: Number,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: Date,
  notes: String
}, {
  timestamps: true
});

// Cycle Count Schedule Schema
const cycleCountSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly'],
    required: true
  },
  dayOfWeek: Number, // 0-6 for weekly
  dayOfMonth: Number, // 1-31 for monthly
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  brands: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  }],
  location: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastCountDate: Date,
  nextCountDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Audit Report Schema
const auditReportSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  reportType: {
    type: String,
    enum: ['discrepancy', 'shrinkage', 'theft', 'damage', 'expiry'],
    required: true
  },
  period: {
    startDate: Date,
    endDate: Date
  },
  findings: [{
    description: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    variantId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    value: Number,
    reason: String
  }],
  totalShrinkage: Number,
  shrinkagePercent: Number,
  correctiveActions: [{
    action: String,
    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed']
    }
  }],
  preparedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, {
  timestamps: true
});

const StockCount = mongoose.model('StockCount', stockCountSchema);
const CycleCount = mongoose.model('CycleCount', cycleCountSchema);
const AuditReport = mongoose.model('AuditReport', auditReportSchema);
module.exports = {
  StockCount,
  CycleCount,
  AuditReport
};