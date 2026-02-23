"use client"

import { useMemo, useState } from "react";
import { Users, UserPlus, DollarSign, Award, X } from "lucide-react";
import { KPICard } from "./KPICard";
import { ChartCard, SalesLineChart, ReportDonutChart } from "./ReportCharts";
import { useTransactionsByCustomer } from "@/hooks/pos_hooks/useTransaction";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const CustomerPage = ({ customers }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Only fetch transactions when a customer is selected
    const { data: transactionsData, isLoading: transactionsLoading } =
        useTransactionsByCustomer(selectedCustomer?.id, {
            enabled: !!selectedCustomer?.id && isModalOpen // Only fetch when modal is open and customer is selected
        });


    const transactions = transactionsData?.transactions || [];

    const kpiData = useMemo(() => {
        const totalCustomers = customers?.length;
        const loyaltyMembers = customers?.filter(c => c.loyaltyPoints > 0).length;

        const newCustomers = customers.filter(c => {
            const created = new Date(c.createdAt);
            const now = new Date();
            const diffDays = (now - created) / (1000 * 60 * 60 * 24);
            return diffDays <= 30;
        }).length;

        // For KPI calculations, we might need to fetch all transactions or use a different approach
        // For now, we'll calculate based on the customers data only
        const avgSpend = 0; // You might want to handle this differently

        return { totalCustomers, newCustomers, avgSpend, loyaltyMembers };
    }, [customers]);

    // === Customer Growth Trend ===
    const customerGrowth = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(i);
            const monthStr = date.toLocaleString("default", { month: "short" });
            const count = customers.filter(c => new Date(c.createdAt).getMonth() === i).length;
            return { month: monthStr, customers: count };
        });
        return months;
    }, [customers]);

    // === Retention Data ===
    const retentionData = useMemo(() => {
        const loyalty = customers.filter(c => c.loyaltyPoints > 0).length;
        const nonLoyalty = customers.length - loyalty;
        return [
            { name: "Loyalty Members", value: loyalty },
            { name: "Non Loyalty", value: nonLoyalty },
        ];
    }, [customers]);

    const topCustomers = useMemo(() => {
        // For top customers, we'll show basic info without transaction data
        return customers.map(c => {
            return {
                id: c._id,
                name: `${c.firstName} ${c.lastName}`,
                email: c.email,
                phone: c.phone,
                loyaltyPoints: c.loyaltyPoints,
                orders: 0, // You might want to fetch this from a separate endpoint
                totalSpent: 0, // You might want to fetch this from a separate endpoint
                lastVisit: "-",
            };
        }).slice(0, 10);
    }, [customers]);

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KPICard title="Total Customers" value={kpiData.totalCustomers} prefix="" icon={<Users className="h-5 w-5" />} change={12.1} />
                <KPICard title="New Customers" value={kpiData.newCustomers} prefix="" icon={<UserPlus className="h-5 w-5" />} change={18.4} />
                <KPICard title="Avg. Spend" value={kpiData.avgSpend} icon={<DollarSign className="h-5 w-5" />} change={5.2} />
                <KPICard title="Loyalty Members" value={kpiData.loyaltyMembers} prefix="" icon={<Award className="h-5 w-5" />} change={22.6} />
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-3">
                <ChartCard title="Customer Growth Trend" className="lg:col-span-2">
                    <SalesLineChart data={customerGrowth} xKey="month" lines={[{ key: "customers" }]} />
                </ChartCard>
                <ChartCard title="Retention Reasons">
                    <ReportDonutChart data={retentionData} />
                </ChartCard>
            </div>

            {/* Top Customers List */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Customers</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <ul className="space-y-2">
                        {topCustomers.map((customer) => (
                            <li
                                key={customer.id}
                                onClick={() => handleCustomerClick(customer)}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                            >
                                <div>
                                    <span className="font-medium text-gray-800 block">{customer.name}</span>
                                    <span className="text-xs text-gray-500">{customer.email}</span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    Points: {customer.loyaltyPoints}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                {selectedCustomer?.name}'s Transactions
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {selectedCustomer && (
                                <div className="space-y-6">
                                    {/* Customer Summary */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{selectedCustomer.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{selectedCustomer.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Loyalty Points</p>
                                            <p className="font-medium">{selectedCustomer.loyaltyPoints || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Spent</p>
                                            <p className="font-medium">
                                                {formatCurrency(
                                                    transactions.reduce((sum, t) => sum + (t.totals?.grandTotal || 0), 0)
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Transactions */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-3">Transaction History</h3>
                                        {transactionsLoading ? (
                                            <div className="text-center py-8">
                                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                                <p className="mt-2 text-gray-500">Loading transactions...</p>
                                            </div>
                                        ) : transactions.length > 0 ? (
                                            <div className="space-y-3">
                                                {transactions.map((transaction, index) => (
                                                    <div
                                                        key={transaction._id || index}
                                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="font-medium">
                                                                    Transaction #{transaction.invoiceNumber || transaction._id?.slice(-6)}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {new Date(transaction.createdAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <span className="text-lg font-semibold text-green-600">
                                                                {formatCurrency(transaction.totals?.grandTotal || 0)}
                                                            </span>
                                                        </div>

                                                        {transaction.items && transaction.items.length > 0 && (
                                                            <div className="mt-3">
                                                                <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                                                                <div className="space-y-2">
                                                                    {transaction.items.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between text-sm">
                                                                            <span className="text-gray-600">
                                                                                {item.name} x {item.quantity}
                                                                            </span>
                                                                            <span className="text-gray-800">
                                                                                {formatCurrency(item.total || item.price * item.quantity)}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {transaction.paymentMethod && (
                                                            <div className="mt-2 text-sm">
                                                                <span className="text-gray-500">Payment: </span>
                                                                <span className="font-medium capitalize">{transaction.paymentMethod}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                No transactions found for this customer
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerPage;