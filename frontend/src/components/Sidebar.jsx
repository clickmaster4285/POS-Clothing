import React, { useState } from "react";
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
} from "lucide-react";

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
        title: "Point Of Sale",
        icon: ShoppingCart,
        children: [
            { title: "Transaction", href: "/pos/transaction" },
            { title: "Customer Information", href: "/pos/customer-info" },
            { title: "Discounts & Promotions", href: "/pos/discounts" },
            { title: "Special Items", href: "/pos/special-items" },
            { title: "Returns & Exchanges", href: "/pos/returns" },
            { title: "Receipt Management", href: "/pos/receipts" },
        ],
    },
    {
        title: "Inventory",
        icon: Package,
        children: [
            { title: "Products", href: "/inventory/products" },
            { title: "Stock Management", href: "/inventory/stock" },
            { title: "Purchase Orders", href: "/inventory/purchase-orders" },
            { title: "Stock Audit", href: "/inventory/stock-audit" },
            { title: "Barcode Management", href: "/inventory/barcode-management" },
            { title: "Categories & Brands", href: "/inventory/categories" },
        ],
    },
    {
        title: "Customers",
        icon: Users,
        children: [
            { title: "All Customers", href: "/customers/all" },
            { title: "Loyalty Programs", href: "/customers/loyalty" },
        ],
    },
    {
        title: "Employees",
        icon: UserCog,
        children: [
            { title: "All Employees", href: "/employees/all" },
            { title: "Roles & Permissions", href: "/employees/roles" },
        ],
    },
    {
        title: "Reports & Analytics",
        icon: BarChart3,
        children: [
            { title: "Sales Reports", href: "/reports/sales" },
            { title: "Inventory Reports", href: "/reports/inventory" },
        ],
    },
    {
        title: "Promotions",
        icon: Tag,
        children: [
            { title: "Active Promotions", href: "/promotions/active" },
            { title: "Create Promotion", href: "/promotions/create" },
        ],
    },
    {
        title: "Cash Management",
        icon: Wallet,
        children: [
            { title: "Cash Registers", href: "/cash/registers" },
            { title: "Transactions", href: "/cash/transactions" },
        ],
    },
    { title: "Branches", href: "/branches", icon: Building2 },
    { title: "Supplier", href: "/supplier", icon: Building2 },
    {
        title: "Settings",
        icon: Settings,
        children: [
            { title: "General", href: "/settings/general" },
            { title: "Users", href: "/settings/users" },
        ],
    },
    { title: "Self-Checkout", href: "/self-checkout", icon: MonitorSmartphone },
];

export default function Sidebar() {
    const { pathname } = useLocation();
    const [expandedItems, setExpandedItems] = useState(["Point Of Sale"]);

    const toggleExpand = (title) =>
        setExpandedItems((prev) =>
            prev.includes(title)
                ? prev.filter((i) => i !== title)
                : [...prev, title]
        );

    const isActive = (href, children) => {
        if (href && pathname === href) return true;
        if (children) return children.some((c) => c.href === pathname);
        return false;
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-border bg-background flex flex-col">
            {/* Header */}
            <div className="flex h-16 items-center gap-2 border-b border-border px-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                    <Receipt className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">POS SYSTEM</span>
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
                                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition
                      ${active
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {item.title}
                                        </span>
                                        {expanded ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>

                                    {expanded && (
                                        <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                                            {item.children.map((child) => (
                                                <li key={child.href}>
                                                    <Link
                                                        to={child.href}
                                                        className={`block rounded-md px-3 py-1.5 text-sm transition
                              ${pathname === child.href
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
                                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
                    ${active
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="border-t border-border p-3">
                <button className="flex w-full items-center gap-2 rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition">
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-3">
                <p className="text-xs text-primary">
                    © 2026 Powered by Clickmasters
                </p>
            </div>
        </aside>
    );
}
