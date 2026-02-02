import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
    Package,
    Plus,
    Upload,
    X,
    CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCreateProduct } from "@/hooks/inv_hooks/useProducts"
import BasicInformation from "./BasicInformation"
import AdditionalInformation from "./AdditionalInformation"
import ImagesSection from "./ImagesSection"
import VariantInformation from "./VariantInformation"
import SupplierInformation from "./SupplierInformation"
import TagsSection from "./TagsSection"
import SummarySection from "./SummarySection"


export default function AddProductTab({
    categories,
    brands,
    suppliers,
    refetchProducts,
    onTabChange
}) {
    const { toast } = useToast()
    const [imagePreviews, setImagePreviews] = useState([])
    const [showVariantSection, setShowVariantSection] = useState(false)
    const [tagInput, setTagInput] = useState("")

    const createProductMutation = useCreateProduct()

    const [formData, setFormData] = useState({
        productName: "",
        sku: "",
        barcode: "",
        brand: "",
        category: "",
        subCategory: "",
        department: "Unisex",
        season: "",
        collection: "",
        description: "",
        longDescription: "",
        careInstructions: "",
        material: "",
        countryOfOrigin: "",
        ageGroup: "",
        gender: "",
        styleType: "",
        occasion: "",
        primaryImage: "",
        tags: [],
        supplier: {
            supplier: "",
            supplierCode: "",
            leadTime: "",
            minOrderQuantity: "",
            reorderLevel: ""
        },
        variant: {
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
            images: []
        },
        pricingTiers: [{ minQuantity: "", price: "" }],
        isActive: true
    })

    const resetForm = () => {
        setFormData({
            productName: "",
            sku: "",
            barcode: "",
            brand: "",
            category: "",
            subCategory: "",
            department: "Unisex",
            season: "",
            collection: "",
            description: "",
            longDescription: "",
            careInstructions: "",
            material: "",
            countryOfOrigin: "",
            ageGroup: "",
            gender: "",
            styleType: "",
            occasion: "",
            primaryImage: "",
            tags: [],
            supplier: {
                supplier: "",
                supplierCode: "",
                leadTime: "",
                minOrderQuantity: "",
                reorderLevel: ""
            },
            variant: {
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
                images: []
            },
            pricingTiers: [{ minQuantity: "", price: "" }],
            isActive: true
        })
        setImagePreviews([])
        setTagInput("")
        setShowVariantSection(false)
    }

    const handleImageUpload = (e, isVariant) => {
        const files = e.target.files
        if (!files) return

        const newPreviews = []
        const newFiles = []

        Array.from(files).forEach(file => {
            const previewUrl = URL.createObjectURL(file)
            newPreviews.push(previewUrl)
            newFiles.push(file)
        })

        if (isVariant) {
            setFormData(prev => ({
                ...prev,
                variant: {
                    ...prev.variant,
                    images: [...prev.variant.images, ...newFiles]
                }
            }))
            setImagePreviews(prev => [...prev, ...newPreviews])
        } else {
            // For primary image
            if (newFiles[0]) {
                setFormData(prev => ({ ...prev, primaryImage: newFiles[0].name }))
            }
        }
    }

    const removeImage = (index) => {
        const newImages = [...formData.variant.images]
        const newPreviews = [...imagePreviews]

        URL.revokeObjectURL(newPreviews[index])
        newImages.splice(index, 1)
        newPreviews.splice(index, 1)

        setFormData(prev => ({
            ...prev,
            variant: { ...prev.variant, images: newImages }
        }))
        setImagePreviews(newPreviews)
    }

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }))
            setTagInput("")
        }
    }

    const removeTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }))
    }

    const addPricingTier = () => {
        setFormData(prev => ({
            ...prev,
            pricingTiers: [...prev.pricingTiers, { minQuantity: "", price: "" }]
        }))
    }

    const removePricingTier = (index) => {
        if (formData.pricingTiers.length > 1) {
            const newTiers = [...formData.pricingTiers]
            newTiers.splice(index, 1)
            setFormData(prev => ({ ...prev, pricingTiers: newTiers }))
        }
    }

    const updatePricingTier = (index, field, value) => {
        const newTiers = [...formData.pricingTiers]
        newTiers[index][field] = value
        setFormData(prev => ({ ...prev, pricingTiers: newTiers }))
    }

    const handleAddProduct = async () => {
        try {
            // Prepare product data based on model
            const productData = {
                productName: formData.productName,
                sku: formData.sku,
                barcode: formData.barcode,
                brand: formData.brand,
                category: formData.category,
                subCategory: formData.subCategory || undefined,
                department: formData.department,
                season: formData.season || undefined,
                collection: formData.collection || undefined,
                description: formData.description || undefined,
                longDescription: formData.longDescription || undefined,
                careInstructions: formData.careInstructions || undefined,
                material: formData.material || undefined,
                countryOfOrigin: formData.countryOfOrigin || undefined,
                ageGroup: formData.ageGroup || undefined,
                gender: formData.gender || undefined,
                styleType: formData.styleType || undefined,
                occasion: formData.occasion || undefined,
                primaryImage: formData.primaryImage || undefined,
                images: imagePreviews.map((preview, index) => ({
                    url: preview, // In real app, upload to server first
                    type: 'front',
                    order: index
                })),
                tags: formData.tags.length > 0 ? formData.tags : undefined,
                supplierInfo: formData.supplier.supplier ? {
                    supplier: formData.supplier.supplier,
                    supplierCode: formData.supplier.supplierCode || undefined,
                    leadTime: parseInt(formData.supplier.leadTime) || undefined,
                    minOrderQuantity: parseInt(formData.supplier.minOrderQuantity) || undefined,
                    reorderLevel: parseInt(formData.supplier.reorderLevel) || undefined
                } : undefined,
                variants: showVariantSection ? [{
                    size: formData.variant.size || undefined,
                    color: formData.variant.color || undefined,
                    style: formData.variant.style || undefined,
                    fitType: formData.variant.fitType || undefined,
                    length: formData.variant.length || undefined,
                    variantSku: formData.variant.variantSku || undefined,
                    variantBarcode: formData.variant.variantBarcode || undefined,
                    images: formData.variant.images.map(file => file.name), // Upload to server first
                    price: {
                        costPrice: parseFloat(formData.variant.costPrice) || 0,
                        retailPrice: parseFloat(formData.variant.retailPrice) || 0,
                        wholesalePrice: parseFloat(formData.variant.wholesalePrice) || undefined,
                        memberPrice: parseFloat(formData.variant.memberPrice) || undefined,
                        salePrice: parseFloat(formData.variant.salePrice) || undefined,
                        minimumPrice: parseFloat(formData.variant.minimumPrice) || undefined,
                        maxDiscountPercent: parseFloat(formData.variant.maxDiscountPercent) || undefined
                    },
                    pricingTiers: formData.pricingTiers
                        .filter(tier => tier.minQuantity && tier.price)
                        .map(tier => ({
                            minQuantity: parseInt(tier.minQuantity),
                            price: parseFloat(tier.price)
                        })),
                    isActive: true
                }] : [],
                isActive: formData.isActive
            }

            await createProductMutation.mutateAsync(productData)

            toast({
                title: "Success",
                description: "Product created successfully",
            })

            resetForm()
            onTabChange("product-list")
            refetchProducts()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create product",
                variant: "destructive",
            })
        }
    }

    const formSummary = {
        category: categories.find((c) => c._id === formData.category)?.categoryName || "Not selected",
        brand: brands.find((b) => b._id === formData.brand)?.brandName || "Not selected",
        margin: formData.variant.costPrice && formData.variant.retailPrice
            ? (((parseFloat(formData.variant.retailPrice) - parseFloat(formData.variant.costPrice)) / parseFloat(formData.variant.retailPrice)) * 100).toFixed(1)
            : "0",
        isValid: formData.productName && formData.sku && formData.category && formData.brand,
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
                <ImagesSection
                    formData={formData}
                    setFormData={setFormData}
                    imagePreviews={imagePreviews}
                    onImageUpload={handleImageUpload}
                    onRemoveImage={removeImage}
                />
                <BasicInformation
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    brands={brands}
                />

                <AdditionalInformation
                    formData={formData}
                    setFormData={setFormData}
                />

              

                <VariantInformation
                    showVariantSection={showVariantSection}
                    setShowVariantSection={setShowVariantSection}
                    formData={formData}
                    setFormData={setFormData}
                    pricingTiers={formData.pricingTiers}
                    onAddPricingTier={addPricingTier}
                    onRemovePricingTier={removePricingTier}
                    onUpdatePricingTier={updatePricingTier}
                />

                <SupplierInformation
                    formData={formData}
                    setFormData={setFormData}
                    suppliers={suppliers}
                />

                <TagsSection
                    formData={formData}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    onAddTag={addTag}
                    onRemoveTag={removeTag}
                />

                <div className="flex gap-3">
                    <Button variant="outline" onClick={resetForm} className="bg-transparent">
                        Clear Form
                    </Button>
                    <Button
                        onClick={handleAddProduct}
                        disabled={!formSummary.isValid || createProductMutation.isLoading}
                    >
                        {createProductMutation.isLoading ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            {/* Summary Section */}
            <div className="space-y-4">
                <SummarySection
                    formSummary={formSummary}
                    showVariantSection={showVariantSection}
                />
            </div>
        </div>
    )
}