import { useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Percent, Package, RotateCcw } from "lucide-react";
import { KPICard } from "./KPICard";
import { ChartCard, SalesLineChart } from "./ReportCharts";
import { useStockByBranch, useStock } from "@/hooks/inv_hooks/useStock";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useSettings } from "@/hooks/useSettings";

const FinancialPage = ({ dateRange }) => {
    const { user: currentUser } = useAuth();
    const branchId = currentUser?.branchId || null;
    const { data: settings } = useSettings();
    // Fetch stock data
    const { data: branchStockData, isLoading: branchLoading } = useStockByBranch(branchId);
    const { data: allStockData, isLoading: allStockLoading } = useStock();

    const stockRawData = branchId ? branchStockData : allStockData;
    const loading = branchId ? branchLoading : allStockLoading;

    const stockData = stockRawData?.data || [];

    // Helper function to check if a date is within the selected range
    const isDateInRange = (date) => {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        switch (dateRange) {
            case 'today':
                return date >= startOfDay && date <= endOfDay;

            case 'this-week': {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday
                startOfWeek.setHours(0, 0, 0, 0);
                return date >= startOfWeek;
            }

            case 'this-month': {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                startOfMonth.setHours(0, 0, 0, 0);
                return date >= startOfMonth;
            }

            case 'this-quarter': {
                const quarter = Math.floor(now.getMonth() / 3);
                const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
                startOfQuarter.setHours(0, 0, 0, 0);
                return date >= startOfQuarter;
            }

            case 'this-year': {
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                startOfYear.setHours(0, 0, 0, 0);
                return date >= startOfYear;
            }

            default:
                return true;
        }
    };

    // Process financial data with date filtering
    const { kpis, revenueVsExpensesData, incomeStatementData } = useMemo(() => {
        let totalRevenue = 0;
        let totalCostOfGoodsSold = 0;
        let totalExpenses = 0; // For non-COGS expenses (if any)
        let totalReturns = 0;

        // Monthly data for chart
        const monthlyData = {};

        stockData.forEach(item => {
            // Get product cost and price from the variant
            const variant = item.product?.variants?.[0];
            const costPrice = variant?.price?.costPrice || 0;
            const retailPrice = variant?.price?.retailPrice || 0;

            if (item.history && Array.isArray(item.history)) {
                item.history.forEach(transaction => {
                    const timestamp = transaction.timestamp;
                    const transactionDate = new Date(timestamp);

                    // Filter by date range
                    if (!isDateInRange(transactionDate)) {
                        return;
                    }

                    const month = transactionDate.toLocaleString('default', { month: 'short' });
                    const quantity = Math.abs(transaction.quantity || 0);

                    // Initialize monthly data
                    if (!monthlyData[month]) {
                        monthlyData[month] = { month, revenue: 0, cogs: 0, profit: 0 };
                    }

                    if (transaction.action === 'sale') {
                        const revenue = quantity * retailPrice;
                        const cogs = quantity * costPrice;

                        totalRevenue += revenue;
                        totalCostOfGoodsSold += cogs;

                        monthlyData[month].revenue += revenue;
                        monthlyData[month].cogs += cogs;
                        monthlyData[month].profit += (revenue - cogs);
                    }
                    else if (transaction.action === 'return') {
                        // Returns reduce revenue but also reduce COGS (inventory comes back)
                        const returnAmount = quantity * retailPrice;
                        const returnCost = quantity * costPrice;

                        totalReturns += returnAmount;
                        totalRevenue -= returnAmount;
                        totalCostOfGoodsSold -= returnCost; // Reduce COGS since items returned

                        monthlyData[month].revenue -= returnAmount;
                        monthlyData[month].cogs -= returnCost;
                        monthlyData[month].profit -= (returnAmount - returnCost);
                    }
                    // Note: Purchases/restock don't affect P&L directly - they affect inventory/balance sheet
                });
            }
        });

        // Calculate derived metrics
        const grossProfit = totalRevenue - totalCostOfGoodsSold;
        const netProfit = grossProfit - totalExpenses;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        // Format monthly data for chart - adjust based on date range
        let revenueVsExpensesFormatted;

        if (dateRange === 'today') {
            // For today, show hourly data or just today as one data point
            revenueVsExpensesFormatted = [{
                month: 'Today',
                revenue: totalRevenue,
                cogs: totalCostOfGoodsSold,
                profit: grossProfit
            }];
        } else if (dateRange === 'this-week') {
            // For this week, show daily data
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            revenueVsExpensesFormatted = days.map(day => ({
                month: day,
                revenue: 0,
                cogs: 0,
                profit: 0
            }));

            // Populate with actual data
            Object.entries(monthlyData).forEach(([month, data]) => {
                const dayIndex = days.findIndex(d => d === month.substring(0, 3));
                if (dayIndex !== -1) {
                    revenueVsExpensesFormatted[dayIndex] = {
                        month: month,
                        revenue: data.revenue,
                        cogs: data.cogs,
                        profit: data.profit
                    };
                }
            });
        } else {
            // For month, quarter, year - show monthly data
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            if (dateRange === 'this-month') {
                // For this month, show only current month's data
                const currentMonth = new Date().toLocaleString('default', { month: 'short' });
                revenueVsExpensesFormatted = [{
                    month: currentMonth,
                    revenue: monthlyData[currentMonth]?.revenue || 0,
                    cogs: monthlyData[currentMonth]?.cogs || 0,
                    profit: monthlyData[currentMonth]?.profit || 0
                }];
            } else if (dateRange === 'this-quarter') {
                // For quarter, show only months in current quarter
                const currentMonth = new Date().getMonth();
                const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
                const quarterMonths = months.slice(quarterStartMonth, quarterStartMonth + 3);

                revenueVsExpensesFormatted = quarterMonths.map(month => ({
                    month,
                    revenue: monthlyData[month]?.revenue || 0,
                    cogs: monthlyData[month]?.cogs || 0,
                    profit: monthlyData[month]?.profit || 0
                }));
            } else {
                // For year, show all months with data or zeros
                revenueVsExpensesFormatted = months.map(month => ({
                    month,
                    revenue: monthlyData[month]?.revenue || 0,
                    cogs: monthlyData[month]?.cogs || 0,
                    profit: monthlyData[month]?.profit || 0
                }));
            }
        }

        // Filter out months with no data for cleaner display
        revenueVsExpensesFormatted = revenueVsExpensesFormatted.filter(m => m.revenue > 0 || m.cogs > 0 || m.profit !== 0);

        // If no data, show at least one data point
        if (revenueVsExpensesFormatted.length === 0) {
            revenueVsExpensesFormatted = [{
                month: dateRange === 'today' ? 'Today' :
                    dateRange === 'this-week' ? 'This Week' :
                        dateRange === 'this-month' ? 'This Month' :
                            dateRange === 'this-quarter' ? 'This Quarter' : 'This Year',
                revenue: 0,
                cogs: 0,
                profit: 0
            }];
        }

        // Build income statement with proper sections
        const incomeStatementFormatted = [
            // REVENUE SECTION
            { label: 'Sales Revenue', amount: totalRevenue + totalReturns, section: 'revenue' },
            { label: 'Less: Returns', amount: -totalReturns, section: 'revenue', indent: true },
            { label: 'Total Revenue', amount: totalRevenue, section: 'revenue', isTotal: true },

            // COGS SECTION
            { label: 'Cost of Goods Sold', amount: totalCostOfGoodsSold, section: 'cogs', isTotal: true },

            // GROSS PROFIT
            { label: 'GROSS PROFIT', amount: grossProfit, section: 'grossProfit', isTotal: true },

            // EXPENSES SECTION (if you have any non-COGS expenses)
            ...(totalExpenses > 0 ? [
                { label: 'Operating Expenses', amount: totalExpenses, section: 'expenses' },
                { label: 'Total Expenses', amount: totalExpenses, section: 'expenses', isTotal: true }
            ] : []),

            // NET PROFIT
            { label: 'NET PROFIT', amount: netProfit, section: 'netProfit', isTotal: true },
        ];

        return {
            kpis: {
                revenue: `${settings?.currencySymbol || '$'}${totalRevenue.toLocaleString()}`,
                expenses: `${settings?.currencySymbol || '$'}${totalExpenses.toLocaleString()}`,
                grossProfit: `${settings?.currencySymbol || '$'}    ${grossProfit.toLocaleString()}`,
                profitMargin: profitMargin.toFixed(1),
                netProfit: `${settings?.currencySymbol || '$'}${netProfit.toLocaleString()}`,
                costOfGoods: `${settings?.currencySymbol || '$'}${totalCostOfGoodsSold.toLocaleString()}`,
                returns: `${settings?.currencySymbol || '$'}${totalReturns.toLocaleString()}`
            },
            revenueVsExpensesData: revenueVsExpensesFormatted,
            incomeStatementData: incomeStatementFormatted
        };
    }, [stockData, dateRange]);

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KPICard
                    title="Revenue"
                    value={kpis.revenue}
                    icon={<DollarSign className="h-5 w-5" />}
                    change={14.2}
                    variant="success"
                />
                <KPICard
                    title="COGS"
                    value={kpis.costOfGoods}
                    icon={<Package className="h-5 w-5" />}
                    change={6.1}
                    variant="default"
                />
                <KPICard
                    title="Gross Profit"
                    value={kpis.grossProfit}
                    icon={<TrendingUp className="h-5 w-5" />}
                    change={18.5}
                />
                <KPICard
                    title="Profit Margin"
                    value={`${kpis.profitMargin}%`}
                    prefix=""
                    icon={<Percent className="h-5 w-5" />}
                    change={2.3}
                />
            </div>

            {/* Additional KPI Row */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <KPICard
                    title="Net Profit"
                    value={kpis.netProfit}
                    icon={<TrendingUp className="h-5 w-5" />}
                />
                <KPICard
                    title="Returns"
                    value={kpis.returns}
                    icon={<RotateCcw className="h-5 w-5" />}
                    variant="warning"
                />
                <KPICard
                    title="Expenses"
                    value={kpis.expenses}
                    icon={<TrendingDown className="h-5 w-5" />}
                />
            </div>

            {/* Revenue vs COGS Chart */}
            <ChartCard title={`Revenue vs Cost of Items Sold (${dateRange.replace('-', ' ')})`}>
                <SalesLineChart
                    data={revenueVsExpensesData}
                    xKey="month"
                    lines={[
                        { key: "revenue", color: "hsl(16, 85%, 55%)", name: "Revenue" },
                        { key: "cogs", color: "hsl(220, 20%, 25%)", name: "COGS" },
                        { key: "profit", color: "hsl(142, 76%, 36%)", name: "Gross Profit", dashed: true }
                    ]}
                />
            </ChartCard>

            {incomeStatementData.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No financial data available for this period
                </div>
            )}
        </div>
    );
};

export default FinancialPage;