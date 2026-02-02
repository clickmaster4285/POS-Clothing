const {
    Supplier,
    BankingDetails,
    ProductCatalog,
    OrderHistory,
    PaymentHistory,
    PerformanceMetrics,
    PaymentSchedule,
    PaymentProcessing
} = require('../models/supplier.model');

// ==================== SUPPLIER PROFILE CONTROLLERS ====================

// Create new supplier
const createSupplier = async (req, res) => {
    try {
        const supplierData = req.body;
        
        // Check if supplier already exists
        const existingSupplier = await Supplier.findOne({ 
            $or: [
                { email: supplierData.email },
                { company_name: supplierData.company_name }
            ]
        });
        
        if (existingSupplier) {
            return res.status(400).json({
                success: false,
                message: 'Supplier with this email or company name already exists'
            });
        }
        
        const supplier = new Supplier(supplierData);
        await supplier.save();
        
        // Create initial performance metrics with proper defaults
        const performanceMetrics = new PerformanceMetrics({
            supplier_id: supplier._id,
            quality_rating: 0, // Explicitly set to 0
            communication_rating: 0, // Explicitly set to 0
            overall_score: 0
        });
        await performanceMetrics.save();
        
        res.status(201).json({
            success: true,
            message: 'Supplier created successfully',
            data: supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating supplier',
            error: error.message
        });
    }
};

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;
        
        const query = {};
        
        // Search functionality
        if (search) {
            query.$or = [
                { company_name: { $regex: search, $options: 'i' } },
                { contact_person: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by status
        if (status) {
            if (status === 'active') query.is_active = true;
            else if (status === 'inactive') query.is_active = false;
        }
        
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
        
        const [suppliers, total] = await Promise.all([
            Supplier.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .sort(sort),
            Supplier.countDocuments(query)
        ]);
        
        res.status(200).json({
            success: true,
            data: suppliers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching suppliers',
            error: error.message
        });
    }
};

// Get single supplier with related data
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        
        // Get related data
        const [
            bankingDetails,
            productCatalog,
            recentOrders,
            recentPayments,
            performanceMetrics,
            upcomingPayments
        ] = await Promise.all([
            BankingDetails.find({ supplier_id: id, is_primary: true }),
            ProductCatalog.find({ supplier_id: id }),
            OrderHistory.find({ supplier_id: id })
                .sort({ order_date: -1 })
                .limit(5),
            PaymentHistory.find({ supplier_id: id })
                .sort({ invoice_date: -1 })
                .limit(5),
            PerformanceMetrics.findOne({ supplier_id: id }),
            PaymentSchedule.find({ 
                supplier_id: id,
                status: { $in: ['Upcoming', 'Due Today'] }
            }).sort({ due_date: 1 })
        ]);
        
        // Calculate summary statistics
        const paymentStats = await PaymentHistory.aggregate([
            { $match: { supplier_id: mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    totalInvoiced: { $sum: '$total_amount' },
                    totalPaid: { $sum: '$paid_amount' },
                    totalOutstanding: { $sum: '$outstanding_balance' }
                }
            }
        ]);
        
        const orderStats = await OrderHistory.aggregate([
            { $match: { supplier_id: mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$total_amount' }
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                supplier,
                bankingDetails,
                productCatalog,
                recentOrders,
                recentPayments,
                performanceMetrics,
                upcomingPayments,
                statistics: {
                    payment: paymentStats[0] || { totalInvoiced: 0, totalPaid: 0, totalOutstanding: 0 },
                    order: orderStats[0] || { totalOrders: 0, totalAmount: 0 }
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching supplier details',
            error: error.message
        });
    }
};

// Update supplier
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const supplier = await Supplier.findByIdAndUpdate(
            id,
            { ...updateData, updated_at: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Supplier updated successfully',
            data: supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating supplier',
            error: error.message
        });
    }
};

// Delete supplier (soft delete)
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        
        const supplier = await Supplier.findByIdAndUpdate(
            id,
            { is_active: false, updated_at: Date.now() },
            { new: true }
        );
        
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Supplier deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deactivating supplier',
            error: error.message
        });
    }
};

// ==================== BANKING DETAILS CONTROLLERS ====================

const addBankingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const bankingData = { ...req.body, supplier_id: id };
        
        // If setting as primary, update other accounts to non-primary
        if (bankingData.is_primary) {
            await BankingDetails.updateMany(
                { supplier_id: id, is_primary: true },
                { is_primary: false }
            );
        }
        
        const bankingDetails = new BankingDetails(bankingData);
        await bankingDetails.save();
        
        res.status(201).json({
            success: true,
            message: 'Banking details added successfully',
            data: bankingDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding banking details',
            error: error.message
        });
    }
};

const getBankingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const bankingDetails = await BankingDetails.find({ supplier_id: id });
        
        res.status(200).json({
            success: true,
            data: bankingDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching banking details',
            error: error.message
        });
    }
};

// ==================== PRODUCT CATALOG CONTROLLERS ====================

const addProductToCatalog = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = { ...req.body, supplier_id: id };
        
        const product = new ProductCatalog(productData);
        await product.save();
        
        res.status(201).json({
            success: true,
            message: 'Product added to catalog successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding product to catalog',
            error: error.message
        });
    }
};

const getSupplierCatalog = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, brand, inStock } = req.query;
        
        const query = { supplier_id: id };
        
        if (category) query.category = category;
        if (brand) query.brand_authorization = brand;
        if (inStock !== undefined) query.stock_availability = inStock === 'true';
        
        const products = await ProductCatalog.find(query);
        
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product catalog',
            error: error.message
        });
    }
};

// ==================== ORDER HISTORY CONTROLLERS ====================

const createOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const orderData = { ...req.body, supplier_id: id };
        
        // Calculate totals
        orderData.total_quantity = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
        orderData.total_amount = orderData.items.reduce((sum, item) => sum + item.total_price, 0);
        
        const order = new OrderHistory(orderData);
        await order.save();
        
        // Create initial payment history
        const paymentHistory = new PaymentHistory({
            supplier_id: id,
            po_number: order.po_number,
            invoice_number: `INV-${Date.now()}`,
            invoice_date: new Date(),
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            total_amount: order.total_amount,
            outstanding_balance: order.total_amount
        });
        await paymentHistory.save();
        
        // Create payment schedule
        const paymentSchedule = new PaymentSchedule({
            supplier_id: id,
            invoice_number: paymentHistory.invoice_number,
            due_date: paymentHistory.due_date,
            amount: paymentHistory.total_amount,
            status: 'Upcoming'
        });
        await paymentSchedule.save();
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order,
                paymentHistory,
                paymentSchedule
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

const getSupplierOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            status, 
            startDate, 
            endDate,
            page = 1,
            limit = 10 
        } = req.query;
        
        const query = { supplier_id: id };
        
        if (status) query.status = status;
        if (startDate || endDate) {
            query.order_date = {};
            if (startDate) query.order_date.$gte = new Date(startDate);
            if (endDate) query.order_date.$lte = new Date(endDate);
        }
        
        const skip = (page - 1) * limit;
        
        const [orders, total] = await Promise.all([
            OrderHistory.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ order_date: -1 }),
            OrderHistory.countDocuments(query)
        ]);
        
        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// ==================== PAYMENT CONTROLLERS ====================

const processPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentData = { ...req.body, supplier_id: id };
        
        // Create payment processing record
        const paymentProcessing = new PaymentProcessing(paymentData);
        await paymentProcessing.save();
        
        // Update payment history
        const paymentHistory = await PaymentHistory.findOne({
            invoice_number: paymentData.invoice_number,
            supplier_id: id
        });
        
        if (!paymentHistory) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }
        
        paymentHistory.paid_amount += paymentData.net_amount;
        paymentHistory.payment_method = paymentData.payment_method;
        paymentHistory.payment_date = paymentData.payment_date;
        paymentHistory.reference_number = paymentData.reference_number;
        paymentHistory.paid_by = paymentData.paid_by;
        
        // Recalculate balance and status
        paymentHistory.outstanding_balance = paymentHistory.total_amount - paymentHistory.paid_amount;
        
        if (paymentHistory.outstanding_balance <= 0) {
            paymentHistory.status = 'Paid';
        } else if (paymentHistory.paid_amount > 0) {
            paymentHistory.status = 'Partially Paid';
        }
        
        await paymentHistory.save();
        
        // Update payment schedule
        if (paymentHistory.outstanding_balance <= 0) {
            await PaymentSchedule.findOneAndUpdate(
                { 
                    supplier_id: id,
                    invoice_number: paymentData.invoice_number 
                },
                { status: 'Paid' }
            );
        }
        
        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            data: {
                paymentProcessing,
                paymentHistory
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, startDate, endDate } = req.query;
        
        const query = { supplier_id: id };
        
        if (status) query.status = status;
        if (startDate || endDate) {
            query.invoice_date = {};
            if (startDate) query.invoice_date.$gte = new Date(startDate);
            if (endDate) query.invoice_date.$lte = new Date(endDate);
        }
        
        const payments = await PaymentHistory.find(query)
            .sort({ invoice_date: -1 });
        
        // Calculate summary
        const summary = payments.reduce((acc, payment) => {
            acc.totalInvoiced += payment.total_amount;
            acc.totalPaid += payment.paid_amount;
            acc.totalOutstanding += payment.outstanding_balance;
            return acc;
        }, { totalInvoiced: 0, totalPaid: 0, totalOutstanding: 0 });
        
        res.status(200).json({
            success: true,
            data: payments,
            summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment history',
            error: error.message
        });
    }
};

// ==================== PERFORMANCE METRICS CONTROLLERS ====================

const updatePerformanceMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get all completed orders for this supplier
        const completedOrders = await OrderHistory.find({
            supplier_id: id,
            status: 'Delivered'
        });
        
        // Get all orders for this supplier
        const allOrders = await OrderHistory.find({ supplier_id: id });
        
        // Calculate metrics
        const totalOrders = allOrders.length;
        const completedOrdersCount = completedOrders.length;
        
        // Calculate on-time delivery rate
        const onTimeDeliveries = completedOrders.filter(order => {
            if (!order.delivery_date) return false;
            const expectedDate = new Date(order.order_date);
            expectedDate.setDate(expectedDate.getDate() + order.lead_time_days);
            return order.delivery_date <= expectedDate;
        }).length;
        
        const onTimeDeliveryRate = completedOrdersCount > 0 
            ? (onTimeDeliveries / completedOrdersCount) * 100 
            : 0;
        
        // Calculate average lead time
        const totalLeadTime = completedOrders.reduce((sum, order) => {
            if (order.delivery_date && order.order_date) {
                const leadTime = (order.delivery_date - order.order_date) / (1000 * 60 * 60 * 24);
                return sum + leadTime;
            }
            return sum;
        }, 0);
        
        const averageLeadTime = completedOrdersCount > 0 
            ? totalLeadTime / completedOrdersCount 
            : 0;
        
        // Update performance metrics
        const performanceMetrics = await PerformanceMetrics.findOneAndUpdate(
            { supplier_id: id },
            {
                total_orders: totalOrders,
                completed_orders: completedOrdersCount,
                on_time_delivery_rate: onTimeDeliveryRate,
                average_lead_time: averageLeadTime,
                // Note: Quality rating and return rate would need separate data
                updated_at: new Date()
            },
            { new: true, upsert: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Performance metrics updated successfully',
            data: performanceMetrics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating performance metrics',
            error: error.message
        });
    }
};

const getPerformanceMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        
        const performanceMetrics = await PerformanceMetrics.findOne({ supplier_id: id });
        
        if (!performanceMetrics) {
            return res.status(404).json({
                success: false,
                message: 'Performance metrics not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: performanceMetrics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching performance metrics',
            error: error.message
        });
    }
};

// ==================== PAYMENT SCHEDULE CONTROLLERS ====================

const getPaymentSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;
        
        const query = { supplier_id: id };
        if (status) query.status = status;
        
        const paymentSchedule = await PaymentSchedule.find(query)
            .sort({ due_date: 1 })
            .populate('invoice_number', 'invoice_number total_amount');
        
        res.status(200).json({
            success: true,
            data: paymentSchedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment schedule',
            error: error.message
        });
    }
};

const sendPaymentReminders = async (req, res) => {
    try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Find upcoming payments
        const upcomingPayments = await PaymentSchedule.find({
            status: 'Upcoming',
            due_date: { $lte: nextWeek }
        }).populate('supplier_id', 'email contact_person');
        
        const remindersSent = [];
        
        for (const payment of upcomingPayments) {
            const daysUntilDue = Math.ceil((payment.due_date - today) / (1000 * 60 * 60 * 24));
            
            // Send reminder based on days until due
            if (daysUntilDue === 7 && !payment.reminder_sent.due_7_days) {
                // Send 7-day reminder
                remindersSent.push({
                    paymentId: payment._id,
                    type: '7-day',
                    recipient: payment.supplier_id.email
                });
                payment.reminder_sent.due_7_days = true;
            } else if (daysUntilDue === 3 && !payment.reminder_sent.due_3_days) {
                // Send 3-day reminder
                remindersSent.push({
                    paymentId: payment._id,
                    type: '3-day',
                    recipient: payment.supplier_id.email
                });
                payment.reminder_sent.due_3_days = true;
            } else if (daysUntilDue === 1 && !payment.reminder_sent.due_1_day) {
                // Send 1-day reminder
                remindersSent.push({
                    paymentId: payment._id,
                    type: '1-day',
                    recipient: payment.supplier_id.email
                });
                payment.reminder_sent.due_1_day = true;
                payment.status = 'Due Today';
            }
            
            // Check for overdue payments
            if (payment.due_date < today && payment.status !== 'Paid') {
                payment.status = 'Overdue';
                const daysOverdue = Math.ceil((today - payment.due_date) / (1000 * 60 * 60 * 24));
                
                if (daysOverdue === 1 && !payment.reminder_sent.overdue_1_day) {
                    // Send overdue reminder
                    remindersSent.push({
                        paymentId: payment._id,
                        type: 'overdue-1-day',
                        recipient: payment.supplier_id.email
                    });
                    payment.reminder_sent.overdue_1_day = true;
                } else if (daysOverdue >= 7 && !payment.reminder_sent.overdue_7_days) {
                    // Send 7-days overdue reminder
                    remindersSent.push({
                        paymentId: payment._id,
                        type: 'overdue-7-days',
                        recipient: payment.supplier_id.email
                    });
                    payment.reminder_sent.overdue_7_days = true;
                }
            }
            
            await payment.save();
        }
        
        // In a real application, you would send actual emails here
        // For now, we'll just return the reminder information
        
        res.status(200).json({
            success: true,
            message: 'Payment reminders processed',
            data: {
                remindersSent,
                count: remindersSent.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error sending payment reminders',
            error: error.message
        });
    }
};

// ==================== DASHBOARD/REPORTING CONTROLLERS ====================

const getSupplierDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get current date and calculate date ranges
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Get recent orders
        const recentOrders = await OrderHistory.find({
            supplier_id: id,
            order_date: { $gte: thirtyDaysAgo }
        }).sort({ order_date: -1 }).limit(10);
        
        // Get recent payments
        const recentPayments = await PaymentHistory.find({
            supplier_id: id,
            invoice_date: { $gte: thirtyDaysAgo }
        }).sort({ invoice_date: -1 }).limit(10);
        
        // Get upcoming payments
        const upcomingPayments = await PaymentSchedule.find({
            supplier_id: id,
            status: { $in: ['Upcoming', 'Due Today'] },
            due_date: { $gte: today }
        }).sort({ due_date: 1 }).limit(10);
        
        // Get performance metrics
        const performanceMetrics = await PerformanceMetrics.findOne({ supplier_id: id });
        
        // Calculate monthly statistics
        const monthlyStats = await OrderHistory.aggregate([
            {
                $match: {
                    supplier_id: mongoose.Types.ObjectId(id),
                    order_date: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$order_date' },
                        month: { $month: '$order_date' }
                    },
                    orderCount: { $sum: 1 },
                    totalAmount: { $sum: '$total_amount' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                recentOrders,
                recentPayments,
                upcomingPayments,
                performanceMetrics,
                monthlyStats,
                summary: {
                    totalOrders: recentOrders.length,
                    totalPayments: recentPayments.length,
                    upcomingPaymentsCount: upcomingPayments.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

const getSupplierReports = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportType, startDate, endDate } = req.query;
        
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        
        let reportData = {};
        
        switch(reportType) {
            case 'order_summary':
                reportData = await generateOrderSummary(id, start, end);
                break;
            case 'payment_summary':
                reportData = await generatePaymentSummary(id, start, end);
                break;
            case 'performance_report':
                reportData = await generatePerformanceReport(id, start, end);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid report type'
                });
        }
        
        res.status(200).json({
            success: true,
            data: reportData,
            metadata: {
                reportType,
                startDate: start,
                endDate: end,
                generatedAt: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating report',
            error: error.message
        });
    }
};

// Helper functions for reports
const generateOrderSummary = async (supplierId, startDate, endDate) => {
    const orders = await OrderHistory.aggregate([
        {
            $match: {
                supplier_id: mongoose.Types.ObjectId(supplierId),
                order_date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$total_amount' },
                avgAmount: { $avg: '$total_amount' }
            }
        },
        {
            $project: {
                status: '$_id',
                count: 1,
                totalAmount: 1,
                avgAmount: { $round: ['$avgAmount', 2] },
                _id: 0
            }
        }
    ]);
    
    const totalStats = await OrderHistory.aggregate([
        {
            $match: {
                supplier_id: mongoose.Types.ObjectId(supplierId),
                order_date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalAmount: { $sum: '$total_amount' },
                avgOrderValue: { $avg: '$total_amount' }
            }
        }
    ]);
    
    return {
        ordersByStatus: orders,
        summary: totalStats[0] || {}
    };
};

const generatePaymentSummary = async (supplierId, startDate, endDate) => {
    const payments = await PaymentHistory.aggregate([
        {
            $match: {
                supplier_id: mongoose.Types.ObjectId(supplierId),
                invoice_date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalInvoiced: { $sum: '$total_amount' },
                totalPaid: { $sum: '$paid_amount' },
                totalOutstanding: { $sum: '$outstanding_balance' }
            }
        }
    ]);
    
    const cashFlow = await PaymentHistory.aggregate([
        {
            $match: {
                supplier_id: mongoose.Types.ObjectId(supplierId),
                invoice_date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$invoice_date' },
                    month: { $month: '$invoice_date' }
                },
                totalInvoiced: { $sum: '$total_amount' },
                totalPaid: { $sum: '$paid_amount' }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    return {
        paymentsByStatus: payments,
        cashFlowAnalysis: cashFlow
    };
};

const generatePerformanceReport = async (supplierId, startDate, endDate) => {
    const performance = await PerformanceMetrics.findOne({
        supplier_id: supplierId
    });
    
    const orderTrends = await OrderHistory.aggregate([
        {
            $match: {
                supplier_id: mongoose.Types.ObjectId(supplierId),
                order_date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$order_date' },
                    month: { $month: '$order_date' },
                    week: { $week: '$order_date' }
                },
                orderCount: { $sum: 1 },
                totalAmount: { $sum: '$total_amount' },
                avgLeadTime: { $avg: '$lead_time_days' }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
    ]);
    
    return {
        currentPerformance: performance,
        orderTrends,
        period: {
            startDate,
            endDate
        }
    };
};

module.exports = {
    // Supplier Profile
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    
    // Banking Details
    addBankingDetails,
    getBankingDetails,
    
    // Product Catalog
    addProductToCatalog,
    getSupplierCatalog,
    
    // Order History
    createOrder,
    getSupplierOrders,
    
    // Payment
    processPayment,
    getPaymentHistory,
    
    // Performance Metrics
    updatePerformanceMetrics,
    getPerformanceMetrics,
    
    // Payment Schedule
    getPaymentSchedule,
    sendPaymentReminders,
    
    // Dashboard & Reports
    getSupplierDashboard,
    getSupplierReports
};