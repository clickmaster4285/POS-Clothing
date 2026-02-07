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
import { useUpdateVariantPrice, useAddVariant } from '@/hooks/inv_hooks/useProducts';
import { toast } from "sonner";


export default function ProductDetailSheet({
    isOpen,
    onOpenChange,
    product,
    onEdit,
}) {
    if (!product) return null;

    // ─── States ───
    const [editVariant, setEditVariant] = useState(null);
    const [addVariantOpen, setAddVariantOpen] = useState(false);

    // Form state for adding new variant
    const [newVariant, setNewVariant] = useState({
        size: '',
        color: '',
        costPrice: '',
        retailPrice: '',
        variantSku: '',
    });

    // Form state for editing price
    const [editPriceForm, setEditPriceForm] = useState({
        costPrice: '',
        retailPrice: '',
    });

    // ─── Mutations ───
    const { mutate: updatePrice, isPending: isUpdating } = useUpdateVariantPrice();
    const { mutate: addVariant, isPending: isAdding } = useAddVariant();

    // ─── Handlers ───

    const resetNewVariantForm = () => {
        setNewVariant({
            size: '',
            color: '',
            costPrice: '',
            retailPrice: '',
            variantSku: '',
        });
    };

    const handleAddVariantClose = () => {
        setAddVariantOpen(false);
        resetNewVariantForm();
    };

    const handleAddVariantSubmit = () => {
        const { size, color, costPrice, retailPrice, variantSku } = newVariant;

        // Validation
        if (!size.trim() || !color.trim() || !costPrice || !retailPrice) {
            toast.error("Size, Color, Cost Price and Retail Price are required.");
            return;
        }

        const cost = Number(costPrice);
        const retail = Number(retailPrice);

        if (isNaN(cost) || isNaN(retail) || cost < 0 || retail < 0) {
            toast.error("Please enter valid non-negative prices.");
            return;
        }

        // Construct payload
        const payload = {
           
           
            size: size.trim(),
            color: color.trim(),
            price: {
                costPrice: cost,
                retailPrice: retail,
            },
            variantSku: variantSku?.trim() || undefined,
        };



        // Send to API
        addVariant({ productId: product._id, data: payload }, {
            onSuccess: (res) => {
                toast.success("Variant added successfully");
                handleAddVariantClose(); // close modal/form
            },
            onError: (err) => {
                console.error("Failed to add variant:", err);
                toast.error("Failed to add variant");
            },
        });
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

        if (isNaN(cost) || isNaN(retail) || cost < 0 || retail < 0) {
            alert("Please enter valid non-negative prices.");
            return;
        }

        const payload = {
          
            costPrice: cost,
            retailPrice: retail,
        }
            
        updatePrice(
            {
                productId: product._id,
                variantId: editVariant._id,
           data:payload,
            },
            {
                onSuccess: () => {
                    setEditVariant(null);
                    // → invalidate / refetch product here too
                },
                onError: (err) => {
                    console.error("Failed to update variant price:", err);
                    // → show error toast
                },
            }
        );
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
                                                        <TableCell>{variant.color || "—"}</TableCell>
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
                                <div className="space-y-2">
                                    <Label>Color *</Label>
                                    <Input
                                        value={newVariant.color}
                                        onChange={(e) => setNewVariant((prev) => ({ ...prev, color: e.target.value }))}
                                        placeholder="e.g. Black, White, Navy"
                                    />
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
            </SheetContent>
        </Sheet>
    );
}