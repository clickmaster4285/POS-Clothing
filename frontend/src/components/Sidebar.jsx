import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    UserCog,
    BarChart3,
    Tag,
    Wallet,
    Settings,
    MonitorSmartphone,
    ChevronDown,
    ChevronRight,
    LogOut,
    Building2,
    Receipt,
    Truck,
    Menu,
    X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/context/SidebarContext";

export default function Sidebar() {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const { collapsed: sidebarCollapsed, setCollapsed } = useSidebar();

    const role = user?.role?.toLowerCase() || "customer";

    const [expandedItems, setExpandedItems] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const DESKTOP_BREAKPOINT = 1024;

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            setWindowWidth(newWidth);

            // Auto-expand on desktop/large screens if collapsed
            if (newWidth >= DESKTOP_BREAKPOINT && sidebarCollapsed) {
                setCollapsed(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // initial check

        return () => window.removeEventListener("resize", handleResize);
    }, [sidebarCollapsed, setCollapsed]);

    const toggleExpand = (title) => {
        setExpandedItems((prev) =>
            prev.includes(title)
                ? prev.filter((i) => i !== title)
                : [...prev, title]
        );
    };

    const isActive = (href, children) => {
        if (href && pathname === href) return true;
        if (children) return children.some((c) => c.href === pathname);
        return false;
    };

    const navItems = [
        { title: "Dashboard", href: `/${role}/dashboard`, icon: LayoutDashboard },
        {
            title: "Point Of Sale",
            icon: ShoppingCart,
            children: [
               
                { title: "Customer Information", href: `/${role}/pos/customer-info` },
                { title: "Discounts & Promotions", href: `/${role}/pos/discounts` },
                { title: "Transaction", href: `/${role}/pos/transaction` },
                { title: "Receipt Management", href: `/${role}/pos/receipts` },
                // { title: "Special Items", href: `/${role}/pos/special-items` },
                { title: "Returns & Exchanges", href: `/${role}/pos/returns` },
              
            ],
        },
        {
            title: "Inventory",
            icon: Package,
            children: [
                { title: "Categories & Brands", href: `/${role}/inventory/categories` },
                { title: "Products", href: `/${role}/inventory/products` },
                { title: "Stock Management", href: `/${role}/inventory/stock` },
                { title: "Barcode Management", href: `/${role}/inventory/barcode-management` },
               
            ],
        },
        {
            title: "Customers",
            icon: Users,
            children: [
                { title: "All Customers", href: `/${role}/customer/customer-info` },
                { title: "Loyalty Programs", href: `/${role}/customer/loyalty` },
            ],
        },
        {
            title: "Employees",
            icon: UserCog,
            children: [
                { title: "All Employees", href: `/${role}/user-management` },
                { title: "Shift Management", href: `/${role}/user-management/shifts` },
                { title: "Payroll Integration", href: `/${role}/user-management/payroll` },
                { title: "Performance Management", href: `/${role}/user-management/performance` },
            ],
        },
        {
            title: "Reports & Analytics",
            icon: BarChart3,
            children: [
                { title: "Sales Reports", href: `/${role}/reports/sales` },
                { title: "Inventory Reports", href: `/${role}/reports/inventory` },
            ],
        },
        { title: "Branches", href: `/${role}/branches`, icon: Building2 },
        { title: "Supplier", href: `/${role}/supplier`, icon: Truck },
        // {
        //     title: "Promotions",
        //     icon: Tag,
        //     children: [
        //         { title: "Active Promotions", href: `/${role}/promotions/active` },
        //         { title: "Create Promotion", href: `/${role}/promotions/create` },
        //     ],
        // },
        // {
        //     title: "Cash Management",
        //     icon: Wallet,
        //     children: [
        //         { title: "Cash Registers", href: `/${role}/cash/registers` },
        //         { title: "Transactions", href: `/${role}/cash/transactions` },
        //     ],
        // },
        {
            title: "Settings",
            icon: Settings,
            children: [
                { title: "Profile & Company Settings", href: `/${role}/settings/general` },
              
            ],
        },
        // { title: "Self-Checkout", href: `/${role}/self-checkout`, icon: MonitorSmartphone },
    ];

    // Decide if toggle button should be visible
    const showToggleButton = windowWidth < DESKTOP_BREAKPOINT || sidebarCollapsed;

    return (
        <aside
            className={`fixed left-0 top-0 z-40 h-screen border-r border-border bg-background flex flex-col transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-[280px]"
                }`}
        >
            {/* Header */}
            <div className="flex h-16 items-center gap-2 border-b border-border px-4">
                {!sidebarCollapsed && (
                    <>
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                            <Receipt className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-foreground">POS Clothing</span>
                    </>
                )}

                {showToggleButton && (
                    <button
                        onClick={() => setCollapsed(!sidebarCollapsed)}
                        className="p-1 rounded-md hover:bg-muted transition-colors"
                        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {sidebarCollapsed ? (
                            <Menu className="w-5 h-5" />
                        ) : (
                            <X className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href, item.children);
                        const expanded = expandedItems.includes(item.title);

                        if (item.children) {
                            return (
                                <li key={item.title}>
                                    <button
                                        onClick={() => toggleExpand(item.title)}
                                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${active
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {!sidebarCollapsed && item.title}
                                        </span>
                                        {!sidebarCollapsed && (
                                            expanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )
                                        )}
                                    </button>

                                    {expanded && !sidebarCollapsed && (
                                        <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                                            {item.children.map((child) => (
                                                <li key={child.href}>
                                                    <Link
                                                        to={child.href}
                                                        className={`block rounded-md px-3 py-1.5 text-sm transition ${pathname === child.href
                                                                ? "text-primary font-medium"
                                                                : "text-muted-foreground hover:text-foreground"
                                                            }`}
                                                    >
                                                        {child.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        }

                        return (
                            <li key={item.title}>
                                <Link
                                    to={item.href}
                                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${active
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {!sidebarCollapsed && item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="border-t border-border p-3 mt-auto">
                <button
                    onClick={() => logout("/login")}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${sidebarCollapsed ? "justify-center" : "justify-start"
                        } text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300`}
                    title="Logout"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span>Logout</span>}
                </button>
            </div>

            {/* Footer */}
            {!sidebarCollapsed && (
                <div className="border-t border-border px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                        © 2026 Powered by Clickmasters
                    </p>
                </div>
            )}
        </aside>
    );
}