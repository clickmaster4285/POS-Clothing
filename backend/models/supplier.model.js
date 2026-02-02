const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 1. Supplier Profile Schema
const supplierProfileSchema = new Schema({
    supplier_id: { type: String, required: true, unique: true },
    company_name: { type: String, required: true },
    contact_person: { type: String },
    phone: { type: String },
    email: { type: String, lowercase: true },
    website: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postal_code: String
    },
    tax_id: { type: String },
    registration_number: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true }
});

// 2. Banking Details Schema
const bankingDetailsSchema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    bank_name: { type: String, required: true },
    account_number: { type: String, required: true },
    account_holder_name: { type: String, required: true },
    swift_code: String,
    iban: String,
    routing_number: String,
    payment_terms: { 
        type: String, 
        enum: ['Net 30', 'Net 60', 'Net 90', 'Immediate', 'Custom'],
        default: 'Net 30'
    },
    credit_limit: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    is_primary: { type: Boolean, default: true }
});

// 3. Product Catalog Schema
const productCatalogSchema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    product_description: String,
    brand_authorization: { 
        type: String, 
        enum: ['Authorized', 'Unauthorized', 'Pending'],
        default: 'Pending'
    },
    category: String,
    unit: String,
    price_list: [{
        min_quantity: Number,
        max_quantity: Number,
        unit_price: Number,
        currency: String,
        effective_date: Date,
        expiry_date: Date
    }],
    lead_time_days: { type: Number, default: 0 },
    moq: { type: Number, default: 1 }, // Minimum Order Quantity
    stock_availability: { type: Boolean, default: true }
});

// 4. Order History Schema
const orderHistorySchema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    po_number: { type: String, required: true, unique: true },
    order_date: { type: Date, default: Date.now },
    items: [{
        product_id: { type: Schema.Types.ObjectId, ref: 'ProductCatalog' },
        product_name: String,
        quantity: Number,
        unit_price: Number,
        total_price: Number
    }],
    total_quantity: Number,
    total_amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    payment_status: { 
        type: String, 
        enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue'],
        default: 'Pending'
    },
    delivery_date: Date,
    notes: String
});

// 5. Payment History Schema
const paymentHistorySchema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    invoice_number: { type: String, required: true, unique: true },
    po_number: { type: String, ref: 'OrderHistory' },
    invoice_date: { type: Date, default: Date.now },
    due_date: Date,
    total_amount: { type: Number, required: true },
    paid_amount: { type: Number, default: 0 },
    outstanding_balance: { type: Number, default: function() { return this.total_amount - this.paid_amount; } },
    currency: { type: String, default: 'USD' },
    payment_method: {
        type: String,
        enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Check', 'Online Payment']
    },
    payment_date: Date,
    reference_number: String,
    paid_by: String,
    status: { 
        type: String, 
        enum: ['Unpaid', 'Partially Paid', 'Paid', 'Overdue'],
        default: 'Unpaid'
    }
});

// 6. Performance Metrics Schema
// In your Mongoose schema file
const performanceMetricsSchema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    period_start: Date,
    period_end: Date,
    total_orders: { type: Number, default: 0 },
    completed_orders: { type: Number, default: 0 },
    on_time_delivery_rate: { type: Number, default: 0 }, // percentage
    quality_rating: { 
        type: Number, 
        min: 0,  // Change from 1 to 0
        max: 5, 
        default: 0  // Default should be 0 instead of letting it be undefined
    },
    return_rate: { type: Number, default: 0 }, // percentage
    average_lead_time: { type: Number, default: 0 }, // in days
    communication_rating: { 
        type: Number, 
        min: 0,  // Change from 1 to 0
        max: 5, 
        default: 0  // Default should be 0
    },
    overall_score: { type: Number, default: 0 }
});
// 7. Payment Schedule Schema
const paymentScheduleSchema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    invoice_number: { type: String, ref: 'PaymentHistory' },
    due_date: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Upcoming', 'Due Today', 'Overdue', 'Paid'],
        default: 'Upcoming'
    },
    reminder_sent: {
        due_7_days: { type: Boolean, default: false },
        due_3_days: { type: Boolean, default: false },
        due_1_day: { type: Boolean, default: false },
        overdue_1_day: { type: Boolean, default: false },
        overdue_7_days: { type: Boolean, default: false }
    },
    notes: String
});

// 8. Payment Processing Schema
const paymentProcessingSchema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    invoice_number: { type: String, ref: 'PaymentHistory' },
    invoice_date: Date,
    due_date: Date,
    original_amount: { type: Number, required: true },
    discount_amount: { type: Number, default: 0 },
    discount_percentage: { type: Number, default: 0 },
    net_amount: { type: Number, required: true },
    payment_method: {
        type: String,
        enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Check', 'Online Payment'],
        required: true
    },
    payment_date: { type: Date, default: Date.now },
    reference_number: String,
    paid_by: String,
    transaction_id: String,
    bank_account_used: {
        bank_name: String,
        account_number: String
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Reversed'],
        default: 'Pending'
    }
});

// Create models
const Supplier = mongoose.model('Supplier', supplierProfileSchema);
const BankingDetails = mongoose.model('BankingDetails', bankingDetailsSchema);
const ProductCatalog = mongoose.model('ProductCatalog', productCatalogSchema);
const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema);
const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);
const PerformanceMetrics = mongoose.model('PerformanceMetrics', performanceMetricsSchema);
const PaymentSchedule = mongoose.model('PaymentSchedule', paymentScheduleSchema);
const PaymentProcessing = mongoose.model('PaymentProcessing', paymentProcessingSchema);

module.exports = {
    Supplier,
    BankingDetails,
    ProductCatalog,
    OrderHistory,
    PaymentHistory,
    PerformanceMetrics,
    PaymentSchedule,
    PaymentProcessing
};