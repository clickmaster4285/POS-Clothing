"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Boxes, AlertTriangle, Truck } from "lucide-react"

export function StockStats({
    totalSKUs = 0,
    totalValue = 0,
    lowStockCount = 0,
    pendingTransfers = 0
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-blue-50 p-3">
                            <Boxes className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalSKUs}</p>
                            <p className="text-sm text-muted-foreground">Total SKUs</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-green-50 p-3">
                            <Boxes className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Stock Value</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-amber-50 p-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{lowStockCount}</p>
                            <p className="text-sm text-muted-foreground">Low Stock Items</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-purple-50 p-3">
                            <Truck className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{pendingTransfers}</p>
                            <p className="text-sm text-muted-foreground">Pending Transfers</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}