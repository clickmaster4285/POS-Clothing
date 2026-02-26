import { useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Percent, Package, RotateCcw } from "lucide-react";
import { KPICard } from "./KPICard";
import { ChartCard, SalesLineChart, ReportBarChart } from "./ReportCharts";
import { useStockByBranch, useStock } from "@/hooks/inv_hooks/useStock";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/pos_hooks/useTransaction";
import { useSettings } from "@/hooks/useSettings";

const FinancialPage = ({ dateRange = 'this-month' }) => {
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

    // Fetch stock data
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

    // Fetch transactions for expenses (if you have any expense tracking)
    const { data: transactionData } = useTransactions({
        startDate: getDateFilter.start.toISOString(),
        endDate: getDateFilter.end.toISOString(),
        branchId: branchId
    });

    const transactions = transactionData?.transactions || [];
    const stockRawData = branchId ? branchStockData : allStockData;
    const loading = branchId ? branchLoading : allStockLoading;

    const stockData = stockRawData?.data || [];

    // Process financial data with date filtering
    const { kpis, revenueVsExpensesData, incomeStatementData } = useMemo(() => {
        let totalRevenue = 0;
        let totalCostOfGoodsSold = 0;
        let totalExpenses = 0; // For non-COGS expenses (if any)
        let totalReturns = 0;
        let returnsQuantity = 0;
        let lastPeriodRevenue = 0;
        let lastPeriodCOGS = 0;

        // Track monthly data for charts
        const monthlyData = {};
        const lastPeriodMonthlyData = {};

        // Get last period dates for comparison
        const lastPeriodStart = new Date(getDateFilter.start);
        const lastPeriodEnd = new Date(getDateFilter.end);
        const periodLength = lastPeriodEnd - lastPeriodStart;
        lastPeriodStart.setTime(lastPeriodStart.getTime() - periodLength);
        lastPeriodEnd.setTime(lastPeriodEnd.getTime() - periodLength);

        stockData.forEach(item => {
            // Get product cost and price from the variant
            const variant = item.product?.variants?.[0];
            const costPrice = variant?.price?.costPrice || 0;
            const retailPrice = variant?.price?.retailPrice || 0;

            if (item.history && Array.isArray(item.history)) {
                item.history.forEach(transaction => {
                    const timestamp = transaction.timestamp;
                    const transactionDate = new Date(timestamp);

                    // Check if transaction is in current period
                    const isInCurrentPeriod = transactionDate >= getDateFilter.start && transactionDate <= getDateFilter.end;
                    const isInLastPeriod = transactionDate >= lastPeriodStart && transactionDate <= lastPeriodEnd;

                    const quantity = Math.abs(transaction.quantity || 0);
                    const month = transactionDate.toLocaleString('default', { month: 'short' });
                    const fullMonthYear = transactionDate.toLocaleString('default', { month: 'short', year: 'numeric' });

                    if (transaction.action === 'sale') {
                        const revenue = quantity * retailPrice;
                        const cogs = quantity * costPrice;

                        if (isInCurrentPeriod) {
                            totalRevenue += revenue;
                            totalCostOfGoodsSold += cogs;

                            // Initialize monthly data
                            if (!monthlyData[fullMonthYear]) {
                                monthlyData[fullMonthYear] = {
                                    month: fullMonthYear,
                                    shortMonth: month,
                                    revenue: 0,
                                    cogs: 0,
                                    profit: 0,
                                    returns: 0
                                };
                            }
                            monthlyData[fullMonthYear].revenue += revenue;
                            monthlyData[fullMonthYear].cogs += cogs;
                        }

                        if (isInLastPeriod) {
                            lastPeriodRevenue += revenue;
                            lastPeriodCOGS += cogs;

                            if (!lastPeriodMonthlyData[fullMonthYear]) {
                                lastPeriodMonthlyData[fullMonthYear] = { revenue: 0, cogs: 0 };
                            }
                            lastPeriodMonthlyData[fullMonthYear].revenue += revenue;
                            lastPeriodMonthlyData[fullMonthYear].cogs += cogs;
                        }
                    }
                    else if (transaction.action === 'return') {
                        const returnAmount = quantity * retailPrice;
                        const returnCost = quantity * costPrice;

                        if (isInCurrentPeriod) {
                            totalReturns += returnAmount;
                            returnsQuantity += quantity;

                            // Returns reduce revenue and COGS
                            totalRevenue -= returnAmount;
                            totalCostOfGoodsSold -= returnCost;

                            if (!monthlyData[fullMonthYear]) {
                                monthlyData[fullMonthYear] = {
                                    month: fullMonthYear,
                                    shortMonth: month,
                                    revenue: 0,
                                    cogs: 0,
                                    profit: 0,
                                    returns: 0
                                };
                            }
                            monthlyData[fullMonthYear].revenue -= returnAmount;
                            monthlyData[fullMonthYear].cogs -= returnCost;
                            monthlyData[fullMonthYear].returns = (monthlyData[fullMonthYear].returns || 0) + returnAmount;
                        }

                        if (isInLastPeriod) {
                            lastPeriodRevenue -= returnAmount;
                            lastPeriodCOGS -= returnCost;
                        }
                    }
                });
            }
        });

        // Calculate expenses from transactions (if you have expense transactions)
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                totalExpenses += transaction.amount || 0;
            }
        });

        // Calculate derived metrics
        const grossProfit = totalRevenue - totalCostOfGoodsSold;
        const netProfit = grossProfit - totalExpenses;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        // Calculate percentage changes
        const revenueChange = lastPeriodRevenue > 0
            ? ((totalRevenue - lastPeriodRevenue) / lastPeriodRevenue) * 100
            : 0;

        const cogsChange = lastPeriodCOGS > 0
            ? ((totalCostOfGoodsSold - lastPeriodCOGS) / lastPeriodCOGS) * 100
            : 0;

        const grossProfitChange = (lastPeriodRevenue - lastPeriodCOGS) > 0
            ? ((grossProfit - (lastPeriodRevenue - lastPeriodCOGS)) / (lastPeriodRevenue - lastPeriodCOGS)) * 100
            : 0;

        const marginChange = (lastPeriodRevenue > 0 && (lastPeriodRevenue - lastPeriodCOGS) > 0)
            ? profitMargin - (((lastPeriodRevenue - lastPeriodCOGS) / lastPeriodRevenue) * 100)
            : 0;

        // Format monthly data for chart
        let revenueVsExpensesFormatted = [];

        if (dateRange === 'today') {
            // For today, show hourly data
            const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
            revenueVsExpensesFormatted = hours.map(hour => ({
                month: hour,
                revenue: 0,
                cogs: 0,
                profit: 0,
                returns: 0
            }));

            // Populate with actual hourly data from stock history
            stockData.forEach(item => {
                const variant = item.product?.variants?.[0];
                const retailPrice = variant?.price?.retailPrice || 0;
                const costPrice = variant?.price?.costPrice || 0;

                if (item.history) {
                    item.history.forEach(transaction => {
                        const transactionDate = new Date(transaction.timestamp);
                        if (transactionDate >= getDateFilter.start && transactionDate <= getDateFilter.end) {
                            const hour = transactionDate.getHours();
                            const quantity = Math.abs(transaction.quantity || 0);

                            if (transaction.action === 'sale') {
                                revenueVsExpensesFormatted[hour].revenue += quantity * retailPrice;
                                revenueVsExpensesFormatted[hour].cogs += quantity * costPrice;
                                revenueVsExpensesFormatted[hour].profit += quantity * (retailPrice - costPrice);
                            } else if (transaction.action === 'return') {
                                revenueVsExpensesFormatted[hour].returns += quantity * retailPrice;
                                revenueVsExpensesFormatted[hour].revenue -= quantity * retailPrice;
                                revenueVsExpensesFormatted[hour].cogs -= quantity * costPrice;
                                revenueVsExpensesFormatted[hour].profit -= quantity * (retailPrice - costPrice);
                            }
                        }
                    });
                }
            });
        } else if (dateRange === 'this-week') {
            // For this week, show daily data
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());

            revenueVsExpensesFormatted = days.map((day, index) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + index);
                const dateStr = date.toISOString().split('T')[0];

                return {
                    month: day,
                    fullDate: dateStr,
                    revenue: 0,
                    cogs: 0,
                    profit: 0,
                    returns: 0
                };
            });

            // Populate with actual daily data
            Object.entries(monthlyData).forEach(([key, data]) => {
                const date = new Date(key);
                const dayIndex = date.getDay();
                if (dayIndex >= 0 && dayIndex < 7) {
                    revenueVsExpensesFormatted[dayIndex].revenue += data.revenue || 0;
                    revenueVsExpensesFormatted[dayIndex].cogs += data.cogs || 0;
                    revenueVsExpensesFormatted[dayIndex].profit += (data.revenue - data.cogs) || 0;
                    revenueVsExpensesFormatted[dayIndex].returns += data.returns || 0;
                }
            });
        } else {
            // For month, quarter, year - sort monthly data chronologically
            revenueVsExpensesFormatted = Object.values(monthlyData)
                .sort((a, b) => new Date(a.month) - new Date(b.month))
                .map(data => ({
                    month: data.shortMonth,
                    fullMonth: data.month,
                    revenue: data.revenue,
                    cogs: data.cogs,
                    profit: data.revenue - data.cogs,
                    returns: data.returns || 0
                }));
        }

        // If no data, show placeholder
        if (revenueVsExpensesFormatted.length === 0) {
            revenueVsExpensesFormatted = [{
                month: dateRange === 'today' ? 'Today' :
                    dateRange === 'this-week' ? 'This Week' :
                        dateRange === 'this-month' ? 'This Month' :
                            dateRange === 'this-quarter' ? 'This Quarter' : 'This Year',
                revenue: 0,
                cogs: 0,
                profit: 0,
                returns: 0
            }];
        }

        // Build income statement with proper sections
        const incomeStatementFormatted = [
            // REVENUE SECTION
            {
                label: 'Sales Revenue',
                amount: totalRevenue + totalReturns,
                section: 'revenue',
                formatted: `${settings?.currencySymbol || '$'}${(totalRevenue + totalReturns).toLocaleString()}`
            },
            {
                label: 'Less: Returns & Allowances',
                amount: -totalReturns,
                section: 'revenue',
                indent: true,
                formatted: `-${settings?.currencySymbol || '$'}${totalReturns.toLocaleString()}`
            },
            {
                label: 'Net Revenue',
                amount: totalRevenue,
                section: 'revenue',
                isTotal: true,
                formatted: `${settings?.currencySymbol || '$'}${totalRevenue.toLocaleString()}`
            },

            // COGS SECTION
            {
                label: 'Cost of Goods Sold',
                amount: totalCostOfGoodsSold,
                section: 'cogs',
                isTotal: true,
                formatted: `${settings?.currencySymbol || '$'}${totalCostOfGoodsSold.toLocaleString()}`
            },

            // GROSS PROFIT
            {
                label: 'Gross Profit',
                amount: grossProfit,
                section: 'grossProfit',
                isTotal: true,
                formatted: `${settings?.currencySymbol || '$'}${grossProfit.toLocaleString()}`,
                change: grossProfitChange
            },

            // EXPENSES SECTION (if any)
            ...(totalExpenses > 0 ? [
                {
                    label: 'Operating Expenses',
                    amount: totalExpenses,
                    section: 'expenses',
                    formatted: `${settings?.currencySymbol || '$'}${totalExpenses.toLocaleString()}`
                },
                {
                    label: 'Total Expenses',
                    amount: totalExpenses,
                    section: 'expenses',
                    isTotal: true,
                    formatted: `${settings?.currencySymbol || '$'}${totalExpenses.toLocaleString()}`
                }
            ] : []),

            // NET PROFIT
            {
                label: 'Net Profit',
                amount: netProfit,
                section: 'netProfit',
                isTotal: true,
                formatted: `${settings?.currencySymbol || '$'}${netProfit.toLocaleString()}`,
                change: grossProfitChange // Use same change as gross profit if no expenses
            },
        ];

        return {
            kpis: {
                revenue: {
                    value: `${settings?.currencySymbol || '$'}${totalRevenue.toLocaleString()}`,
                    change: revenueChange
                },
                cogs: {
                    value: `${settings?.currencySymbol || '$'}${totalCostOfGoodsSold.toLocaleString()}`,
                    change: cogsChange
                },
                grossProfit: {
                    value: `${settings?.currencySymbol || '$'}${grossProfit.toLocaleString()}`,
                    change: grossProfitChange
                },
                profitMargin: {
                    value: profitMargin.toFixed(1),
                    change: marginChange
                },
                netProfit: {
                    value: `${settings?.currencySymbol || '$'}${netProfit.toLocaleString()}`,
                    change: grossProfitChange
                },
                returns: {
                    value: `${settings?.currencySymbol || '$'}${totalReturns.toLocaleString()}`,
                    count: returnsQuantity
                }
            },
            revenueVsExpensesData: revenueVsExpensesFormatted,
            incomeStatementData: incomeStatementFormatted
        };
    }, [stockData, transactions, getDateFilter, dateRange, settings]);

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KPICard
                    title="Revenue"
                    value={kpis.revenue.value}
                    icon={<DollarSign className="h-5 w-5" />}
                    change={kpis.revenue.change}
                    variant={kpis.revenue.change >= 0 ? "success" : "danger"}
                />
                <KPICard
                    title="COGS"
                    value={kpis.cogs.value}
                    icon={<Package className="h-5 w-5" />}
                    change={kpis.cogs.change}
                    variant={kpis.cogs.change <= 0 ? "success" : "danger"} // Lower COGS is better
                />
                <KPICard
                    title="Gross Profit"
                    value={kpis.grossProfit.value}
                    icon={<TrendingUp className="h-5 w-5" />}
                    change={kpis.grossProfit.change}
                    variant={kpis.grossProfit.change >= 0 ? "success" : "danger"}
                />
                <KPICard
                    title="Profit Margin"
                    value={`${kpis.profitMargin.value}%`}
                    prefix=""
                    icon={<Percent className="h-5 w-5" />}
                    change={kpis.profitMargin.change}
                    variant={kpis.profitMargin.change >= 0 ? "success" : "danger"}
                />
                <KPICard
                    title="Net Profit"
                    value={kpis.netProfit.value}
                    icon={<DollarSign className="h-5 w-5" />}
                    change={kpis.netProfit.change}
                    variant={kpis.netProfit.change >= 0 ? "success" : "danger"}
                />
                <KPICard
                    title="Returns"
                    value={kpis.returns.value}
                    icon={<RotateCcw className="h-5 w-5" />}
                    subtitle={`${kpis.returns.count} items`}
                    variant="warning"
                />
            </div>

            {/* Revenue vs COGS Chart - Now using Bar Chart for better comparison */}
            <ChartCard title={`Revenue vs Cost of Goods Sold (${dateRange.replace('-', ' ')})`}>
                <ReportBarChart
                    data={revenueVsExpensesData}
                    xKey="month"
                    bars={[
                        { key: "revenue", name: "Revenue", color: "hsl(16, 85%, 55%)" },
                        { key: "cogs", name: "COGS", color: "hsl(220, 20%, 35%)" }
                    ]}
                />
            </ChartCard>

            {/* Gross Profit Trend */}
            <ChartCard title={`Gross Profit Trend (${dateRange.replace('-', ' ')})`}>
                <SalesLineChart
                    data={revenueVsExpensesData}
                    xKey="month"
                    lines={[
                        { key: "profit", color: "hsl(142, 76%, 36%)", name: "Gross Profit" },
                        { key: "returns", color: "hsl(0, 84%, 60%)", name: "Returns", dashed: true }
                    ]}
                />
            </ChartCard>

            {/* Income Statement Table */}
            {/* {incomeStatementData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Income Statement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {incomeStatementData.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex justify-between py-1 ${item.isTotal ? 'font-bold border-t border-b' : ''
                                        } ${item.section === 'grossProfit' || item.section === 'netProfit' ? 'text-lg' : ''}`}
                                >
                                    <span className={item.indent ? 'pl-4' : ''}>
                                        {item.label}
                                    </span>
                                    <span className={item.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {item.formatted || `${settings?.currencySymbol || '$'}${item.amount.toLocaleString()}`}
                                        {item.change && (
                                            <span className="ml-2 text-xs">
                                                ({item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%)
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )} */}

            {revenueVsExpensesData.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No financial data available for this period
                </div>
            )}
        </div>
    );
};

export default FinancialPage;