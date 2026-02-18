import { useEffect, useState } from "react";
import {
    TrendingUp,
    ShoppingCart,
    Receipt,
    Package,
    FileText,
    Warehouse,
    Loader2,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {usePromotions} from '@/hooks/pos_hooks/useDiscountPromotion';
import {
    useTransactions,
} from "@/hooks/pos_hooks/useTransaction";


import {
    fetchDashboardStats,
    fetchHourlySales,
    fetchPaymentBreakdown,
    fetchTopProducts,
    fetchLowStockAlerts,
    fetchActivePromotions,
   
} from "@/data/dashboardData";


export default function Dashboard() {
    const [stats, setStats] = useState (null);
    const [hourly, setHourly] = useState([]);
    const [payments, setPayments] = useState ([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStock, setLowStock] = useState ([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchDashboardStats(),
            fetchHourlySales(),
            fetchPaymentBreakdown(),
            fetchTopProducts(),
            fetchLowStockAlerts(),
            fetchActivePromotions(),
        ]).then(([s, h, p, tp, ls, ap]) => {
            setStats(s);
            setHourly(h);
            setPayments(p);
            setTopProducts(tp);
            setLowStock(ls);
            setPromotions(ap);
            setLoading(false);
        });
    }, []);

    if (loading || !stats) {
        return (
          
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
          
        );
    }

    const statCards = [
        {
            label: "Sales Today",
            value: `$${stats.salesToday.toLocaleString()}`,
            change: stats.salesChange,
            icon: TrendingUp,
            highlight: true,
        },
        {
            label: "Transactions Today",
            value: stats.transactionsToday.toLocaleString(),
            change: stats.transactionsChange,
            icon: ShoppingCart,
        },
        {
            label: "Avg. Transaction Value",
            value: `$${stats.avgTransactionValue.toFixed(2)}`,
            change: stats.avgTransactionChange,
            icon: Receipt,
        },
        {
            label: "Items Sold",
            value: stats.itemsSold.toLocaleString(),
            change: stats.itemsSoldChange,
            icon: Package,
        },
    ];

    const fmt = (v) => `$${v.toLocaleString()}`;

    return (
        
            <div className="space-y-5">
                {/* Header row */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Real-time store performance snapshot</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <FileText className="h-3.5 w-3.5" /> View Reports
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <Warehouse className="h-3.5 w-3.5" /> Manage Inventory
                        </Button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        const isPositive = card.change >= 0;
                        return (
                            <div
                                key={card.label}
                                className={`rounded-xl p-5 border ${card.highlight
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-card border-border"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.highlight ? "bg-primary/10" : "bg-secondary"}`}>
                                        <Icon className={`h-4 w-4 ${card.highlight ? "text-primary" : "text-muted-foreground"}`} />
                                    </div>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-card-foreground">{card.value}</p>
                                <p className={`mt-1 text-xs font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
                                    {isPositive ? "+" : ""}{card.change}%
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Sales by Hour */}
                    <div className="lg:col-span-2 rounded-xl bg-card border border-border p-5">
                        <div className="flex items-center justify-between mb-1">
                            <div>
                                <h3 className="text-sm font-semibold text-card-foreground">Sales by Hour</h3>
                                <p className="text-xs text-muted-foreground">Today</p>
                            </div>
                            <select className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                                <option>Sales by Hour</option>
                                <option>Sales by Day</option>
                            </select>
                        </div>
                        <div className="h-64 mt-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={hourly}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 90%)" vertical={false} />
                                    <XAxis
                                        dataKey="hour"
                                        tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tickFormatter={fmt}
                                        tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={60}
                                    />
                                    <Tooltip
                                        formatter={(value) => [fmt(value), "Sales"]}
                                        contentStyle={{
                                            borderRadius: 8,
                                            border: "1px solid hsl(220, 14%, 90%)",
                                            fontSize: 12,
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="hsl(14, 90%, 55%)"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: "hsl(14, 90%, 55%)", strokeWidth: 0 }}
                                        activeDot={{ r: 6, fill: "hsl(14, 90%, 55%)" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="rounded-xl bg-card border border-border p-5">
                        <h3 className="text-sm font-semibold text-card-foreground mb-2">Sales by Payment Method</h3>
                        <div className="h-64 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={payments}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        dataKey="value"
                                        nameKey="method"
                                    >
                                        {payments.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(value) => (
                                            <span style={{ fontSize: 11, color: "hsl(220, 10%, 50%)" }}>{value}</span>
                                        )}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value}%`, ""]}
                                        contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Top Selling Products */}
                    <div className="rounded-xl bg-card border border-border p-5">
                        <h3 className="text-sm font-semibold text-card-foreground mb-3">Top Selling Products</h3>
                        <div className="space-y-3">
                            {topProducts.map((p) => (
                                <div key={p.name} className="flex items-center justify-between">
                                    <span className="text-sm text-card-foreground">{p.name}</span>
                                    <span className="text-sm font-semibold text-card-foreground">${p.sales.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="rounded-xl bg-card border border-border p-5">
                        <h3 className="text-sm font-semibold text-card-foreground mb-3">Low Stock Alerts</h3>
                        <div className="space-y-3">
                            {lowStock.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <span className="text-sm text-card-foreground">{item.name}</span>
                                    <Badge
                                        variant="secondary"
                                        className={`text-[11px] border-0 ${item.level === "critical"
                                                ? "bg-destructive/10 text-destructive"
                                                : "bg-warning/10 text-warning"
                                            }`}
                                    >
                                        {item.level === "critical" ? "Critical" : "Low"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Promotions */}
                    <div className="rounded-xl bg-card border border-border p-5">
                        <h3 className="text-sm font-semibold text-card-foreground mb-3">Active Promotions</h3>
                        <div className="space-y-3">
                            {promotions.map((promo) => (
                                <div key={promo.name} className="flex items-center justify-between">
                                    <span className="text-sm text-card-foreground">{promo.name}</span>
                                    <span className="text-sm font-semibold text-card-foreground">${promo.revenue.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
     
    );
}
