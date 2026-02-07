import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

export default function VariantInformation({
    formData,
    setFormData,
    productToEdit
}) {
    const variants = formData.variants || []

    const addVariant = () => {
        const newVariant = {
            size: "",
            color: "",
            style: "",
            fitType: "",
            length: "",
            variantSku: "",
            variantBarcode: "",
            costPrice: "",
            retailPrice: "",
            wholesalePrice: "",
            memberPrice: "",
            salePrice: "",
            minimumPrice: "",
            maxDiscountPercent: "",
            images: [],
            // pricingTiers removed
        }

        setFormData((prev) => ({
            ...prev,
            variants: [...(prev.variants || []), newVariant],
        }))
    }

    const removeVariant = (index) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }))
    }

    const updateVariant = (index, field, value) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants]
            newVariants[index] = { ...newVariants[index], [field]: value }
            return { ...prev, variants: newVariants }
        })
    }

    return (
        <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Variants</CardTitle>
                <Button type="button" onClick={addVariant} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
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
                                    {variant.size || variant.color ? (
                                        <span className="text-muted-foreground ml-2 text-sm">
                                            {variant.size && variant.color
                                                ? `${variant.size} / ${variant.color}`
                                                : variant.size || variant.color}
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

                            <CardContent className="space-y-6 pt-2">
                                {/* Attributes */}
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Size</Label>
                                        <Input
                                            value={variant.size}
                                            onChange={(e) => updateVariant(vIndex, "size", e.target.value)}
                                            placeholder="S, M, L, XL..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color</Label>
                                        <Input
                                            value={variant.color}
                                            onChange={(e) => updateVariant(vIndex, "color", e.target.value)}
                                            placeholder="Black, Red, Navy..."
                                        />
                                    </div>
                                    {/* Uncomment / add more if you need them later
                                    <div className="space-y-2">
                                        <Label>Style</Label>
                                        <Input value={variant.style} onChange={...} />
                                    </div>
                                    */}
                                </div>

                                {/* SKU / Barcode */}
                                {/* <div className="grid grid-cols-2 gap-4">
                               
                                    <div className="space-y-2">
                                        <Label>Variant Barcode</Label>
                                        <Input
                                            value={variant.variantBarcode}
                                            onChange={(e) => updateVariant(vIndex, "variantBarcode", e.target.value)}
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div> */}

                                {/* Pricing */}
                                <div className="space-y-4">
                                   
                                    <div className="grid grid-cols-3 md:grid-cols-2 gap-4">

                                        {productToEdit &&   <div className="space-y-2">
                                            <Label>Variant SKU</Label>
                                            <Input
                                                value={variant.variantSku}
                                                onChange={(e) => updateVariant(vIndex, "variantSku", e.target.value)}
                                                placeholder="Auto-generated if empty"
                                            />
                                        </div>}

                                        
                                        <div className="space-y-2">
                                            <Label>Quantity</Label>
                                            <Input
                                                type="number"
                                                value={variant.quantity}
                                                onChange={(e) => updateVariant(vIndex, "quantity", e.target.value)}
                                                placeholder="1"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Cost Price *</Label>
                                            <Input
                                                type="number"
                                                value={variant.costPrice}
                                                onChange={(e) => updateVariant(vIndex, "costPrice", e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Retail Price *</Label>
                                            <Input
                                                type="number"
                                                value={variant.retailPrice}
                                                onChange={(e) => updateVariant(vIndex, "retailPrice", e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>

                                        {/* Add the rest when you're ready
                                        <div className="space-y-2">
                                            <Label>Wholesale Price</Label>
                                            <Input type="number" ... />
                                        </div>
                                        */}
                                    </div>
                                </div>

                                {/* Pricing Tiers section → completely removed */}
                            </CardContent>
                        </Card>
                    ))
                )}
            </CardContent>
        </Card>
    )
}