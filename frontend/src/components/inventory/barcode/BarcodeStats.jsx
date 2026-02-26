"use client"

import { StatCard } from "@/components/inventory/stat-card"
import { Barcode, Package, Tag, Printer } from "lucide-react"

export function BarcodeStats({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                bgColor="bg-blue-50"
                iconColor="text-blue-600"
            />
            <StatCard
                title="With Barcode"
                value={stats.withBarcode}
                icon={Barcode}
                bgColor="bg-green-50"
                iconColor="text-green-600"
            />
            <StatCard
                title="Selected Items"
                value={stats.selectedItems}
                icon={Tag}
                bgColor="bg-amber-50"
                iconColor="text-amber-600"
            />
            <StatCard
                title="Labels to Print"
                value={stats.totalLabels}
                icon={Printer}
                bgColor="bg-purple-50"
                iconColor="text-purple-600"
            />
        </div>
    )
}