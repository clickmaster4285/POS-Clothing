"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export function PageHeader({ title = "Stock Management", description = "Manage stock levels, adjustments, and transfers", lowStockCount = 0 }) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            {lowStockCount > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {lowStockCount} Low Stock Items
                </Badge>
            )}
        </div>
    )
}