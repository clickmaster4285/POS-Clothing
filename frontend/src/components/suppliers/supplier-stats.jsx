"use client";

import { Truck, CheckCircle, XCircle, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SupplierStats({ suppliers }) {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter((s) => s.is_active).length;
    const inactiveSuppliers = suppliers.filter((s) => !s.is_active).length;
    const avgRating =
        suppliers.length > 0
            ? (
                suppliers.reduce((sum, s) => sum + s.performance.quality_rating, 0) /
                suppliers.length
            ).toFixed(1)
            : "0";

    const stats = [
        {
            label: "Total Suppliers",
            value: totalSuppliers,
            icon: Truck,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            label: "Active Suppliers",
            value: activeSuppliers,
            icon: CheckCircle,
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            label: "Inactive Suppliers",
            value: inactiveSuppliers,
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
        },
        {
            label: "Avg. Rating",
            value: avgRating,
            icon: Star,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="flex items-center gap-4 p-5">
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                    >
                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
