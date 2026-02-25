import { useEffect, useState, useMemo } from "react";
import {
    TrendingUp,
    ShoppingCart,
    Receipt,
    Package,
    FileText,
    Warehouse,
    Loader2,
    Building2,
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
import { useAuth } from "@/hooks/useAuth";
import { usePromotions } from '@/hooks/pos_hooks/useDiscountPromotion';
import { useTransactions } from "@/hooks/pos_hooks/useTransaction";
import { useStockByBranch, useLowStockAlerts } from "@/hooks/inv_hooks/useStock";
import { useBranches } from "@/hooks/useBranches";
import { useSettings } from "@/hooks/useSettings";

// Color constants for payment methods
const PAYMENT_COLORS = {
    cash: "#10b981", // emerald
    card: "#3b82f6", // blue
    qr: "#8b5cf6",   // purple
    other: "#6b7280" // gray
};

export default function Dashboard() {
    const { user } = useAuth(); // Get current user from auth
    const isAdmin = user?.role === 'admin';
    const userBranchId = user?.branchId; // Assuming branchId is attached to user object
    const { data: settings } = useSettings();
    // Fetch branches only for admin
    const { data: branches = [], isLoading: branchesLoading } = useBranches();

    // State for branch selection (admin only)
    const [selectedBranchId, setSelectedBranchId] = useState(null);

    // Determine which branch ID to use
    const effectiveBranchId = useMemo(() => {
        if (isAdmin) {
            return selectedBranchId || (branches.length > 0 ? branches[0]._id : null);
        }
        return userBranchId;
    }, [isAdmin, selectedBranchId, branches, userBranchId]);

    // Fetch data based on user role and selected branch
    const { data: transactionsData, isLoading: transactionsLoading } = useTransactions();
    const { data: promotionsData, isLoading: promotionsLoading } = usePromotions();



    const { data: stockData, isLoading: stockLoading } = useStockByBranch(effectiveBranchId, {
        enabled: !!effectiveBranchId
    });
    const { data: lowStockData, isLoading: lowStockLoading } = useLowStockAlerts(effectiveBranchId, {
        enabled: !!effectiveBranchId
    });

    // Safely extract arrays from data
    const transactions = useMemo(() => {
        // Handle different possible data structures
        if (!transactionsData) return [];
        if (Array.isArray(transactionsData)) return transactionsData;
        if (transactionsData.data && Array.isArray(transactionsData.data)) return transactionsData.data;
        if (transactionsData.transactions && Array.isArray(transactionsData.transactions)) return transactionsData.transactions;
        return [];
    }, [transactionsData]);

    const promotions = useMemo(() => {
        if (!promotionsData) return [];
        if (Array.isArray(promotionsData)) return promotionsData;
        if (promotionsData.data && Array.isArray(promotionsData.data)) return promotionsData.data;
        if (promotionsData.promotions && Array.isArray(promotionsData.promotions)) return promotionsData.promotions;
        return [];
    }, [promotionsData]);

    console.log("promotions", promotions)

    const lowStockAlerts = useMemo(() => {
        if (!lowStockData) return [];
        if (Array.isArray(lowStockData)) return lowStockData;
        if (lowStockData.data && Array.isArray(lowStockData.data)) return lowStockData.data;
        if (lowStockData.alerts && Array.isArray(lowStockData.alerts)) return lowStockData.alerts;
        return [];
    }, [lowStockData]);

    const loading = transactionsLoading || promotionsLoading || stockLoading || lowStockLoading || (isAdmin && branchesLoading);

    // Get current branch name for display
    const currentBranchName = useMemo(() => {
        if (!effectiveBranchId) return 'All Branches';
        const branch = branches.find(b => b._id === effectiveBranchId);
        return branch?.name || 'Selected Branch';
    }, [effectiveBranchId, branches]);

    // Process transactions data for dashboard stats
    const dashboardData = useMemo(() => {
        if (!transactions || transactions.length === 0) return null;

        const today = new Date().toDateString();

        // Filter today's transactions
        const todayTransactions = transactions.filter(t => {
            const timestamp = t.timestamp || t.createdAt || t.date;
            return timestamp ? new Date(timestamp).toDateString() === today : false;
        });

        // Calculate totals
        const salesToday = todayTransactions.reduce((sum, t) => {
            const total = t.totals?.grandTotal || t.grandTotal || t.total || 0;
            return sum + total;
        }, 0);

        const transactionsToday = todayTransactions.length;

        const itemsSold = todayTransactions.reduce((sum, t) => {
            const cartItems = t.cartItems || t.items || [];
            return sum + cartItems.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0);
        }, 0);

        // Average transaction value
        const avgTransactionValue = transactionsToday > 0 ? salesToday / transactionsToday : 0;

        // Calculate changes (compared to yesterday)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        const yesterdayTransactions = transactions.filter(t => {
            const timestamp = t.timestamp || t.createdAt || t.date;
            return timestamp ? new Date(timestamp).toDateString() === yesterdayStr : false;
        });

        const salesYesterday = yesterdayTransactions.reduce((sum, t) => {
            const total = t.totals?.grandTotal || t.grandTotal || t.total || 0;
            return sum + total;
        }, 0);

        const transactionsYesterday = yesterdayTransactions.length;

        const itemsSoldYesterday = yesterdayTransactions.reduce((sum, t) => {
            const cartItems = t.cartItems || t.items || [];
            return sum + cartItems.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0);
        }, 0);

        const avgYesterday = transactionsYesterday > 0 ? salesYesterday / transactionsYesterday : 0;

        // Calculate percentage changes
        const salesChange = salesYesterday ? ((salesToday - salesYesterday) / salesYesterday) * 100 : 0;
        const transactionsChange = transactionsYesterday ? ((transactionsToday - transactionsYesterday) / transactionsYesterday) * 100 : 0;
        const itemsSoldChange = itemsSoldYesterday ? ((itemsSold - itemsSoldYesterday) / itemsSoldYesterday) * 100 : 0;
        const avgTransactionChange = avgYesterday ? ((avgTransactionValue - avgYesterday) / avgYesterday) * 100 : 0;

        return {
            salesToday,
            transactionsToday,
            avgTransactionValue,
            itemsSold,
            salesChange,
            transactionsChange,
            avgTransactionChange,
            itemsSoldChange
        };
    }, [transactions]);

    // Process hourly sales data
    const hourlySales = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return Array.from({ length: 24 }, (_, i) => ({
                hour: i.toString().padStart(2, '0') + ':00',
                sales: 0
            }));
        }

        const today = new Date().toDateString();
        const hours = Array.from({ length: 24 }, (_, i) => ({
            hour: i.toString().padStart(2, '0') + ':00',
            sales: 0
        }));

        transactions
            .filter(t => {
                const timestamp = t.timestamp || t.createdAt || t.date;
                return timestamp ? new Date(timestamp).toDateString() === today : false;
            })
            .forEach(t => {
                const timestamp = t.timestamp || t.createdAt || t.date;
                if (timestamp) {
                    const hour = new Date(timestamp).getHours();
                    const total = t.totals?.grandTotal || t.grandTotal || t.total || 0;
                    hours[hour].sales += total;
                }
            });

        return hours;
    }, [transactions]);


    // Process payment breakdown
    const paymentBreakdown = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        const payments = {
            cash: 0,
            card: 0
        };

        transactions.forEach(t => {
            const method = t.payment?.paymentMethod || t.paymentMethod || '';
            const amount = t.totals?.grandTotal || t.grandTotal || t.total || 0;

            if (method.toLowerCase() === 'cash') {
                payments.cash += amount;
            } else if (method.toLowerCase() === 'card') {
                payments.card += amount;
            }
        });

        const total = payments.cash + payments.card;

        return [
            {
                method: 'Cash',
                value: total > 0 ? (payments.cash / total) * 100 : 0,
                color: PAYMENT_COLORS.cash
            },
            {
                method: 'Card',
                value: total > 0 ? (payments.card / total) * 100 : 0,
                color: PAYMENT_COLORS.card
            }
        ];
    }, [transactions]);

    // Process top selling products
    const topProducts = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        const productSales = {};

        transactions.forEach(t => {
            const cartItems = t.cartItems || t.items || [];
            cartItems.forEach(item => {
                const productName = item.name || item.productName || 'Unknown Product';
                const price = item.unitPrice || item.price || 0;
                const quantity = item.quantity || 1;

                if (!productSales[productName]) {
                    productSales[productName] = 0;
                }
                productSales[productName] += price * quantity;
            });
        });

        return Object.entries(productSales)
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
    }, [transactions]);

    // Process low stock alerts
    const processedLowStock = useMemo(() => {
        if (!lowStockAlerts || lowStockAlerts.length === 0) return [];

        return lowStockAlerts.slice(0, 5).map(item => ({
            name: item.product?.name || item.name || 'Unknown Product',
            level: (item.currentStock || 0) <= (item.reorderPoint || 5) ? 'critical' : 'low',
            currentStock: item.currentStock || 0,
            reorderPoint: item.reorderPoint || 5
        }));
    }, [lowStockAlerts]);

   
    const activePromotionsWithRevenue = useMemo(() => {
        if (!promotions || promotions.length === 0) return [];

        // Filter active promotions and map directly without revenue calculation
        return promotions
            .filter(p => p.status === 'active')
            .slice(0, 5)
            .map(promo => ({
                name: promo.name,
                autoApply: promo.autoApply,
                couponCode: promo.couponCode,
                amountType: promo.amountType,
                amountValue: promo.amountValue
            }));
    }, [promotions]);
    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center py-32">
                <p className="text-muted-foreground">No transaction data available</p>
            </div>
        );
    }

    const statCards = [
        {
            label: "Sales Today",
            value: `${settings?.currencySymbol || '$'}${dashboardData.salesToday.toLocaleString()}`,
            change: dashboardData.salesChange.toFixed(1),
            icon: TrendingUp,
            highlight: true,
        },
        {
            label: "Transactions Today",
            value: dashboardData.transactionsToday.toLocaleString(),
            change: dashboardData.transactionsChange.toFixed(1),
            icon: ShoppingCart,
        },
        {
            label: "Avg. Transaction Value",
            value: `${settings?.currencySymbol || '$'}${dashboardData.avgTransactionValue.toFixed(2)}`,
            change: dashboardData.avgTransactionChange.toFixed(1),
            icon: Receipt,
        },
        {
            label: "Items Sold",
            value: dashboardData.itemsSold.toLocaleString(),
            change: dashboardData.itemsSoldChange.toFixed(1),
            icon: Package,
        },
    ];

    const fmt = (v) => `${settings?.currencySymbol || '$'}${v.toLocaleString()}`;

    return (
        <div className="space-y-5">
            {/* Header row - same as before */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
                        {!isAdmin && (
                            <Badge variant="outline" className="ml-2">
                                <Building2 className="h-3 w-3 mr-1" />
                                {currentBranchName}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">Real-time store performance snapshot</p>
                </div>

                <div className="flex gap-2">
                    {/* Branch selector for admin */}
                    {isAdmin && branches.length > 0 && (
                        <select
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={selectedBranchId || ''}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                        >
                            {branches.map(branch => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <FileText className="h-3.5 w-3.5" /> View Reports
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Warehouse className="h-3.5 w-3.5" /> Manage Inventory
                    </Button>
                </div>
            </div>

            {/* Admin branch summary */}
            {isAdmin && branches.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                        <p className="text-xs font-medium text-muted-foreground">Total Branches</p>
                        <p className="mt-1 text-2xl font-bold">{branches.length}</p>
                    </div>
                    <div className="rounded-xl bg-card border border-border p-4">
                        <p className="text-xs font-medium text-muted-foreground">Active Branches</p>
                        <p className="mt-1 text-2xl font-bold">{branches.filter(b => b.status === 'active').length}</p>
                    </div>
                    <div className="rounded-xl bg-card border border-border p-4">
                        <p className="text-xs font-medium text-muted-foreground">Inactive Branches</p>
                        <p className="mt-1 text-2xl font-bold">{branches.filter(b => b.status === 'inactive').length}</p>
                    </div>
                    <div className="rounded-xl bg-card border border-border p-4">
                        <p className="text-xs font-medium text-muted-foreground">Selected Branch</p>
                        <p className="mt-1 text-lg font-semibold truncate">{currentBranchName}</p>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    const isPositive = parseFloat(card.change) >= 0;
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

            {/* Charts Row - same as before */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Sales by Hour */}
                <div className="lg:col-span-2 rounded-xl bg-card border border-border p-5">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <h3 className="text-sm font-semibold text-card-foreground">Sales by Hour</h3>
                            <p className="text-xs text-muted-foreground">Today {!isAdmin && `- ${currentBranchName}`}</p>
                        </div>
                    </div>
                    <div className="h-64  w-full mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hourlySales}>
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
                    <p className="text-xs text-muted-foreground mb-2">{currentBranchName}</p>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" aspect={2}>
                            <PieChart>
                                <Pie
                                    data={paymentBreakdown}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="method"
                                >
                                    {paymentBreakdown.map((entry, i) => (
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
                                    formatter={(value) => [`${value.toFixed(1)}%`, ""]}
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
                    <p className="text-xs text-muted-foreground mb-2">{currentBranchName}</p>
                    <div className="space-y-3">
                        {topProducts.length > 0 ? topProducts.map((p) => (
                            <div key={p.name} className="flex items-center justify-between">
                                <span className="text-sm text-card-foreground">{p.name}</span>
                                <span className="text-sm font-semibold text-card-foreground">{settings?.currencySymbol || '$'}{p.sales.toLocaleString()}</span>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground">No sales data available</p>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="rounded-xl bg-card border border-border p-5">
                    <h3 className="text-sm font-semibold text-card-foreground mb-3">Low Stock Alerts</h3>
                    <p className="text-xs text-muted-foreground mb-2">{currentBranchName}</p>
                    <div className="space-y-3">
                        {processedLowStock.length > 0 ? processedLowStock.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <span className="text-sm text-card-foreground">{item.name}</span>
                                <Badge
                                    variant="secondary"
                                    className={`text-[11px] border-0 ${item.level === "critical"
                                        ? "bg-destructive/10 text-destructive"
                                        : "bg-warning/10 text-warning"
                                        }`}
                                >
                                    {item.level === "critical" ? "Critical" : "Low"} ({item.currentStock}/{item.reorderPoint})
                                </Badge>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground">No low stock alerts</p>
                        )}
                    </div>
                </div>

                {/* Active Promotions */}
                <div className="rounded-xl bg-card border border-border p-5">
                    <h3 className="text-sm font-semibold text-card-foreground mb-3">Active Promotions</h3>
                    <p className="text-xs text-muted-foreground mb-2">{currentBranchName}</p>
                    <div className="space-y-3">
                        {activePromotionsWithRevenue.length > 0 ? activePromotionsWithRevenue.map((promo) => (
                            <div key={promo.name} className="flex items-center justify-between">
                                <span className="text-sm text-card-foreground">{promo.name}</span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${promo.autoApply
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    Auto Apply: {promo.autoApply  ==="true" ? 'Yes' : 'No'}
                                </span>
                              
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground">No active promotions</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}