import { useMemo } from "react";
import { Package, AlertTriangle, XCircle, AlertOctagon } from "lucide-react";
import { KPICard } from "./KPICard";
import { ReportTable, StatusBadge } from "./ReportTable";
import { useStockByBranch, useStock } from "@/hooks/inv_hooks/useStock";
import { useAuth } from "@/hooks/useAuth";

const InventoryPage = () => {
    const { user: currentUser } = useAuth();
    const branchId = currentUser?.branchId || null;

    // Fetch stock data
    const { data: branchStockData, isLoading: branchLoading } = useStockByBranch(branchId);
    const { data: allStockData, isLoading: allStockLoading } = useStock();

    const stockRawData = branchId ? branchStockData : allStockData;
    const loading = branchId ? branchLoading : allStockLoading;

    const stockData = stockRawData?.data || [];


    console.log("Stock Data:", stockData);
    // Process stock data
    const { lowStock, normalStock, inventoryKPIs } = useMemo(() => {
        let totalItems = 0,
            lowStockItems = 0,
            outOfStock = 0,
            criticalAlerts = 0;

        const lowStockList = [];
        const normalStockList = [];

        stockData.forEach(item => {
            const currentStock = item.currentStock || 0;
            totalItems += 1;

            if (currentStock === 0) outOfStock += 1;
            else if (currentStock < 5) {
                lowStockItems += 1;
                lowStockList.push(item);
            } else {
                normalStockList.push(item);
            }

            if (currentStock === 0 || currentStock < 3) criticalAlerts += 1; // mark very low stock as critical
        });

        return {
            lowStock: lowStockList,
            normalStock: normalStockList,
            inventoryKPIs: { totalItems, lowStockItems, outOfStock, criticalAlerts },
        };
    }, [stockData]);

    if (loading) return <p className="p-4">Loading...</p>;

    console.log("normalStock", normalStock)

    // Table columns - Fixed accessors
    const columns = [
        {
            header: "Product",
            accessor: (row) => row.product?.productName || "N/A"
        },
        {
            header: "SKU",
            accessor: (row) => row.product?.sku || "N/A"
        },
        {
            header: "Variant SKUs",
            accessor: (row) => row.product?.variants?.map(v => v.variantSku).join(", ") || "N/A"
        },
        {
            header: "Color",
            accessor: "color"
        },
        {
            header: "Location",
            accessor: "location"
        },
        {
            header: "Current Stock",
            accessor: "currentStock",
            align: "right"
        },
        {
            header: "Status",
            accessor: (row) => {
                if (row.currentStock === 0) return <StatusBadge status="out-of-stock" />;
                if (row.currentStock < 5) return <StatusBadge status="low-stock" />;
                return <StatusBadge status="in-stock" />;
            }
        },
    ];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KPICard title="Total Items" value={inventoryKPIs.totalItems} icon={<Package className="h-5 w-5" />} />
                <KPICard title="Low Stock Items" value={inventoryKPIs.lowStockItems} icon={<AlertTriangle className="h-5 w-5" />} variant="warning" />
                <KPICard title="Out of Stock" value={inventoryKPIs.outOfStock} icon={<XCircle className="h-5 w-5" />} variant="destructive" />
                <KPICard title="Critical Alerts" value={inventoryKPIs.criticalAlerts} icon={<AlertOctagon className="h-5 w-5" />} variant="destructive" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 ">
                {/* Low Stock Table */}
                {lowStock.length > 0 && (
                    <ReportTable
                        title="Low Stock Products (< 5)"
                        data={lowStock}
                        columns={columns}
                    />
                )}

                {/* Normal Stock Table */}
                {normalStock.length > 0 && (
                    <ReportTable
                        title="Inventory Stock"
                        data={normalStock}
                        columns={columns}
                    />
                )}
          </div>
        </div>
    );
};

export default InventoryPage;