import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomerPage from "@/components/reports/CustomerPage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCustomers } from "@/hooks/pos_hooks/useCustomer";


const CustomerAnalysis = () => {
    const [dateRange, setDateRange] = useState("this-month");
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { data: customers = [] } = useCustomers();
 

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

    const filteredCustomers = useMemo(() => {
        if (!customers) return [];
        return customers.filter(c => {
            const created = new Date(c.createdAt);
            return created >= startDate && created <= endDate;
        });
    }, [customers, startDate, endDate]);




    console.log("customers", customers);
    return (
        <div className="">
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-muted-foreground gap-1 px-4 py-2">
                <span>Home</span><span>›</span>
                <span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Customer Reports</span>
            </div>

            {/* Header */}
            <header className=" px-4 py-2">
                <div className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Customer Reports</h1>
                        <p className="text-sm text-muted-foreground">Listing, Profile & Loyalty Analytics</p>
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

                        {/* Add Customer Button */}
                        <Button
                            onClick={() => navigate(`/${currentUser?.role}/pos/create`)}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Customer
                        </Button>

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
                <CustomerPage
                    dateRange={dateRange}
                    customers={filteredCustomers} // <-- pass filtered customers
                    startDate={startDate}
                    endDate={endDate}
                />
            </main>
        </div>
    );
};

export default CustomerAnalysis;