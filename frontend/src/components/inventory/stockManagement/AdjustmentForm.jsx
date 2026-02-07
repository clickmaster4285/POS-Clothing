"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, XCircle } from "lucide-react"

export function AdjustmentForm({
    adjustForm,
    setAdjustForm,
    products = [],
    productsLoading = false,
    branches = [],
    adjustments = [],
    adjustSummary,
    handleAddAdjustment,
    resetAdjustForm,
    handleApproveAdjustment,
    handleRejectAdjustment,
    getStatusColor
}) {
    const selectedProductForAdjust = products.find(p => p._id === adjustForm.product)
    const selectedProductVariantsAdjust = selectedProductForAdjust?.variants || []

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2">
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ArrowUpDown className="h-5 w-5 text-primary" />
                            Adjustment Form
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Adjustment Type *</Label>
                            <Select value={adjustForm.type} onValueChange={(value) => setAdjustForm({ ...adjustForm, type: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="add">Add Stock</SelectItem>
                                    <SelectItem value="remove">Remove Stock</SelectItem>
                                    {/* <SelectItem value="damage">Damage Write-off</SelectItem>
                                    <SelectItem value="return">Return</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Branch *</Label>
                            <Select
                                value={adjustForm.branch}
                                onValueChange={(value) => setAdjustForm({ ...adjustForm, branch: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((branch) => (
                                        <SelectItem
                                            key={branch._id}           // ← use _id
                                            value={branch._id}         // ← use _id as value
                                        >
                                            {branch.branch_name || branch.name || "Unnamed Branch"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Product *</Label>
                                {productsLoading ? (
                                    <div className="text-sm text-muted-foreground">Loading products...</div>
                                ) : (
                                    <Select
                                        value={adjustForm.product}
                                        onValueChange={v => setAdjustForm({ ...adjustForm, product: v, variant: "" })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => (
                                                <SelectItem key={p._id} value={p._id}>
                                                    {p.productName} ({p.sku || "no-sku"})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Variant *</Label>
                                <Select
                                    value={adjustForm.variant}
                                    onValueChange={v => setAdjustForm({ ...adjustForm, variant: v })}
                                    disabled={!adjustForm.product || selectedProductVariantsAdjust.length === 0}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select variant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedProductVariantsAdjust.map(v => (
                                            <SelectItem key={v._id} value={v._id}>
                                                {v.size || "-"} / {v.color || "-"} {v.variantSku ? `(${v.variantSku})` : ""}
                                            </SelectItem>
                                        ))}
                                        {selectedProductVariantsAdjust.length === 0 && adjustForm.product && (
                                            <SelectItem value="none" disabled>No variants available</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={adjustForm.quantity}
                                onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                                placeholder="Enter quantity"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason *</Label>
                            <Textarea
                                id="reason"
                                value={adjustForm.reason}
                                onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                                placeholder="Enter reason for adjustment"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={resetAdjustForm} className="bg-transparent">
                                Clear Form
                            </Button>
                            <Button onClick={handleAddAdjustment} disabled={!adjustSummary.isValid}>
                                Submit Adjustment
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Adjustments History */}
                <Card className="border-border/50 mt-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Adjustments History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adjustments.map((adj) => (
                                    <TableRow key={adj.id}>
                                        <TableCell className="font-medium">{adj.referenceNumber}</TableCell>
                                        <TableCell>{new Date(adj.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{adj.branch.branch_name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">{adj.adjustmentType}</Badge>
                                        </TableCell>
                                        <TableCell>{adj.items.length} items</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(adj.status)}>{adj.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {adj.status === "pending" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleApproveAdjustment(adj.id)}>
                                                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleRejectAdjustment(adj.id)} className="text-destructive">
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Section */}
            <div className="space-y-4">
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border border-border p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Adjustment Type</p>
                            <p className="text-xl font-semibold mt-1">{adjustSummary.typeLabel}</p>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Product</p>
                            <p className="text-xl font-semibold mt-1">{adjustSummary.product}</p>
                        </div>

                        <div className="rounded-lg border border-border p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Branch</p>
                            <p className="text-xl font-semibold mt-1">{adjustSummary.branch}</p>
                        </div>

                        {adjustForm.quantity && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <p className="text-xs text-amber-600 uppercase tracking-wider">Quantity</p>
                                <p className="text-3xl font-bold text-amber-700 mt-1">{adjustForm.quantity}</p>
                                <p className="text-xs text-amber-600 mt-1">units to {adjustForm.type}</p>
                            </div>
                        )}

                        <div className={`rounded-lg border p-4 ${adjustSummary.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Form Status</p>
                            <div className="flex items-center gap-2 mt-2">
                                {adjustSummary.isValid ? (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Ready to Submit
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                                        Missing required fields
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}