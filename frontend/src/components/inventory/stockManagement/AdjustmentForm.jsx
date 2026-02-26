"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, Plus, XCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner" // ✅ FIX 1: Added missing toast import

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
    getStatusColor
}) {

    const { user } = useAuth()

    const handleRowChange = (index, field, value) => {
        const updatedItems = [...adjustForm.items]
        updatedItems[index][field] = value

        // Reset dependent fields
        if (field === "product") {
            updatedItems[index].variant = ""
            updatedItems[index].color = ""
        }
        if (field === "variant") {
            updatedItems[index].color = ""
        }

        setAdjustForm({ ...adjustForm, items: updatedItems })
    }

    const addRow = () => {
        setAdjustForm({
            ...adjustForm,
            items: [...adjustForm.items, { product: "", variant: "", color: "", quantity: "" }]
        })
    }

    const removeRow = (index) => {
        const updatedItems = adjustForm.items.filter((_, i) => i !== index)
        setAdjustForm({ ...adjustForm, items: updatedItems })
    }

    // ✅ FIX 2: Helper function to get available stock for a selected product/variant/color
    const getAvailableStock = (productId, variantId, color) => {
        if (!productId || !variantId || !color) return 0;

        const product = products.find(p => p._id === productId);
        if (!product) return 0;

        const variant = product.variants?.find(v => v._id === variantId);
        if (!variant) return 0;

        const colorStock = variant.stockByAttribute?.find(attr => attr.color === color);
        return colorStock?.quantity || 0;
    };

    const handleQuantityChange = (index, value) => {
        const row = adjustForm.items[index];
        const numValue = value === "" ? "" : Number(value);

        // Don't validate if field is empty or zero
        if (numValue === "" || numValue === 0) {
            handleRowChange(index, "quantity", value);
            return;
        }

        // For remove operations, validate against available stock
        if (adjustForm.type === "remove") {
            const availableStock = getAvailableStock(row.product, row.variant, row.color);

            // Only validate if we have all selections and available stock info
            if (row.product && row.variant && row.color) {
                if (numValue > availableStock) {
                    toast.error(`Cannot remove more than ${availableStock} items`);
                    return; // Don't update if validation fails
                }
            }
        }

        // For add operations OR when validation passes for remove, update the quantity
        handleRowChange(index, "quantity", value);
    };

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
                        {/* Adjustment Type */}
                        <div className="space-y-2">
                            <Label>Adjustment Type *</Label>
                            <Select value={adjustForm.type} onValueChange={(value) => setAdjustForm({ ...adjustForm, type: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="add">Add Stock</SelectItem>
                                    <SelectItem value="remove">Remove Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Branch - Only for admin */}
                        {user?.role === "admin" && (
                            <div className="space-y-2">
                                <Label>Branch (Optional)</Label>
                                <Select
                                    value={adjustForm.branch}
                                    onValueChange={(value) => setAdjustForm({ ...adjustForm, branch: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map(branch => (
                                            <SelectItem key={branch._id} value={branch._id}>
                                                {branch.branch_name || branch.name || "Unnamed Branch"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Items Rows */}
                        <div className="space-y-4">
                            {adjustForm.items.map((row, index) => {
                                const selectedProduct = products.find(p => p._id === row.product)
                                const variants = selectedProduct?.variants || []

                                const selectedVariant = variants.find(v => v._id === row.variant)
                                const colors = selectedVariant?.stockByAttribute || []

                                // Get available stock for this combination
                                const availableStock = getAvailableStock(row.product, row.variant, row.color);

                                return (
                                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                                        {/* Product */}
                                        <div className="space-y-2">
                                            <Label>Product *</Label>
                                            {productsLoading ? (
                                                <div className="text-sm text-muted-foreground">Loading...</div>
                                            ) : (
                                                <Select
                                                    value={row.product}
                                                    onValueChange={v => handleRowChange(index, "product", v)}
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

                                        {/* Variant */}
                                        <div className="space-y-2">
                                            <Label>Variant *</Label>
                                            <Select
                                                value={row.variant}
                                                onValueChange={v => handleRowChange(index, "variant", v)}
                                                disabled={!row.product || variants.length === 0}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select variant" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {variants.map(v => (
                                                        <SelectItem key={v._id} value={v._id}>
                                                            {v.size || "-"} / {v.style || "-"} {v.variantSku ? `(${v.variantSku})` : ""}
                                                        </SelectItem>
                                                    ))}
                                                    {variants.length === 0 && row.product && (
                                                        <SelectItem value="none" disabled>No variants</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Color */}
                                        <div className="space-y-2">
                                            <Label>Color *</Label>
                                            <Select
                                                value={row.color}
                                                onValueChange={v => handleRowChange(index, "color", v)}
                                                disabled={!row.variant || colors.length === 0}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select color" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {colors.map(attr => (
                                                        <SelectItem key={attr.color} value={attr.color}>
                                                            {attr.color || "Default"}
                                                        </SelectItem>
                                                    ))}
                                                    {colors.length === 0 && row.variant && (
                                                        <SelectItem value="none" disabled>No colors</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                     
                                        {/* Quantity */}
                                        <div className="space-y-2">
                                            <Label>Quantity *</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={row.quantity}
                                                onChange={e => handleQuantityChange(index, e.target.value)}
                                                placeholder="Quantity"
                                                disabled={!row.color} // Disable until color is selected
                                            />
                                            {/* Show stock information when color is selected */}
                                            {row.color && (
                                                <p className={`text-xs ${adjustForm.type === "remove"
                                                        ? availableStock > 0 ? "text-amber-600" : "text-red-500"
                                                        : "text-muted-foreground"
                                                    }`}>
                                                    {adjustForm.type === "remove"
                                                        ? availableStock > 0
                                                            ? `Available to remove: ${availableStock}`
                                                            : "No stock available to remove"
                                                        : `Current stock: ${availableStock}`}
                                                </p>
                                            )}
                                        </div>

                                        {/* Remove Row */}
                                        <div className="flex items-center gap-2">
                                            {adjustForm.items.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeRow(index)}
                                                    title="Remove row"
                                                >
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                            <Button type="button" variant="outline" size="sm" onClick={addRow} className="mt-2">
                                <Plus className="h-4 w-4 mr-1" />
                                Add another product
                            </Button>
                        </div>

                        {/* Reason - Required for remove operations */}
                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                Reason * {adjustForm.type === "remove" && <span className="text-red-500">*</span>}
                            </Label>
                            <Textarea
                                id="reason"
                                value={adjustForm.reason}
                                onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                                placeholder={adjustForm.type === "remove"
                                    ? "Enter reason for removing stock (required)"
                                    : "Enter reason for adjustment (required)"}
                                rows={3}
                                required={adjustForm.type === "remove"}
                            />
                            {adjustForm.type === "remove" && !adjustForm.reason && (
                                <p className="text-xs text-red-500">Reason is required for stock removal</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={resetAdjustForm} className="bg-transparent">
                                Clear Form
                            </Button>
                            <Button
                                onClick={handleAddAdjustment}
                                disabled={!adjustSummary.isValid}
                            >
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
                        {/* Your existing adjustments table */}
                        {adjustments.length > 0 ? (
                            <div className="space-y-2">
                                {/* Add your adjustments list/table here */}
                                <p className="text-sm text-muted-foreground">Recent adjustments will appear here</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No adjustments yet</p>
                        )}
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