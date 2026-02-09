// src/components/inventory/productsComponents/ProductDetailSheet.tsx

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Pencil } from "lucide-react";
import { useUpdateVariantPrice, useAddVariant, useAddVariantQuantity } from '@/hooks/inv_hooks/useProducts';
import { toast } from "sonner";


export default function ProductDetailSheet({
    isOpen,
    onOpenChange,
    product,
    onEdit,
    refetchProducts,
}) {
    if (!product) return null;

    // ─── States ───
    const [editVariant, setEditVariant] = useState(null);
    const [addVariantOpen, setAddVariantOpen] = useState(false);
    const [updateQuantityVariant, setUpdateQuantityVariant] = useState(null);

    const [quantityForm, setQuantityForm] = useState({
        color: '',
        quantityChange: '',
        reason: ''
    });

    

    

    // Form state for adding new variant
    const [newVariant, setNewVariant] = useState({
        size: '',
        costPrice: '',
        retailPrice: '',
        variantSku: '',
        stockByAttribute: [
            { color: '', quantity: '' }
        ],
    });

    // Form state for editing price
    const [editPriceForm, setEditPriceForm] = useState({
        costPrice: '',
        retailPrice: '',
    });

    // ─── Mutations ───
    const { mutate: updatePrice, isPending: isUpdating } = useUpdateVariantPrice();
    const { mutate: addVariant, isPending: isAdding } = useAddVariant();
    const { mutate: addQuantity, isPending: isUpdatingQuantity } = useAddVariantQuantity();

    // ─── Handlers ───

    const resetNewVariantForm = () => {
        setNewVariant({
            size: '',
            costPrice: '',
            retailPrice: '',
            variantSku: '',
            stockByAttribute: [
                { color: '', quantity: '' }
            ],
        });
    };


    const handleAddVariantClose = () => {
        setAddVariantOpen(false);
        resetNewVariantForm();
    };

    const handleAddVariantSubmit = () => {
        const { size, costPrice, retailPrice, variantSku, stockByAttribute } = newVariant;

        // ---------- Basic validation ----------
        if (!size || !size.trim() || costPrice === '' || retailPrice === '') {
            toast.error("Size, Cost Price and Retail Price are required.");
            return;
        }

        // ---------- Color + quantity validation ----------
        if (
            !Array.isArray(stockByAttribute) ||
            stockByAttribute.length === 0 ||
            stockByAttribute.some(
                (item) =>
                    !item.color ||
                    !item.color.trim() ||
                    item.quantity === '' ||
                    item.quantity === null ||
                    Number(item.quantity) < 0
            )
        ) {
            toast.error("All color and quantity fields are required.");
            return;
        }

        // ---------- Price validation ----------
        const cost = Number(costPrice);
        const retail = Number(retailPrice);

        if (isNaN(cost) || isNaN(retail) || cost < 0 || retail < 0) {
            toast.error("Please enter valid non-negative prices.");
            return;
        }

        // ---------- Payload ----------
        const payload = {
            size: size.trim(),
            price: {
                costPrice: cost,
                retailPrice: retail,
            },
            variantSku: variantSku?.trim() || undefined,
            stockByAttribute: stockByAttribute.map((item) => ({
                color: item.color.trim(),
                quantity: Number(item.quantity),
            })),
        };

        // ---------- API call ----------
        addVariant(
            {
                productId: product._id,
                data: payload,
            },
            {
                onSuccess: () => {
                    toast.success("Variant added successfully");
                    refetchProducts();
                    handleAddVariantClose();
                },
                onError: (err) => {
                    console.error("Failed to add variant:", err);
                    toast.error("Failed to add variant");
                },
            }
        );
    };





    const handleOpenEdit = (variant) => {
        setEditVariant(variant);
        setEditPriceForm({
            costPrice: variant?.price?.costPrice?.toString() ?? '0',
            retailPrice: variant?.price?.retailPrice?.toString() ?? '0',
        });
    };



    const handleUpdatePriceSubmit = () => {
        if (!editVariant?._id) return;

        const cost = Number(editPriceForm.costPrice);
        const retail = Number(editPriceForm.retailPrice);

        // Validation
        if (isNaN(cost) || isNaN(retail) || cost < 0 || retail < 0) {
            toast.error("Please enter valid non-negative prices.");
            return;
        }

        // Payload for API
        const payload = {
            costPrice: cost,
            retailPrice: retail,
        };

        // Call API
        updatePrice(
            {
                productId: product._id,
                variantId: editVariant._id,
                data: payload,  // ← send payload under `data`
            },
            {
                onSuccess: () => {
                    toast.success("Variant price updated successfully");
                    refetchProducts(); 
                    setEditVariant(null);
                    // Optionally refetch product here
                },
                onError: (err) => {
                    console.error("Failed to update variant price:", err);
                    toast.error("Failed to update variant price");
                },
            }
        );
    };

    const handleOpenQuantity = (variant) => {
        setUpdateQuantityVariant(variant);
        setQuantityForm({
            color: variant.stockByAttribute?.[0]?.color || '',
            quantityChange: '',
            reason: ''
        });
    };


    const handleUpdateQuantitySubmit = () => {
        if (!updateQuantityVariant?._id) return;

        const qty = Number(quantityForm.quantityChange);
        if (!quantityForm.color || !quantityForm.color.trim()) {
            toast.error("Please select a color.");
            return;
        }

        if (isNaN(qty) || qty === 0) {
            toast.error("Please enter a valid quantity change (non-zero).");
            return;
        }

        const payload = {
            color: quantityForm.color.trim(),
            quantityChange: qty,
            reason: quantityForm.reason || "Manual update",
        };

        addQuantity(
            {
                productId: product._id,
                variantId: updateQuantityVariant._id,
                data: payload,
            },
            {
                onSuccess: (res) => {
                    toast.success(
                        `Updated ${payload.color}: ${res.data.currentQuantity}`
                    );
                    setUpdateQuantityVariant(null);
                    refetchProducts();
                },
                onError: () => {
                    toast.error("Failed to update quantity");
                },
            }
        );
    };


    const handleAddColorRow = () => {
        setNewVariant((prev) => ({
            ...prev,
            stockByAttribute: [...prev.stockByAttribute, { color: '', quantity: '' }],
        }));
    };

    const handleRemoveColorRow = (index) => {
        setNewVariant((prev) => ({
            ...prev,
            stockByAttribute: prev.stockByAttribute.filter((_, i) => i !== index),
        }));
    };

    const handleColorChange = (index, field, value) => {
        setNewVariant((prev) => {
            const updated = [...prev.stockByAttribute];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, stockByAttribute: updated };
        });
    };


    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full max-w-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-3xl p-0"
            >
                <ScrollArea className="h-full">
                    <div className="p-6 pb-20">
                        {/* Header */}
                        <SheetHeader className="mb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <SheetTitle className="text-2xl md:text-3xl">
                                        {product.productName}
                                    </SheetTitle>
                                    <SheetDescription className="mt-1.5 flex items-center gap-3 flex-wrap">
                                        <span>SKU: {product.sku}</span>
                                        {product.barcode && <span>• Barcode: {product.barcode}</span>}
                                        <Badge
                                            variant={product.isActive ? "default" : "secondary"}
                                            className={
                                                product.isActive
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-red-600 hover:bg-red-700"
                                            }
                                        >
                                            {product.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </SheetDescription>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            onOpenChange(false);
                                            onEdit(product);
                                        }}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                    <SheetClose asChild>
                                        <Button variant="ghost" size="icon">
                                            <span className="sr-only">Close</span>
                                            ✕
                                        </Button>
                                    </SheetClose>
                                </div>
                            </div>
                            <Separator className="my-6" />
                        </SheetHeader>

                        {/* Main content */}
                        <div className="space-y-8">
                            {/* Image + quick info */}
                            <div className="flex flex-col sm:flex-row gap-6">
                                {product.primaryImage && (
                                    <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden border bg-muted shrink-0">
                                        <img
                                            src={product.primaryImage}
                                            alt={product.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Category</p>
                                            <p className="font-medium mt-1">{product.category?.categoryName || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Brand</p>
                                            <p className="font-medium mt-1">{product.brand?.brandName || "—"}</p>
                                        </div>
                                    </div>

                                    {(product.season || product.material || product.countryOfOrigin) && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t">
                                            {product.season && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Season</p>
                                                    <p className="font-medium mt-1">{product.season}</p>
                                                </div>
                                            )}
                                            {product.material && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Material</p>
                                                    <p className="font-medium mt-1">{product.material}</p>
                                                </div>
                                            )}
                                            {product.countryOfOrigin && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Origin</p>
                                                    <p className="font-medium mt-1">{product.countryOfOrigin}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Variants Table */}
                            {product.variants?.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-lg font-semibold">
                                            Variants ({product.variants.length})
                                        </h4>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setAddVariantOpen(true)}
                                        >
                                            <Plus className="h-4 w-4 mr-1.5" />
                                            Add Variant
                                        </Button>
                                    </div>

                                    <div className="rounded-md border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[140px]">Variant SKU</TableHead>
                                                    <TableHead>Size</TableHead>
                                                    <TableHead>Color</TableHead>
                                                    <TableHead>Quantity</TableHead>
                                                    <TableHead className="text-right">Cost Price</TableHead>
                                                    <TableHead className="text-right">Retail Price</TableHead>
                                                    <TableHead className="w-[80px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {product.variants.map((variant, idx) => (
                                                    <TableRow key={variant._id || idx}>
                                                        <TableCell className="font-medium">
                                                            {variant.variantSku || product.sku}
                                                        </TableCell>
                                                        <TableCell>{variant.size || "—"}</TableCell>
                                                        <TableCell>
                                                            {variant.stockByAttribute?.length > 0 ? (
                                                                <div className="space-y-1">
                                                                    {variant.stockByAttribute.map((item, i) => (
                                                                        <div key={i} className="text-sm">
                                                                            {item.color}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : "—"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {variant.stockByAttribute?.length > 0 ? (
                                                                <div className="space-y-1 text-right">
                                                                    {variant.stockByAttribute.map((item, i) => (
                                                                        <div key={i} className="text-sm">
                                                                            {item.quantity}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : "—"}
                                                        </TableCell>

                                                        <TableCell className="text-right">
                                                            ${variant.price?.costPrice?.toFixed(2) || "0.00"}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            ${variant.price?.retailPrice?.toFixed(2) || "0.00"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => handleOpenEdit(variant)}
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => handleOpenQuantity(variant)}
                                                                title="Update Quantity"
                                                            >
                                                                <Plus className="h-3.5 w-3.5 text-blue-500" />
                                                            </Button>


                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {product.tags?.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag, i) => (
                                            <Badge key={i} variant="outline" className="px-3 py-1">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Description</h4>
                                    <div className="prose prose-sm max-w-none text-muted-foreground">
                                        {product.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>

                {/* Sticky footer */}
                <div className="absolute bottom-0 left-0 right-0 border-t bg-background px-6 py-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            onOpenChange(false);
                            onEdit(product);
                        }}
                    >
                        Edit Product
                    </Button>
                </div>

                {/* ─── Edit Variant Price Dialog ─── */}
                <Dialog open={!!editVariant} onOpenChange={() => setEditVariant(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Update Variant Price</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-cost">Cost Price</Label>
                                    <Input
                                        id="edit-cost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editPriceForm.costPrice}
                                        onChange={(e) =>
                                            setEditPriceForm((prev) => ({ ...prev, costPrice: e.target.value }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-retail">Retail Price</Label>
                                    <Input
                                        id="edit-retail"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editPriceForm.retailPrice}
                                        onChange={(e) =>
                                            setEditPriceForm((prev) => ({ ...prev, retailPrice: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setEditVariant(null)}>
                                Cancel
                            </Button>
                            <Button
                                disabled={isUpdating}
                                onClick={handleUpdatePriceSubmit}
                            >
                                {isUpdating ? "Saving..." : "Save Prices"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ─── Add New Variant Dialog ─── */}
                <Dialog open={addVariantOpen} onOpenChange={handleAddVariantClose}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Variant</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-5 py-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Size *</Label>
                                    <Input
                                        value={newVariant.size}
                                        onChange={(e) => setNewVariant((prev) => ({ ...prev, size: e.target.value }))}
                                        placeholder="e.g. S, M, L, 42"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label>Colors & Quantities *</Label>

                                    {newVariant.stockByAttribute.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end"
                                        >
                                            <Input
                                                placeholder="Color"
                                                value={item.color}
                                                onChange={(e) => handleColorChange(index, 'color', e.target.value)}
                                            />

                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="Quantity"
                                                value={item.quantity}
                                                onChange={(e) => handleColorChange(index, 'quantity', e.target.value)}
                                            />

                                            {newVariant.stockByAttribute.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveColorRow(index)}
                                                >
                                                    ✕
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddColorRow}
                                    >
                                        + Add another color
                                    </Button>
                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Cost Price *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={newVariant.costPrice}
                                        onChange={(e) => setNewVariant((prev) => ({ ...prev, costPrice: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Retail Price *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={newVariant.retailPrice}
                                        onChange={(e) => setNewVariant((prev) => ({ ...prev, retailPrice: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>
                               
                            </div>

                            <div className="space-y-2">
                                <Label>Variant SKU (optional)</Label>
                                <Input
                                    value={newVariant.variantSku}
                                    onChange={(e) => setNewVariant((prev) => ({ ...prev, variantSku: e.target.value }))}
                                    placeholder="Leave empty for auto-generation"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={handleAddVariantClose}>
                                Cancel
                            </Button>
                            <Button
                                disabled={isAdding}
                                onClick={handleAddVariantSubmit}
                            >
                                {isAdding ? "Adding..." : "Add Variant"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>


                {/* ─── Update Variant Quantity Dialog ─── */}
                <Dialog open={!!updateQuantityVariant} onOpenChange={() => setUpdateQuantityVariant(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Variant Quantity</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-5 py-5">
                            <div className="space-y-2">
                                <Label>Color *</Label>
                                <select
                                    className="w-full border rounded-md h-9 px-3 text-sm"
                                    value={quantityForm.color}
                                    onChange={(e) =>
                                        setQuantityForm((prev) => ({ ...prev, color: e.target.value }))
                                    }
                                >
                                    <option value="">Select color</option>
                                    {updateQuantityVariant?.stockByAttribute?.map((item, i) => (
                                        <option key={i} value={item.color}>
                                            {item.color} (Current: {item.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Quantity *</Label>
                                <Input
                                    type="number"
                                    step="1"
                                    value={quantityForm.quantityChange}
                                    onChange={(e) =>
                                        setQuantityForm((prev) => ({ ...prev, quantityChange: e.target.value }))
                                    }
                                    placeholder="e.g. 20 or -5"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Input
                                    value={quantityForm.reason}
                                    onChange={(e) =>
                                        setQuantityForm((prev) => ({ ...prev, reason: e.target.value }))
                                    }
                                    placeholder="Optional reason"
                                />
                            </div>
                        </div>


                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setUpdateQuantityVariant(null)}>
                                Cancel
                            </Button>
                            <Button
                                disabled={isUpdatingQuantity}
                                onClick={handleUpdateQuantitySubmit}
                            >
                                {isUpdatingQuantity ? "Saving..." : "Update Quantity"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </SheetContent>
        </Sheet>
    );
}