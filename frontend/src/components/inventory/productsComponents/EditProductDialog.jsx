import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUpdateProduct } from "@/hooks/inv_hooks/useProducts"


export default function EditProductDialog({
    isOpen,
    onOpenChange,
    product,
    categories,
    brands,
    refetchProducts
}) {
    const { toast } = useToast()
    const updateProductMutation = useUpdateProduct()

    const [formData, setFormData] = useState({
        productName: "",
        sku: "",
        barcode: "",
        brand: "",
        category: "",
        subCategory: "",
        department: "Unisex",
        description: "",
        isActive: true
    })

    useEffect(() => {
        if (product) {
            setFormData({
                productName: product.productName,
                sku: product.sku,
                barcode: product.barcode || "",
                brand: product.brand?._id || "",
                category: product.category?._id || "",
                subCategory: product.subCategory?._id || "",
                department: product.department,
                description: product.description || "",
                isActive: product.isActive
            })
        }
    }, [product])

    const resetForm = () => {
        setFormData({
            productName: "",
            sku: "",
            barcode: "",
            brand: "",
            category: "",
            subCategory: "",
            department: "Unisex",
            description: "",
            isActive: true
        })
    }

    const handleEditProduct = async () => {
        if (!product) return

        try {
            const updateData = {
                productName: formData.productName,
                sku: formData.sku,
                barcode: formData.barcode,
                brand: formData.brand,
                category: formData.category,
                subCategory: formData.subCategory || undefined,
                department: formData.department,
                description: formData.description || undefined,
                isActive: formData.isActive
            }

            await updateProductMutation.mutateAsync({
                id: product._id,
                ...updateData
            })

            toast({
                title: "Success",
                description: "Product updated successfully",
            })

            onOpenChange(false)
            resetForm()
            refetchProducts()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive",
            })
        }
    }

    if (!product) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="editProductName">Product Name *</Label>
                            <Input
                                id="editProductName"
                                value={formData.productName}
                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editSku">SKU *</Label>
                            <Input
                                id="editSku"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.categoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Brand</Label>
                            <Select
                                value={formData.brand}
                                onValueChange={(value) => setFormData({ ...formData, brand: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="editBarcode">Barcode</Label>
                        <Input
                            id="editBarcode"
                            value={formData.barcode}
                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Select
                            value={formData.department}
                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Men">Men</SelectItem>
                                <SelectItem value="Women">Women</SelectItem>
                                <SelectItem value="Kids">Kids</SelectItem>
                                <SelectItem value="Unisex">Unisex</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="editDescription">Description</Label>
                        <Textarea
                            id="editDescription"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="editIsActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                        <Label htmlFor="editIsActive">Active Product</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => {
                        onOpenChange(false)
                        resetForm()
                    }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditProduct}
                        disabled={updateProductMutation.isLoading}
                    >
                        {updateProductMutation.isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}