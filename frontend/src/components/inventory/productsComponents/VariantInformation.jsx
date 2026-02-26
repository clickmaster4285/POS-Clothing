import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { SupplierFormDialog } from "@/components/suppliers/supplier-form-dialog";
import { useCreateSupplier } from "@/hooks/useSupplier";

export default function VariantInformation({
    formData,
    setFormData,
    productToEdit,
    suppliers,
}) {
    const variants = formData.variants || [];

    // ─── Supplier Dialog State ─────────────────────────────
    const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
    const [currentVariantIndex, setCurrentVariantIndex] = useState(null); // which variant triggered add supplier
    const [localSuppliers, setLocalSuppliers] = useState(suppliers || []);
    const createSupplierMutation = useCreateSupplier();

    const openAddSupplierDialog = (vIndex) => {
        setCurrentVariantIndex(vIndex);
        setSupplierDialogOpen(true);
    };



    // whenever parent suppliers changes, update localSuppliers
    useEffect(() => {
        setLocalSuppliers(suppliers || []);
    }, [suppliers]);


    const handleAddSupplier = async (newSupplierData) => {
        try {
            const savedSupplier = await createSupplierMutation.mutateAsync(newSupplierData);

            // 1️⃣ update local suppliers list so dropdown shows it immediately
            setLocalSuppliers(prev => [...prev, savedSupplier]);

            // 2️⃣ auto-select the new supplier for the current variant
            if (currentVariantIndex !== null) {
                setFormData(prev => {
                    const newVariants = [...prev.variants];
                    newVariants[currentVariantIndex] = {
                        ...newVariants[currentVariantIndex],
                        supplier: savedSupplier._id
                    };
                    return { ...prev, variants: newVariants };
                });
            }
        } catch (err) {
            console.error("Failed to create supplier", err);
        } finally {
            setSupplierDialogOpen(false);
        }
    };


    // ─── Add / Remove Variant ───────────────────────────────
    const addVariant = () => {
        const newVariant = {
            size: "",
            style: "",
            fitType: "",
            length: "",
            variantSku: "",
            variantBarcode: "",
            costPrice: "",
            retailPrice: "",
            images: [],
            supplier: "",
            stockByAttribute: [{ color: "", quantity: "" }],
        };
        setFormData((prev) => ({
            ...prev,
            variants: [...(prev.variants || []), newVariant],
        }));
    };

    const removeVariant = (index) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }));
    };

    // ─── Update Variant Field ───────────────────────────────
    const updateVariant = (vIndex, field, value) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[vIndex] = { ...newVariants[vIndex], [field]: value };
            return { ...prev, variants: newVariants };
        });
    };

    // ─── Stock by Attribute Handlers ────────────────────────
    const addStockAttribute = (vIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[vIndex].stockByAttribute.push({ color: "", quantity: "" });
            return { ...prev, variants: newVariants };
        });
    };

    const removeStockAttribute = (vIndex, sIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[vIndex].stockByAttribute.splice(sIndex, 1);
            return { ...prev, variants: newVariants };
        });
    };

    const updateStockAttribute = (vIndex, sIndex, field, value) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[vIndex].stockByAttribute[sIndex][field] = value;
            return { ...prev, variants: newVariants };
        });
    };

    return (
        <>
            <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Variants</CardTitle>
                    <Button type="button" onClick={addVariant} size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Add Variant
                    </Button>
                </CardHeader>

                <CardContent className="space-y-8">
                    {variants.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No variants added yet. Click "Add Variant" to start.
                        </div>
                    ) : (
                        variants.map((variant, vIndex) => (
                            <Card key={vIndex} className="bg-muted/40">
                                <CardHeader className="pb-2 flex-row justify-between items-center">
                                    <CardTitle className="text-base">
                                        Variant {vIndex + 1}
                                        {variant.size || variant.variantSku ? (
                                            <span className="text-muted-foreground ml-2 text-sm">
                                                {variant.size || variant.variantSku}
                                            </span>
                                        ) : null}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeVariant(vIndex)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-2">
                                    {/* Variant Attributes */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Size</Label>
                                            <Input
                                                value={variant.size}
                                                onChange={(e) =>
                                                    updateVariant(vIndex, "size", e.target.value)
                                                }
                                                placeholder="S, M, L..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Style</Label>
                                            <Input
                                                value={variant.style}
                                                onChange={(e) =>
                                                    updateVariant(vIndex, "style", e.target.value)
                                                }
                                                placeholder="Slim Fit, Regular..."
                                            />
                                        </div>
                                    </div>

                                    {/* Stock By Attribute */}
                                    <div>    <div className="space-y-2 mt-2">
                                        <Label>Color / Quantity</Label>
                                        {variant.stockByAttribute.map((stock, sIndex) => (
                                            <div key={sIndex} className="flex gap-2 items-center mb-2">
                                                <Input
                                                    placeholder="Color"
                                                    value={stock.color}
                                                    onChange={(e) =>
                                                        updateStockAttribute(
                                                            vIndex,
                                                            sIndex,
                                                            "color",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={stock.quantity}
                                                    onChange={(e) =>
                                                        updateStockAttribute(
                                                            vIndex,
                                                            sIndex,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeStockAttribute(vIndex, sIndex)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}

                                    </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => addStockAttribute(vIndex)}
                                            className="mt-2"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add Color
                                        </Button></div>

                                    {/* Pricing */}
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="space-y-2">
                                            <Label>Variant SKU</Label>
                                            <Input
                                                value={variant.variantSku}
                                                onChange={(e) =>
                                                    updateVariant(vIndex, "variantSku", e.target.value)
                                                }
                                                placeholder="Auto-generated if empty"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Cost Price *</Label>
                                            <Input
                                                type="number"
                                                value={variant.costPrice}
                                                placeholder="0.00"
                                                onChange={(e) =>
                                                    updateVariant(vIndex, "costPrice", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Retail Price *</Label>
                                            <Input
                                                type="number"
                                                value={variant.retailPrice}
                                                placeholder="0.00"
                                                onChange={(e) =>
                                                    updateVariant(vIndex, "retailPrice", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Supplier */}
                                    <div className="space-y-2 mt-2">
                                        <Label>Supplier</Label>
                                        <Select
                                            value={variant.supplier || ""}
                                            onValueChange={(value) => {
                                                if (value === "__add_new_supplier__") {
                                                    openAddSupplierDialog(vIndex);
                                                } else {
                                                    updateVariant(vIndex, "supplier", value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {localSuppliers.map((s) => (
                                                    <SelectItem key={s._id} value={s._id}>
                                                        {s.company_name}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="__add_new_supplier__">+ Add New Supplier</SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Supplier Form Dialog */}
            <SupplierFormDialog
                open={supplierDialogOpen}
                onOpenChange={setSupplierDialogOpen}
                supplier={null}
                onSubmit={handleAddSupplier}
                isSubmitting={createSupplierMutation.isLoading}
            />
        </>
    );
}
