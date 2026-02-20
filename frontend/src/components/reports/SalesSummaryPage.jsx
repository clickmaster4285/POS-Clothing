import { useMemo } from "react";
import { DollarSign, ShoppingCart, TrendingUp, RotateCcw, Package, Users } from "lucide-react";
import { KPICard } from "./KPICard";
import { ChartCard, SalesLineChart, ReportBarChart, ReportDonutChart } from "./ReportCharts";
import { ReportTable, StatusBadge } from "./ReportTable";
import { useStockByBranch, useStock } from "@/hooks/inv_hooks/useStock";
import { useAuth } from "@/hooks/useAuth";

const SalesSummaryPage = () => {
    const { user: currentUser } = useAuth();
    const branchId = currentUser?.branchId || null;

    // Fetch stock data
    const { data: branchStockData, isLoading: branchLoading } = useStockByBranch(branchId);
    const { data: allStockData, isLoading: allStockLoading } = useStock();

    const stockRawData = branchId ? branchStockData : allStockData;
    const loading = branchId ? branchLoading : allStockLoading;

    const stockData = stockRawData?.data || [];

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

        // Process each stock item's history
        stockData.forEach(item => {
            if (item.history && Array.isArray(item.history)) {
                item.history.forEach(transaction => {
                    if (transaction.action === 'sale') {
                        const quantity = Math.abs(transaction.quantity || 0);
                        const timestamp = transaction.timestamp;
                        const date = new Date(timestamp);
                        const hour = date.getHours();
                        const month = date.toLocaleString('default', { month: 'short' });
                        const day = date.toISOString().split('T')[0];

                        // Calculate revenue (you might need to adjust this based on your price structure)
                        const price = item.product?.variants?.[0]?.price?.retailPrice || 0;
                        const revenue = quantity * price;

                        totalRevenue += revenue;
                        totalItemsSold += quantity;
                        totalTransactions += 1;

                        // Track unique customers (if you have customer data)
                        if (transaction.user) {
                            uniqueCustomers.add(transaction.user);
                        }

                        // Hourly sales
                        hourlySales[hour] += revenue;

                        // Monthly sales
                        if (!monthlySales[month]) {
                            monthlySales[month] = { current: 0, previous: 0 };
                        }
                        monthlySales[month].current += revenue;

                        // Daily revenue for trend
                        if (!dailyRevenue[day]) {
                            dailyRevenue[day] = 0;
                        }
                        dailyRevenue[day] += revenue;

                        // Payment methods (if you have this data)
                        const method = transaction.paymentMethod || 'Cash';
                        paymentMethods[method] = (paymentMethods[method] || 0) + revenue;

                        // Product sales tracking
                        const productId = item.product?._id || item.product?.sku;
                        const productName = item.product?.productName || 'Unknown';
                        if (productId) {
                            if (!productSales[productId]) {
                                productSales[productId] = {
                                    name: productName,
                                    sku: item.product?.sku || 'N/A',
                                    category: item.product?.category || 'Uncategorized',
                                    sold: 0,
                                    revenue: 0,
                                    stock: item.currentStock || 0,
                                    color: item.color || 'N/A'
                                };
                            }
                            productSales[productId].sold += quantity;
                            productSales[productId].revenue += revenue;
                        }
                    } else if (transaction.action === 'return') {
                        totalReturns += Math.abs(transaction.quantity || 0);
                    }
                });
            }
        });

        // Calculate averages
        const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
        const netSales = totalRevenue - (totalReturns * averageOrderValue); // Approximate

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
                revenue: `$${product.revenue.toLocaleString()}`
            }));

        // Format daily sales for line chart
        const dailySalesFormatted = Object.entries(dailyRevenue)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .slice(-30) // Last 30 days
            .map(([date, revenue]) => ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: Math.round(revenue)
            }));

        return {
            kpiData: {
                totalSales: `$${totalRevenue.toLocaleString()}`,
                transactions: totalTransactions,
                averageOrderValue: `$${averageOrderValue.toFixed(2)}`,
                returns: totalReturns,
                netSales: `$${netSales.toLocaleString()}`,
                itemsSold: totalItemsSold,
                uniqueCustomers: uniqueCustomers.size
            },
            salesByHourData: salesByHourFormatted,
            paymentMethodData: paymentMethodFormatted,
            monthlySalesData: monthlySalesFormatted,
            topSellingProducts: topProductsFormatted,
            dailySalesData: dailySalesFormatted
        };
    }, [stockData]);

    if (loading) return <p className="p-4">Loading...</p>;

    // Prepare pie chart data
    const pieData = paymentMethodData.map(p => ({ name: p.method, value: p.value }));

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
                <KPICard title="Total Sales" value={kpiData.totalSales} icon={<DollarSign className="h-5 w-5" />} />
                <KPICard title="Transactions" value={kpiData.transactions} icon={<ShoppingCart className="h-5 w-5" />} prefix="" />
                <KPICard title="Avg. Order Value" value={kpiData.averageOrderValue} icon={<TrendingUp className="h-5 w-5" />} />
                <KPICard title="Items Sold" value={kpiData.itemsSold} icon={<Package className="h-5 w-5" />} prefix="" />
                <KPICard title="Returns" value={kpiData.returns} icon={<RotateCcw className="h-5 w-5" />} variant="warning" />
                <KPICard title="Net Sales" value={kpiData.netSales} icon={<DollarSign className="h-5 w-5" />} />
                <KPICard title="Unique Customers" value={kpiData.uniqueCustomers} icon={<Users className="h-5 w-5" />} prefix="" />
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
            <ChartCard title="Daily Sales Trend (Last 30 Days)">
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

            {/* If no data available */}
            {topSellingProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No sales data available for the selected period
                </div>
            )}
        </div>
    );
};

export default SalesSummaryPage;