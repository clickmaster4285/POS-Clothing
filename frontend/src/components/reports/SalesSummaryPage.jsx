import { useMemo } from "react";
import { DollarSign, ShoppingCart, TrendingUp, RotateCcw, Package, Users } from "lucide-react";
import { KPICard } from "./KPICard";
import { ChartCard, SalesLineChart, ReportBarChart, ReportDonutChart } from "./ReportCharts";
import { ReportTable, StatusBadge } from "./ReportTable";
import { useStockByBranch, useStock } from "@/hooks/inv_hooks/useStock";
import { useAuth } from "@/hooks/useAuth";
import {
    useTransactions
} from "@/hooks/pos_hooks/useTransaction";
import { useSettings } from "@/hooks/useSettings";

const SalesSummaryPage = ({ dateRange = 'this-month' }) => {
    const { user: currentUser } = useAuth();
    const branchId = currentUser?.branchId || null;
    const { data: settings } = useSettings();

    // Calculate date range based on filter
    const getDateFilter = useMemo(() => {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        switch (dateRange) {
            case 'today':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;

            case 'this-week':
                const day = now.getDay();
                start.setDate(now.getDate() - day);
                start.setHours(0, 0, 0, 0);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;

            case 'this-month':
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(now.getMonth() + 1);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                break;

            case 'this-quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                start.setMonth(quarter * 3, 1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(quarter * 3 + 3, 0);
                end.setHours(23, 59, 59, 999);
                break;

            case 'this-year':
                start.setMonth(0, 1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(11, 31);
                end.setHours(23, 59, 59, 999);
                break;

            default:
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(now.getMonth() + 1);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
        }

        return { start, end };
    }, [dateRange]);

    // Fetch transactions with date filters
    const { data: transactionData, isLoading: transactionsLoading } = useTransactions({
        startDate: getDateFilter.start.toISOString(),
        endDate: getDateFilter.end.toISOString(),
        branchId: branchId
    });

    const transactions = transactionData?.transactions || [];

    // Fetch stock data with date filters
    const { data: branchStockData, isLoading: branchLoading } = useStockByBranch(
        branchId,
        {
            startDate: getDateFilter.start.toISOString(),
            endDate: getDateFilter.end.toISOString(),
        }
    );

    const { data: allStockData, isLoading: allStockLoading } = useStock({
        startDate: getDateFilter.start.toISOString(),
        endDate: getDateFilter.end.toISOString(),
    });

    const stockRawData = branchId ? branchStockData : allStockData;
    const stockLoading = branchId ? branchLoading : allStockLoading;
    const stockData = stockRawData?.data || [];

    console.log("Fetched transactions", transactions);
    console.log("Fetched stock data", stockData);

    const loading = transactionsLoading || stockLoading;

    // Process sales data
    const {
        kpiData,
        salesByHourData,
        paymentMethodData,
        monthlySalesData,
        topSellingProducts,
        dailySalesData
    } = useMemo(() => {
        // Initialize data structures
        let totalRevenue = 0;
        let totalTransactions = 0;
        let totalItemsSold = 0;
        let totalReturns = 0;
        let uniqueCustomers = new Set();

        // For charts
        const hourlySales = Array(24).fill(0);
        const monthlySales = {};
        const paymentMethods = {};
        const productSales = {};
        const dailyRevenue = {};

        // Get date range for filtering
        const startDate = getDateFilter.start;
        const endDate = getDateFilter.end;

        // Process returns from stock history
        stockData.forEach(item => {
            if (item.history && Array.isArray(item.history)) {
                item.history.forEach(historyItem => {
                    const transactionTime = new Date(historyItem.timestamp).getTime();
                    const startTime = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
                    const endTime = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);

                    if (transactionTime < startTime || transactionTime > endTime) return;

                    // Count returns from stock history
                    if (historyItem.action === 'return') {
                        totalReturns += Math.abs(historyItem.quantity || 0);
                    }
                });
            }
        });

        // Build product details map from stock data
        const productDetailsMap = {};
        stockData.forEach(item => {
            if (item.product?._id || item.product?.sku) {
                const productId = item.product._id || item.product.sku;
                productDetailsMap[productId] = {
                    name: item.product.productName || 'Unknown',
                    sku: item.product.sku || 'N/A',
                    category: item.product.category || 'Uncategorized',
                    color: item.color || 'N/A',
                    currentStock: item.currentStock || 0
                };
            }
        });

        // Process ONLY completed transactions from direct transaction data
        transactions.forEach(transaction => {
            // Only count completed transactions, not returns or voids
            if (transaction.status === 'completed') {
                totalTransactions++;

                const paymentMethod = transaction.payment?.paymentMethod || 'cash';
                const grandTotal = transaction.totals?.grandTotal || 0;

                totalRevenue += grandTotal;

                // Track unique customers
                if (transaction.customer?.customerId || transaction.customer?.customerFirstName) {
                    const customerId = transaction.customer.customerId ||
                        `${transaction.customer.customerFirstName}-${transaction.customer.customerLastName}`;
                    uniqueCustomers.add(customerId);
                }

                // Process cart items
                if (transaction.cartItems && Array.isArray(transaction.cartItems)) {
                    transaction.cartItems.forEach(item => {
                        const quantity = item.quantity || 1;
                        const unitPrice = item.unitPrice || 0;
                        const itemRevenue = quantity * unitPrice;

                        totalItemsSold += quantity;

                        // Track product sales
                        const productId = item.productId || item.id;
                        if (productId) {
                            if (!productSales[productId]) {
                                const productDetails = productDetailsMap[productId] || {};
                                productSales[productId] = {
                                    name: item.name || productDetails.name || 'Unknown',
                                    sku: productDetails.sku || 'N/A',
                                    category: productDetails.category || 'Uncategorized',
                                    sold: 0,
                                    revenue: 0,
                                    stock: productDetails.currentStock || 0,
                                    color: item.color || productDetails.color || 'N/A'
                                };
                            }
                            productSales[productId].sold += quantity;
                            productSales[productId].revenue += itemRevenue;
                        }
                    });
                }

                // Process timestamp data for charts
                const timestamp = transaction.timestamp || transaction.createdAt;
                if (timestamp) {
                    const date = new Date(timestamp);
                    const hour = date.getHours();
                    const month = date.toLocaleString('default', { month: 'short' });
                    const day = date.toISOString().split('T')[0];

                    // Hourly sales
                    hourlySales[hour] += grandTotal;

                    // Monthly sales
                    if (!monthlySales[month]) {
                        monthlySales[month] = { current: 0, previous: 0 };
                    }
                    monthlySales[month].current += grandTotal;

                    // Daily sales
                    if (!dailyRevenue[day]) {
                        dailyRevenue[day] = 0;
                    }
                    dailyRevenue[day] += grandTotal;
                }

                // Payment method tracking
                if (paymentMethod) {
                    const method = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
                    paymentMethods[method] = (paymentMethods[method] || 0) + grandTotal;
                }
            }
        });

        // Calculate averages
        const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        // Calculate net sales (total revenue minus returns value)
        // Assuming average return value is similar to average order value
        const netSales = totalRevenue - (totalReturns * averageOrderValue);

        // Format sales by hour for chart
        const salesByHourFormatted = hourlySales.map((sales, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            sales: Math.round(sales)
        })).filter(h => h.sales > 0);

        // Format payment methods for pie chart
        const paymentMethodFormatted = Object.entries(paymentMethods).map(([method, value]) => ({
            method,
            value: Math.round(value)
        }));

        // Format monthly sales
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlySalesFormatted = months.map(month => ({
            month,
            current: monthlySales[month]?.current || 0,
            previous: monthlySales[month]?.previous || 0
        }));

        // Get top selling products
        const topProductsFormatted = Object.values(productSales)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
            .map(product => ({
                ...product,
                revenue: `${settings?.currencySymbol || '$'}${product.revenue.toLocaleString()}`
            }));

        // Format daily sales for line chart
        const dailySalesFormatted = Object.entries(dailyRevenue)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .map(([date, revenue]) => ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: Math.round(revenue)
            }));

        return {
            kpiData: {
                totalSales: `${settings?.currencySymbol || '$'}${totalRevenue.toLocaleString()}`,
                transactions: totalTransactions,
                averageOrderValue: `${settings?.currencySymbol || '$'}${averageOrderValue.toFixed(2)}`,
                returns: totalReturns,
                netSales: `${settings?.currencySymbol || '$'}${netSales.toLocaleString()}`,
                itemsSold: totalItemsSold,
                uniqueCustomers: uniqueCustomers.size
            },
            salesByHourData: salesByHourFormatted,
            paymentMethodData: paymentMethodFormatted,
            monthlySalesData: monthlySalesFormatted,
            topSellingProducts: topProductsFormatted,
            dailySalesData: dailySalesFormatted
        };
    }, [transactions, stockData, getDateFilter, settings]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading sales data...</p>
            </div>
        );
    }

    // Prepare pie chart data
    const pieData = paymentMethodData.map(p => ({ name: p.method, value: p.value }));

    // Format date range for display
    const formatDateRange = () => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return `${getDateFilter.start.toLocaleDateString('en-US', options)} - ${getDateFilter.end.toLocaleDateString('en-US', options)}`;
    };

    return (
        <div className="space-y-6">
            {/* Date Range Indicator */}
            <div className="bg-muted/50 p-2 px-4 rounded-lg text-sm flex items-center justify-between">
                <span className="font-medium">Selected Period: {formatDateRange()}</span>
                <span className="text-muted-foreground capitalize">{dateRange.replace('-', ' ')}</span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-6">
                <KPICard title="Total Sales" value={kpiData.totalSales} icon={<DollarSign className="h-5 w-5" />} />
                <KPICard title="Transactions" value={kpiData.transactions} icon={<ShoppingCart className="h-5 w-5" />} prefix="" />
                <KPICard title="Avg. Order Value" value={kpiData.averageOrderValue} icon={<TrendingUp className="h-5 w-5" />} />
                <KPICard title="Items Sold" value={kpiData.itemsSold} icon={<Package className="h-5 w-5" />} prefix="" />
                <KPICard title="Returns" value={kpiData.returns} icon={<RotateCcw className="h-5 w-5" />} variant="warning" />
                <KPICard title="Net Sales" value={kpiData.netSales} icon={<DollarSign className="h-5 w-5" />} />
               
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-4 lg:grid-cols-3">
                <ChartCard title="Sales by Hour" className="lg:col-span-2">
                    <ReportBarChart
                        data={salesByHourData.length > 0 ? salesByHourData : [{ hour: 'No Data', sales: 0 }]}
                        xKey="hour"
                        bars={[{ key: "sales", name: "Revenue ($)" }]}
                    />
                </ChartCard>
                <ChartCard title="Payment Method Breakdown">
                    {pieData.length > 0 ? (
                        <ReportDonutChart data={pieData} />
                    ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            No payment data available
                        </div>
                    )}
                </ChartCard>
            </div>

            {/* Daily Sales Trend */}
            <ChartCard title="Daily Sales Trend">
                <SalesLineChart
                    data={dailySalesData.length > 0 ? dailySalesData : [{ date: 'No Data', revenue: 0 }]}
                    xKey="date"
                    lines={[
                        { key: "revenue", color: "hsl(16, 85%, 55%)", name: "Revenue ($)" }
                    ]}
                />
            </ChartCard>

            {/* Monthly Sales Comparison */}
            <ChartCard title="Monthly Sales Comparison">
                <ReportBarChart
                    data={monthlySalesData}
                    xKey="month"
                    bars={[
                        { key: "current", name: "Current Year", color: "hsl(16, 85%, 55%)" },
                        { key: "previous", name: "Previous Year", color: "hsl(220, 15%, 70%)" }
                    ]}
                />
            </ChartCard>

            {/* Top Selling Products Table */}
            <ReportTable
                title="Top Selling Products"
                data={topSellingProducts}
                columns={[
                    { header: "Product", accessor: "name" },
                    { header: "SKU", accessor: "sku" },
                    { header: "Color", accessor: "color" },
                    { header: "Units Sold", accessor: "sold", align: "right" },
                    { header: "Revenue", accessor: "revenue", align: "right" },
                    {
                        header: "Stock Status",
                        accessor: (row) => {
                            if (row.stock === 0) return <StatusBadge status="out-of-stock" />;
                            if (row.stock < 5) return <StatusBadge status="low-stock" />;
                            return <StatusBadge status="in-stock" />;
                        }
                    },
                ]}
            />

            {/* No Data Message */}
            {topSellingProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No sales data available for {dateRange.replace('-', ' ')}
                </div>
            )}
        </div>
    );
};

export default SalesSummaryPage;