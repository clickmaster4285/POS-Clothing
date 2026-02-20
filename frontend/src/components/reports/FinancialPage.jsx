import { useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Percent, Package, RotateCcw } from "lucide-react";
import { KPICard } from "./KPICard";
import { ChartCard, SalesLineChart } from "./ReportCharts";
import { useStockByBranch, useStock } from "@/hooks/inv_hooks/useStock";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Custom Income Statement Component
const IncomeStatement = ({ data }) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Income Statement</CardTitle>
                <p className="text-sm text-muted-foreground">For the period ending {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Revenue Section */}
                    <div>
                        <h3 className="font-bold text-lg border-b pb-1 mb-2">REVENUE</h3>
                        {data.filter(item => item.section === 'revenue' && !item.isTotal).map((item, idx) => (
                            <div key={idx} className="flex justify-between py-1 hover:bg-muted/50 px-2">
                                <span className={item.isBold ? "font-semibold" : item.indent ? "pl-4" : ""}>
                                    {item.label}
                                </span>
                                <span className={item.amount < 0 ? "text-destructive" : ""}>
                                    ${Math.abs(item.amount).toLocaleString()}
                                </span>
                            </div>
                        ))}
                        {/* Revenue Total */}
                        <div className="flex justify-between font-bold border-t pt-2 mt-1 px-2">
                            <span>Total Revenue</span>
                            <span className="text-green-600">
                                ${data.find(item => item.label === 'Total Revenue')?.amount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Cost of Goods Sold Section */}
                    <div>
                        <h3 className="font-bold text-lg border-b pb-1 mb-2 mt-6">COST OF Items SOLD</h3>
                        {data.filter(item => item.section === 'cogs' && !item.isTotal).map((item, idx) => (
                            <div key={idx} className="flex justify-between py-1 hover:bg-muted/50 px-2">
                                <span className={item.isBold ? "font-semibold" : item.indent ? "pl-4" : ""}>
                                    {item.label}
                                </span>
                                <span className={item.amount < 0 ? "text-destructive" : ""}>
                                    ${Math.abs(item.amount).toLocaleString()}
                                </span>
                            </div>
                        ))}
                     
                        <div className="flex justify-between font-bold border-t pt-2 mt-1 px-2">
                            <span>Total Cost of Goods Sold</span>
                            <span className="text-orange-600">
                                ${data.find(item => item.label === 'Total Cost of Goods Sold')?.amount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Gross Profit */}
                    <div className="flex justify-between font-bold text-lg border-y-2 py-3 mt-4 bg-muted/20 px-2">
                        <span>GROSS PROFIT</span>
                        <span className={data.find(item => item.label === 'GROSS PROFIT')?.amount >= 0 ? "text-green-600" : "text-destructive"}>
                            ${data.find(item => item.label === 'GROSS PROFIT')?.amount.toLocaleString()}
                        </span>
                    </div>

                    {/* Expenses Section - Only show if there are expenses */}
                    {data.some(item => item.section === 'expenses' && item.amount > 0) && (
                        <div className="mt-4">
                            <h3 className="font-bold text-lg border-b pb-1 mb-2">EXPENSES</h3>
                            {data.filter(item => item.section === 'expenses' && !item.isTotal).map((item, idx) => (
                                <div key={idx} className="flex justify-between py-1 hover:bg-muted/50 px-2">
                                    <span className={item.isBold ? "font-semibold" : item.indent ? "pl-4" : ""}>
                                        {item.label}
                                    </span>
                                    <span className={item.amount < 0 ? "text-destructive" : ""}>
                                        ${Math.abs(item.amount).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            {/* Expenses Total */}
                            <div className="flex justify-between font-bold border-t pt-2 mt-1 px-2">
                                <span>Total Expenses</span>
                                <span className="text-destructive">
                                    ${data.find(item => item.label === 'Total Expenses')?.amount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Net Profit */}
                    <div className="flex justify-between font-bold text-xl border-t-2 pt-4 mt-4 px-2">
                        <span>NET PROFIT</span>
                        <span className={data.find(item => item.label === 'NET PROFIT')?.amount >= 0 ? "text-green-600" : "text-destructive"}>
                            ${data.find(item => item.label === 'NET PROFIT')?.amount.toLocaleString()}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const FinancialPage = () => {
    const { user: currentUser } = useAuth();
    const branchId = currentUser?.branchId || null;

    // Fetch stock data
    const { data: branchStockData, isLoading: branchLoading } = useStockByBranch(branchId);
    const { data: allStockData, isLoading: allStockLoading } = useStock();

    const stockRawData = branchId ? branchStockData : allStockData;
    const loading = branchId ? branchLoading : allStockLoading;

    const stockData = stockRawData?.data || [];

    console.log("Stock Data:", stockData);

    // Process financial data
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
                    const date = new Date(timestamp);
                    const month = date.toLocaleString('default', { month: 'short' });
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

        // Format monthly data for chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueVsExpensesFormatted = months.map(month => ({
            month,
            revenue: monthlyData[month]?.revenue || 0,
            cogs: monthlyData[month]?.cogs || 0,
            profit: monthlyData[month]?.profit || 0
        })).filter(m => m.revenue > 0 || m.cogs > 0);

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
                revenue: `$${totalRevenue.toLocaleString()}`,
                expenses: `$${totalExpenses.toLocaleString()}`,
                grossProfit: `$${grossProfit.toLocaleString()}`,
                profitMargin: profitMargin.toFixed(1),
                netProfit: `$${netProfit.toLocaleString()}`,
                costOfGoods: `$${totalCostOfGoodsSold.toLocaleString()}`,
                returns: `$${totalReturns.toLocaleString()}`
            },
            revenueVsExpensesData: revenueVsExpensesFormatted,
            incomeStatementData: incomeStatementFormatted
        };
    }, [stockData]);

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
            <ChartCard title="Revenue vs Cost of Goods Sold (Monthly)">
                <SalesLineChart
                    data={revenueVsExpensesData.length > 0 ? revenueVsExpensesData : [{ month: 'Jan', revenue: 0, cogs: 0, profit: 0 }]}
                    xKey="month"
                    lines={[
                        { key: "revenue", color: "hsl(16, 85%, 55%)", name: "Revenue" },
                        { key: "cogs", color: "hsl(220, 20%, 25%)", name: "COGS" },
                        { key: "profit", color: "hsl(142, 76%, 36%)", name: "Gross Profit", dashed: true }
                    ]}
                />
            </ChartCard>

            {/* Custom Income Statement */}
            <IncomeStatement data={incomeStatementData} />

            {incomeStatementData.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No financial data available
                </div>
            )}
        </div>
    );
};

export default FinancialPage;