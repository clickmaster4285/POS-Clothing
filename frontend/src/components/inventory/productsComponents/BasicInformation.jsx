import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Package, RefreshCcw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandFormDialog } from "@/components/inventory/categoryAndBrands/BrandFormDialog"
import { CategoryFormDialog } from "@/components/inventory/categoryAndBrands/CategoryFormDialog"

import { useState } from "react"
import { useCreateCategory } from "@/hooks/inv_hooks/useCategory"
import { useCreateBrand } from "@/hooks/inv_hooks/useBrand"
import { toast } from "sonner"

// Default form values
const defaultBrandForm = {
    brandName: "",
    brandCode: "",
    website: "",
    countryOfOrigin: "",
    description: "",
    logo: null,
    logoPreview: "",
    isActive: true
}

const defaultCategoryForm = {
    categoryName: "",
    categoryCode: "",
    department: "",
    description: "",
    image: null,
    imagePreview: "",
    attributes: []
}

export default function BasicInformation({
    formData = {
        productName: "",
        sku: "",
        category: "",
        brand: "",
        gender: "",
        description: ""
    },
    setFormData = () => { },
    categories = [],
    brands = []
}) {
    const [showBrandDialog, setShowBrandDialog] = useState(false)
    const [showCategoryDialog, setShowCategoryDialog] = useState(false)

    // Local state for forms
    const [brandForm, setBrandForm] = useState(defaultBrandForm)
    const [categoryForm, setCategoryForm] = useState(defaultCategoryForm)

    // Hooks for mutations
    const createCategoryMutation = useCreateCategory()
    const createBrandMutation = useCreateBrand()

    const handleAutoGenerateSKU = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000)
        const sku = `PROD${randomNumber}`
        setFormData({ ...formData, sku })
    }

    // Handle brand logo upload
    const handleBrandLogoUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        setBrandForm(prev => ({
            ...prev,
            logo: file,
            logoPreview: previewUrl
        }))
    }

    // Handle category image upload
    const handleCategoryImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        setCategoryForm(prev => ({
            ...prev,
            image: file,
            imagePreview: previewUrl
        }))
    }

    // Handle add brand
    const handleAddBrand = async () => {
        if (!brandForm.brandName) {
            toast.error("Brand name is required")
            return
        }

        try {
            // Create FormData for API
            const formData = new FormData()
            formData.append("brandName", brandForm.brandName)
            formData.append("brandCode", brandForm.brandCode)
            formData.append("website", brandForm.website || "")
            formData.append("countryOfOrigin", brandForm.countryOfOrigin || "")
            formData.append("description", brandForm.description || "")
            formData.append("isActive", brandForm.isActive)

            if (brandForm.logo) {
                formData.append("logo", brandForm.logo)
            }

            // Call API
            await createBrandMutation.mutateAsync(formData)

            toast.success("Brand created successfully")
            setShowBrandDialog(false)
            setBrandForm(defaultBrandForm)

            // Categories will be auto-refreshed by React Query
        } catch (error) {
            console.error("Error creating brand:", error)
            toast.error(error.response?.data?.message || "Failed to create brand")
        }
    }

 
    const handleAddCategory = async () => {
        if (!categoryForm.categoryName) {
            toast.error("Category name is required")
            return
        }

        try {
            // Create FormData for API
            const formData = new FormData()
            formData.append("categoryName", categoryForm.categoryName)
            formData.append("categoryCode", categoryForm.categoryCode)
            formData.append("department", categoryForm.department || "")
            formData.append("description", categoryForm.description || "")

            // Explicitly set isActive to true
            formData.append("isActive", true) // Send as boolean
            // OR if backend expects number:
            // formData.append("isActive", 1)

            if (categoryForm.image) {
                formData.append("image", categoryForm.image)
            }

            // Add attributes if any
            if (categoryForm.attributes && categoryForm.attributes.length > 0) {
                formData.append("attributes", JSON.stringify(categoryForm.attributes))
            }

            // Call API
            await createCategoryMutation.mutateAsync(formData)

            toast.success("Category created successfully")
            setShowCategoryDialog(false)
            setCategoryForm(defaultCategoryForm)

        } catch (error) {
            console.error("Error creating category:", error)
            toast.error(error.response?.data?.message || "Failed to create category")
        }
    }
    return (
        <>
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="h-5 w-5 text-primary" />
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productName">Product Name *</Label>
                            <Input
                                id="productName"
                                value={formData?.productName || ""}
                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                placeholder="Enter product name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="sku"
                                    value={formData?.sku || ""}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    placeholder="Enter SKU"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAutoGenerateSKU}
                                    className="flex items-center gap-1"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Auto
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Category *</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCategoryDialog(true)}
                                    className="h-7 px-2 text-primary"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    New Category
                                </Button>
                            </div>
                            <Select
                                value={formData?.category || ""}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(categories) && categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.categoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Brand *</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowBrandDialog(true)}
                                    className="h-7 px-2 text-primary"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    New Brand
                                </Button>
                            </div>
                            <Select
                                value={formData?.brand || ""}
                                onValueChange={(value) => setFormData({ ...formData, brand: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(brands) && brands.map((brand) => (
                                        <SelectItem key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select
                                value={formData?.gender || ""}
                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Unisex">Unisex</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData?.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter product description"
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Brand Dialog */}
            <BrandFormDialog
                isOpen={showBrandDialog}
                onOpenChange={setShowBrandDialog}
                brandForm={brandForm}
                setBrandForm={setBrandForm}
                isEditMode={false}
                isUploading={createBrandMutation.isPending}
                categories={categories}
                handleAddBrand={handleAddBrand}
                handleBrandLogoUpload={handleBrandLogoUpload}
            />

            {/* Category Dialog */}
            <CategoryFormDialog
                isOpen={showCategoryDialog}
                onOpenChange={setShowCategoryDialog}
                categoryForm={categoryForm}
                setCategoryForm={setCategoryForm}
                isEditMode={false}
                isUploading={createCategoryMutation.isPending}
                parentCategories={categories}
                categories={categories}
                handleAddCategory={handleAddCategory}
                handleCategoryImageUpload={handleCategoryImageUpload}
                handleAddAttribute={() => { }}
                handleRemoveAttribute={() => { }}
                handleAttributeChange={() => { }}
                handleAddOption={() => { }}
                handleOptionChange={() => { }}
                handleRemoveOption={() => { }}
            />
        </>
    )
}