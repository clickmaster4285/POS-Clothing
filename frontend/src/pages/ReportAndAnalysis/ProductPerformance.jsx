import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStockByBranch, useStock } from "@/hooks/inv_hooks/useStock";
import ProductPerformancePage from "@/components/reports/ProductPerformancePage";
import { useAuth } from "@/hooks/useAuth";

const ProductPerformance = () => {
    const { user: currentUser } = useAuth();
    const branchId = currentUser?.branchId || null;

    const [dateRange, setDateRange] = useState("this-month");

    // Compute start and end dates based on dateRange
    const { startDate, endDate } = useMemo(() => {
        const now = new Date();
        let start, end;

        switch (dateRange) {
            case "today":
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
                break;
            case "this-week":
                const firstDay = now.getDate() - now.getDay();
                start = new Date(now.setDate(firstDay));
                start.setHours(0, 0, 0, 0);
                end = new Date();
                break;
            case "this-month":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                break;
            case "this-quarter":
                const quarter = Math.floor(now.getMonth() / 3);
                start = new Date(now.getFullYear(), quarter * 3, 1);
                end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
                break;
            case "this-year":
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                break;
            default:
                start = new Date(0);
                end = new Date();
        }
        return { startDate: start, endDate: end };
    }, [dateRange]);

    // Fetch stock data
    const { data: branchStockData, isLoading: branchLoading } = useStockByBranch(branchId);
    const { data: allStockData, isLoading: allStockLoading } = useStock();

    const stockRawData = branchId ? branchStockData : allStockData;
    const loading = branchId ? branchLoading : allStockLoading;


    const stockData = stockRawData.data

    
   

    return (
        <div className="">
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-muted-foreground gap-1 px-4 py-2">
                <span>Home</span><span>›</span>
                <span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Product Performance</span>
            </div>

            {/* Header */}
            <header className="px-4 py-2">
                <div className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Product Performance</h1>
                        <p className="text-sm text-muted-foreground">Sales, Returns, Exchanges & Inventory Analytics</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Date Range Selector */}
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[160px]">
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="this-week">This Week</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="this-quarter">This Quarter</SelectItem>
                                <SelectItem value="this-year">This Year</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Export Button */}
                        <Button className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto px-4 py-4">
                <ProductPerformancePage stockData={stockData} loading={loading} />
            </main>
        </div>
    );
};

export default ProductPerformance;