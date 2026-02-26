// src/pages/inventory/ProductDetailPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import {
    Edit,
    Plus,
    Pencil,
    ArrowLeft,
    Loader2,
    Package,
    Layers
} from "lucide-react";
import { useUpdateVariantPrice, useAddVariant, useAddVariantQuantity, useProduct } from '@/hooks/inv_hooks/useProducts';
import { toast } from "sonner";

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: productRaw, isLoading, refetch } = useProduct(id);
    const product = productRaw?.data;


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

        if (!size || !size.trim() || costPrice === '' || retailPrice === '') {
            toast.error("Size, Cost Price and Retail Price are required.");
            return;
        }

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

        const cost = Number(costPrice);
        const retail = Number(retailPrice);

        if (isNaN(cost) || isNaN(retail) || cost < 0 || retail < 0) {
            toast.error("Please enter valid non-negative prices.");
            return;
        }

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

        addVariant(
            {
                productId: product._id,
                data: payload,
            },
            {
                onSuccess: () => {
                    toast.success("Variant added successfully");
                    refetch();
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

        if (isNaN(cost) || isNaN(retail) || cost < 0 || retail < 0) {
            toast.error("Please enter valid non-negative prices.");
            return;
        }

        const payload = {
            costPrice: cost,
            retailPrice: retail,
        };

        updatePrice(
            {
                productId: product._id,
                variantId: editVariant._id,
                data: payload,
            },
            {
                onSuccess: () => {
                    toast.success("Variant price updated successfully");
                    refetch();
                    setEditVariant(null);
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
                    refetch();
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

    const handleEditProduct = () => {
        navigate(`/inventory/products/edit/${id}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <p className="text-muted-foreground mb-4">Product not found</p>
                <Button onClick={() => navigate('/inventory/products')}>
                    Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header with back button and actions */}
                <div className="mb-8 flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="h-10 w-10 shrink-0 hover:bg-card hover:text-primary "
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                                        {product.productName}
                                    </h1>
                                    <Badge
                                        className={`px-3 py-1 text-xs font-medium border-0 ${product.isActive
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                            }`}
                                    >
                                        {product.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">SKU:</span>
                                        <code className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-mono text-xs border border-slate-200 dark:border-slate-700">
                                            {product.sku}
                                        </code>
                                    </div>
                                 
                                </div>
                            </div>

                          
                        </div>
                    </div>
                </div>

   

                {/* Main content */}
                <div className="space-y-8">
                    {/* Product Overview Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                               

                                {/* Quick Info Grid */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-1 h-4 bg-blue-500 rounded-full" />
                                            Category
                                        </p>
                                        <p className="text-lg font-semibold">{product.category?.categoryName || "—"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-1 h-4 bg-indigo-500 rounded-full" />
                                            Brand
                                        </p>
                                        <p className="text-lg font-semibold">{product.brand?.brandName || "—"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                                            Total Variants
                                        </p>
                                        <p className="text-lg font-semibold">{product.variants?.length || 0}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-1 h-4 bg-amber-500 rounded-full" />
                                            Stock Status
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {product.variants?.some(v =>
                                                v.stockByAttribute?.some(s => s.quantity < 10)
                                            ) ? (
                                                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                                                    In Stock
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Attributes */}
                            {(product.season || product.material || product.countryOfOrigin) && (
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {product.season && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                                    <span className="w-1 h-4 bg-purple-500 rounded-full" />
                                                    Season
                                                </p>
                                                <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                                                    {product.season}
                                                </p>
                                            </div>
                                        )}

                                        {product.material && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                                                    Material
                                                </p>
                                                <p className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                                                    {product.material}
                                                </p>
                                            </div>
                                        )}

                                        {product.countryOfOrigin && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                                    <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                                                    Country of Origin
                                                </p>
                                                <p className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                                                    {product.countryOfOrigin}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Variants Section */}
                    {product.variants?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h4 className="text-xl font-semibold flex items-center gap-2">
                                            <Layers className="h-5 w-5 text-blue-500" />
                                            Product Variants
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Manage sizes, colors, pricing and inventory levels
                                        </p>
                                    </div>
                                    <Button
                                        size="default"
                                        onClick={() => setAddVariantOpen(true)}
                                       
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Variant
                                    </Button>
                                </div>

                                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                            <TableRow>
                                                <TableHead className="font-semibold">Variant SKU</TableHead>
                                                <TableHead className="font-semibold">Size</TableHead>
                                                <TableHead className="font-semibold">Colors</TableHead>
                                                <TableHead className="font-semibold text-right">Quantities</TableHead>
                                                <TableHead className="font-semibold text-right">Cost Price</TableHead>
                                                <TableHead className="font-semibold text-right">Retail Price</TableHead>
                                                <TableHead className="font-semibold text-right w-[100px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {product.variants.map((variant, idx) => (
                                                <TableRow key={variant._id || idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <TableCell>
                                                        <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-mono text-xs">
                                                            {variant.variantSku || product.sku}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-medium border-slate-200 dark:border-slate-700">
                                                            {variant.size || "—"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {variant.stockByAttribute?.length > 0 ? (
                                                            <div className="flex flex-col gap-1.5">
                                                                {variant.stockByAttribute.map((item, i) => (
                                                                    <div key={i} className="flex items-center gap-2">
                                                                        <div
                                                                            className="w-3 h-3 rounded-full border border-slate-200 dark:border-slate-700"
                                                                            style={{ backgroundColor: item.color.toLowerCase() }}
                                                                        />
                                                                        <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800">
                                                                            {item.color}
                                                                        </Badge>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {variant.stockByAttribute?.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {variant.stockByAttribute.map((item, i) => (
                                                                    <div key={i} className="text-sm font-medium">
                                                                        {item.quantity}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        <span className="text-slate-600 dark:text-slate-400">
                                                            ${variant.price?.costPrice?.toFixed(2) || "0.00"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="font-semibold text-primary ">
                                                            ${variant.price?.retailPrice?.toFixed(2) || "0.00"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                onClick={() => handleOpenEdit(variant)}
                                                            >
                                                                <Pencil className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                                onClick={() => handleOpenQuantity(variant)}
                                                            >
                                                                <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tags & Description Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-purple-500 rounded-full" />
                                    Tags
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, i) => (
                                        <Badge
                                            key={i}
                                            variant="outline"
                                            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className={`${product.tags?.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6`}>
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full" />
                                    Description
                                </h4>
                                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                                    {product.description}
                                </div>
                            </div>
                        )}
                    </div>
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
            </div>
        </div>
    );
}