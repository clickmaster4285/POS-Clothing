import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"



export default function VariantInformation({
    showVariantSection,
    setShowVariantSection,
    formData,
    setFormData,
    pricingTiers,
    onAddPricingTier,
    onRemovePricingTier,
    onUpdatePricingTier
}) {
    return (
        <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Variant Information</CardTitle>
                <Switch
                    checked={showVariantSection}
                    onCheckedChange={setShowVariantSection}
                />
            </CardHeader>
            {showVariantSection && (
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="size">Size</Label>
                            <Input
                                id="size"
                                value={formData.variant.size}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    variant: { ...formData.variant, size: e.target.value }
                                })}
                                placeholder="e.g., S, M, L"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                                id="color"
                                value={formData.variant.color}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    variant: { ...formData.variant, color: e.target.value }
                                })}
                                placeholder="e.g., Black, White"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="variantSku">Variant SKU</Label>
                            <Input
                                id="variantSku"
                                value={formData.variant.variantSku}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    variant: { ...formData.variant, variantSku: e.target.value }
                                })}
                                placeholder="Auto-generated if empty"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="variantBarcode">Variant Barcode</Label>
                            <Input
                                id="variantBarcode"
                                value={formData.variant.variantBarcode}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    variant: { ...formData.variant, variantBarcode: e.target.value }
                                })}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium">Pricing</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="costPrice">Cost Price *</Label>
                                <Input
                                    id="costPrice"
                                    type="number"
                                    value={formData.variant.costPrice}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        variant: { ...formData.variant, costPrice: e.target.value }
                                    })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="retailPrice">Retail Price *</Label>
                                <Input
                                    id="retailPrice"
                                    type="number"
                                    value={formData.variant.retailPrice}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        variant: { ...formData.variant, retailPrice: e.target.value }
                                    })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="wholesalePrice">Wholesale Price</Label>
                                <Input
                                    id="wholesalePrice"
                                    type="number"
                                    value={formData.variant.wholesalePrice}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        variant: { ...formData.variant, wholesalePrice: e.target.value }
                                    })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="memberPrice">Member Price</Label>
                                <Input
                                    id="memberPrice"
                                    type="number"
                                    value={formData.variant.memberPrice}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        variant: { ...formData.variant, memberPrice: e.target.value }
                                    })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salePrice">Sale Price</Label>
                                <Input
                                    id="salePrice"
                                    type="number"
                                    value={formData.variant.salePrice}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        variant: { ...formData.variant, salePrice: e.target.value }
                                    })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Tiers */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Pricing Tiers</h4>
                            <Button type="button" variant="outline" size="sm" onClick={onAddPricingTier}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Tier
                            </Button>
                        </div>
                        {pricingTiers.map((tier, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label>Min Quantity</Label>
                                    <Input
                                        type="number"
                                        value={tier.minQuantity}
                                        onChange={(e) => onUpdatePricingTier(index, 'minQuantity', e.target.value)}
                                        placeholder="Minimum quantity"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        value={tier.price}
                                        onChange={(e) => onUpdatePricingTier(index, 'price', e.target.value)}
                                        placeholder="Price"
                                    />
                                </div>
                                {pricingTiers.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="mt-6"
                                        onClick={() => onRemovePricingTier(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}