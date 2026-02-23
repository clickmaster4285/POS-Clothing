import { TrendingUp, BarChart3, Tag } from "lucide-react";
import { KPICard } from "./KPICard";
import { ChartCard, ReportBarChart, ReportDonutChart } from "./ReportCharts";
import { ReportTable } from "./ReportTable";
import { useSettings } from "@/hooks/useSettings";
const ProductPerformancePage = ({ stockData = [], loading }) => {
    if (loading) return <p>Loading...</p>;
    const { data: settings } = useSettings();
    console.log("Raw Stock Data:", stockData);
    // Preprocess stockData to calculate totalSold, totalReturned, totalExchanged
    const processedData = stockData.map(item => {
        const totals = item.history.reduce(
            (acc, h) => {
                if (h.action === "sale") acc.totalSold += Math.abs(h.quantity);
                else if (h.action === "return") acc.totalReturned += Math.abs(h.quantity);
                else if (h.action === "exchange") acc.totalExchanged += Math.abs(h.quantity);
                return acc;
            },
            { totalSold: 0, totalReturned: 0, totalExchanged: 0 }
        );

        // Collect all variant SKUs for this product
        const allVariantSkus = item.product?.variants?.map(v => v.variantSku) || [];

        return {
            ...item,
            ...totals,
            allVariantSkus: allVariantSkus.join(", "), // join for display in table
            revenue: item.product?.variants?.[0]?.price?.retailPrice
                ? totals.totalSold * item.product.variants[0].price.retailPrice
                : 0
        };
    });


    // Top product by units sold
    const topProduct = processedData.reduce((prev, curr) => {
        return curr.totalSold > (prev?.totalSold || 0) ? curr : prev;
    }, null);

    // Total units sold
    const totalSold = processedData.reduce((acc, p) => acc + p.totalSold, 0);

    // Total revenue
    const totalRevenue = processedData.reduce((acc, p) => acc + (p.revenue || 0), 0);

    const avgRevenuePerProduct = processedData.length
        ? Math.round(totalRevenue / processedData.length)
        : 0;

    // Sales by category (using color)
    const salesByCategory = processedData.reduce((acc, p) => {
        const key = p.color || "Unknown";
        if (!acc[key]) acc[key] = 0;
        acc[key] += p.totalSold;
        return acc;
    }, {});
    const categoryData = Object.entries(salesByCategory).map(([name, value]) => ({ name, value }));

    // Sales by branch/location
    const salesByBranch = processedData.reduce((acc, p) => {
        const key = p.location || "Unknown";
        if (!acc[key]) acc[key] = 0;
        acc[key] += p.totalSold;
        return acc;
    }, {});
    const branchData = Object.entries(salesByBranch).map(([branch, sales]) => ({ branch, sales }));



    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KPICard
                    title="Top Product"
                    value={topProduct?.product?.productName || "N/A"}
                    prefix=""
                    icon={<Tag className="h-5 w-5" />}
                    subtitle={`${topProduct?.totalSold || 0} units sold`}
                />
                <KPICard
                    title="Total Products Sold"
                    value={totalSold}
                    prefix=""
                    icon={<BarChart3 className="h-5 w-5" />}
                />
                <KPICard
                    title="Total Revenue"
                    value={`${settings?.currencySymbol || ""}${totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp className="h-5 w-5" />}
                />
                <KPICard
                    title="Avg. Revenue/Product"
                    value={`${settings?.currencySymbol || ""}${avgRevenuePerProduct}`}
                    icon={<TrendingUp className="h-5 w-5" />}
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard title="Sales by Branch">
                    <ReportBarChart
                        data={branchData}
                        xKey="branch"
                        bars={[{ key: "sales" }]}
                        layout="horizontal"
                        height={250}
                    />
                </ChartCard>

                <ChartCard title="Sales by Category">
                    <ReportDonutChart data={categoryData} />
                </ChartCard>
            </div>

            {/* Product Performance Table */}
            <ReportTable
                title="Product Performance Details"
                data={processedData}
                columns={[
                    { header: "Variant SKU", accessor: "allVariantSkus" },
                    { header: "Color", accessor: "color" },
                    { header: "Location", accessor: "location" },
                    { header: "Units Sold", accessor: "totalSold", align: "right" },
                    { header: "Units Returned", accessor: "totalReturned", align: "right" },
                    { header: "Units Exchanged", accessor: "totalExchanged", align: "right" },
                    { header: "Current Stock", accessor: "currentStock", align: "right" },
                ]}
            />
        </div>
    );
};

export default ProductPerformancePage;