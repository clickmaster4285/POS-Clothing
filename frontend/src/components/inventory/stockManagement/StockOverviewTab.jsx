"use client"

import { Boxes, AlertTriangle, Truck, List } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, PackagePlus, PackageMinus, Truck as TruckIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"

export function StockOverviewTab({
    stocks = [],
    lowStockItems = [],
    totalValue = 0,
    transfers = [],
    adjustments = [],
    searchTerm = "",
    setSearchTerm,
    branchFilter = "all",
    setBranchFilter,
    branches = [],
    setAdjustForm,
    setTransferForm,
    setActiveTab,
    getStatusColor
}) {



    const handleSearch = (term) => {
        setSearchTerm(term)
    }

    const filteredStocks = stocks.filter((stock) => {
        const productName = stock?.product?.productName || ""
        const sku = stock.product?.sku || ""

        const matchesSearch =
            productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sku.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesBranch =
            branchFilter === "all" || stock.branch?._id === branchFilter

        return matchesSearch && matchesBranch
    })



    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-blue-50 p-3">
                                <Boxes className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stocks.length}</p>
                                <p className="text-sm text-muted-foreground">Total SKUs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* <Card className="border-border/50">
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
                </Card> */}
                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-amber-50 p-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{lowStockItems.length}</p>
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
                                <p className="text-2xl font-bold">{transfers.filter((t) => t.status !== "completed").length}</p>
                                <p className="text-sm text-muted-foreground">Pending Transfers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by product name or SKU..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={branchFilter} onValueChange={setBranchFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Branches</SelectItem>
                             {branches.map((branch) => (
  <SelectItem key={branch._id} value={branch._id}>
    {branch.branch_name}
  </SelectItem>
))}

                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Stock Table */}
            <Card className="border-border/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Stock Levels</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">Current</TableHead>
                                <TableHead className="text-right">Reserved</TableHead>
                                <TableHead className="text-right">Available</TableHead>
                                <TableHead className="text-right">In Transit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStocks.map((stock) => {
                                const variant = stock.product?.variants?.find((v) =>
                                    v._id === stock.variantId || v.id === stock.variantId
                                )
                                return (
                                    <TableRow key={stock.id}>
                                        <TableCell className="font-medium">{stock?.product?.productName}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {stock.variantName}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{stock.branchName}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {stock.location}
                                        </TableCell>
                                        <TableCell className="text-right">{stock.currentStock}</TableCell>
                                        <TableCell className="text-right">{stock.reservedStock}</TableCell>
                                        <TableCell className="text-right font-medium">{stock.availableStock}</TableCell>
                                        <TableCell className="text-right">{stock.inTransitStock}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={(
                                                    stock.isLowStock
                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                        : "bg-green-50 text-green-700 border-green-200"
                                                )}
                                            >
                                                {stock.isLowStock ? "Low Stock" : "In Stock"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => {
                                                        setAdjustForm({
                                                            product: stock.product._id,       // ← change to _id
                                                            variant: stock.variantId,         // usually already _id
                                                            branch: stock.branch._id,         // ← change to _id
                                                            type: "add",
                                                            quantity: "",
                                                            reason: "",
                                                        })
                                                        setActiveTab("adjustment-form")
                                                    }}>
                                                        <PackagePlus className="mr-2 h-4 w-4" />
                                                        Add Stock
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        setAdjustForm({
                                                            product: stock.product._id,       // ← change to _id
                                                            variant: stock.variantId,
                                                            branch: stock.branch._id,         // ← change to _id
                                                            type: "remove",
                                                            quantity: "",
                                                            reason: "",
                                                        })
                                                        setActiveTab("adjustment-form")
                                                    }}>
                                                        <PackageMinus className="mr-2 h-4 w-4" />
                                                        Remove Stock
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        setTransferForm({
                                                            fromBranch: stock.branch.id,
                                                            toBranch: "",
                                                            product: stock.product.id,
                                                            variant: stock.variantId,
                                                            quantity: "",
                                                            notes: "",
                                                        })
                                                        setActiveTab("transfer-form")
                                                    }}>
                                                        <TruckIcon className="mr-2 h-4 w-4" />
                                                        Transfer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Adjustments & Transfers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Adjustments */}
                <Card className="border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Recent Adjustments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {adjustments.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No recent stock adjustments
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {adjustments.slice(0, 3).map((adj) => {
                                    const item = adj.items?.[0];

                                    return (
                                        <div
                                            key={adj._id}
                                            className="flex items-center justify-between p-3 rounded-lg border border-border"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {adj.adjustmentType.toUpperCase()}
                                                    {adj.referenceNumber && (
                                                        <span className="text-muted-foreground">
                                                            {" "}· {adj.referenceNumber}
                                                        </span>
                                                    )}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {item?.product?.productName || "Product"}
                                                    {item?.quantity && ` • Qty: ${item.quantity}`}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <Badge
                                                    variant="outline"
                                                    className={`${getStatusColor(adj.status)} text-xs`}
                                                >
                                                    {adj.status}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(adj.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Transfers */}
                <Card className="border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Recent Transfers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {transfers.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No recent stock transfers
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {transfers.slice(0, 3).map((transfer) => (
                                    <div
                                        key={transfer._id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                {transfer.transferNumber || "Transfer"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transfer.fromBranch?.branch_name || "—"} →{" "}
                                                {transfer.toBranch?.branch_name || "—"}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <Badge
                                                variant="outline"
                                                className={`${getStatusColor(transfer.status)} text-xs`}
                                            >
                                                {transfer.status.replace("-", " ")}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(transfer.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>


        </div>
    )
}