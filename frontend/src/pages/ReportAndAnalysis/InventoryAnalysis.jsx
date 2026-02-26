import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InventoryPage from "@/components/reports/InventoryPage";

const InventoryAnalysis = () => {
    const [dateRange, setDateRange] = useState("this-month");

    return (
        <div className="">
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-muted-foreground gap-1 px-4 py-2">
                <span>Home</span><span>›</span>
                <span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Inventory Reports</span>
            </div>

            {/* Header */}
            <header className="px-4 py-2">
                <div className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Inventory Reports</h1>
                        <p className="text-sm text-muted-foreground">Stock, Products & Analytics Overview</p>
                    </div>

                    <div className="flex items-center gap-3">
                 
                        {/* <Select value={dateRange} onValueChange={setDateRange}>
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
                        </Select> */}

                    
                        <Button className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto px-4 py-4">
                <InventoryPage dateRange={dateRange} />
            </main>
        </div>
    );
};

export default InventoryAnalysis;