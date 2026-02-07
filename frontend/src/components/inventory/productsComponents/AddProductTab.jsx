import { useEffect, useState } from "react"
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
import { useCreateProduct, useUpdateProduct } from "@/hooks/inv_hooks/useProducts"
import BasicInformation from "./BasicInformation"
import AdditionalInformation from "./AdditionalInformation"

import VariantInformation from "./VariantInformation"
import SupplierInformation from "./SupplierInformation"
import TagsSection from "./TagsSection"
import SummarySection from "./SummarySection"


export default function AddProductTab({
    categories,
    brands,
    suppliers,
    refetchProducts,
    onTabChange,
    productToEdit = null,
    onSuccess,
    onClose,
}) {
    const { toast } = useToast()
    const [imagePreviews, setImagePreviews] = useState([])
    const [showVariantSection, setShowVariantSection] = useState(false)
    const [tagInput, setTagInput] = useState("")

    const createProductMutation = useCreateProduct()
    const updateProductMutation = useUpdateProduct()

   
    const isEdit = !!productToEdit
    const mutation = isEdit ? updateProductMutation : createProductMutation



    const [step, setStep] = useState(1)
    const totalSteps = 5

    const [formData, setFormData] = useState({
        productName: "",
        sku: "",
      //  barcode: "",
        brand: "",
        category: "",
        subCategory: "",
        department: "Unisex",
        season: "",
        collection: "",
        description: "",
       // longDescription: "",
        careInstructions: "",
        material: "",
        countryOfOrigin: "",
        ageGroup: "",
        gender: "",
        styleType: "",
       
       
        tags: [],
        supplier: {
            supplier: "",
            
        },
        variant: [],
      
        isActive: true
    })

    
    useEffect(() => {
        if (!productToEdit) {
            resetForm(); // clear when switching back to add mode
            return;
        }

        // 1. Basic + common fields
        setFormData(prev => ({
            ...prev,
            productName: productToEdit.productName || "",
            sku: productToEdit.sku || "",
            barcode: productToEdit.barcode || "",
            brand: productToEdit.brand?._id || productToEdit.brand || "",
            category: productToEdit.category?._id || productToEdit.category || "",
            subCategory: productToEdit.subCategory?._id || productToEdit.subCategory || "",
            department: productToEdit.department || "Unisex",
            season: productToEdit.season || "",
            collection: productToEdit.collection || "",
            description: productToEdit.description || "",
            longDescription: productToEdit.longDescription || "",
            careInstructions: productToEdit.careInstructions || "",
            material: productToEdit.material || "",
            countryOfOrigin: productToEdit.countryOfOrigin || "",
            ageGroup: productToEdit.ageGroup || "",
            gender: productToEdit.gender || "",
            styleType: productToEdit.styleType || "",
            occasion: productToEdit.occasion || "",
            primaryImage: productToEdit.primaryImage || "",
            tags: productToEdit.tags || [],
            isActive: productToEdit.isActive ?? true,

            // 2. Supplier – use correct nested key (supplierInfo)
            supplier: {
                supplier: productToEdit.supplierInfo?.supplier?._id || "",
                supplierCode: productToEdit.supplierInfo?.supplierCode || "",
                leadTime: productToEdit.supplierInfo?.leadTime?.toString() || "",
                minOrderQuantity: productToEdit.supplierInfo?.minOrderQuantity?.toString() || "",
                reorderLevel: productToEdit.supplierInfo?.reorderLevel?.toString() || "",
            },

            // 3. Variants – use plural "variants" and map each one properly
            variants: (productToEdit.variants || []).map(v => ({
                size: v.size || "",
                color: v.color || "",
                style: v.style || "",
                fitType: v.fitType || "",
                length: v.length || "",
                variantSku: v.variantSku || "",
                variantBarcode: v.variantBarcode || "",
                costPrice: v.price?.costPrice?.toString() || "",
                retailPrice: v.price?.retailPrice?.toString() || "",
                quantity: v.quantity?.toString() || "",
                images: [],
             
            })),

        
        }));

        
        setImagePreviews(
            productToEdit?.images?.map(img => img.url || img) || []
        );

        
        if (productToEdit?.variants?.length > 0) {
            setShowVariantSection(true);
        }

    }, [productToEdit]);


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
            variants: [],                // make sure this is plural and empty
            pricingTiers: [{ minQuantity: "", price: "" }],
            isActive: true
        })
        setImagePreviews([])
        setTagInput("")
        setShowVariantSection(false)
        setStep(1)                    // ← go back to step 1
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

    const nextStep = () => {
     

        setStep(prev => Math.min(prev + 1, totalSteps))
    }

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))




    const handleSubmit = async () => {
        try {
            // Prepare product data based on your backend model
            const productData = {
                productName: formData.productName.trim() || undefined,
                sku: formData.sku.trim() || undefined,
              //  barcode: formData.barcode.trim() || undefined,
                brand: formData.brand || undefined,
                category: formData.category || undefined,
              //  subCategory: formData.subCategory?.trim() || undefined,
                department: formData.department || "Unisex",
                season: formData.season?.trim() || undefined,
                collection: formData.collection?.trim() || undefined,
                description: formData.description?.trim() || undefined,
              //  longDescription: formData.longDescription?.trim() || undefined,
                careInstructions: formData.careInstructions?.trim() || undefined,
                material: formData.material?.trim() || undefined,
                countryOfOrigin: formData.countryOfOrigin?.trim() || undefined,
                ageGroup: formData.ageGroup?.trim() || undefined,
                gender: formData.gender?.trim() || undefined,
                styleType: formData.styleType?.trim() || undefined,
           


                tags: formData.tags.length > 0 ? formData.tags : undefined,

                supplierInfo: formData.supplier.supplier
                    ? {
                        supplier: formData.supplier.supplier,
                       
                    }
                    : undefined,

                // ────────────────────────────────────────────────
                //           MULTI-VARIANT SECTION
                // ────────────────────────────────────────────────
                variants: formData.variants
                    .filter(v => v.costPrice && v.retailPrice) // only send variants with required prices
                    .map((v) => ({
                        size: v.size?.trim() || undefined,
                        color: v.color?.trim() || undefined,
                        style: v.style?.trim() || undefined,
                        fitType: v.fitType?.trim() || undefined,
                        length: v.length?.trim() || undefined,
                        quantity: v.quantity?.trim()|| '',
                        variantSku: v.variantSku?.trim() || undefined,
                        // variantBarcode: v.variantBarcode?.trim() || undefined,

                        // Variant-specific images (if you support them)
                        images: v.images?.map(file => file.name) || [], // ← should be real URLs after upload

                        price: {
                            costPrice: Number(v.costPrice) || 0,
                            retailPrice: Number(v.retailPrice) || 0,
                           
                        },

                      
                        isActive: true
                    })),

                isActive: formData.isActive ?? true
            };

            if (isEdit) {
                await mutation.mutateAsync({
                    id: productToEdit._id,
                    data: productData   // or however your hook expects it
                })
                toast({
                    title: "Success",
                    description: "Product updated successfully",
                })
                resetForm()
                setStep(1)
                onSuccess?.()      
                onClose?.()
            } else {
                await mutation.mutateAsync(productData)
                toast({
                    title: "Success",
                    description: "Product created successfully",
                })
                resetForm()
             
            }

            onTabChange("overview")
            refetchProducts()
        } catch (error) {
            toast({
                title: "Error",
                description: "Operation failed",
                variant: "destructive",
            })
        }
    };




    const formSummary = {
        category: categories.find((c) => c._id === formData.category)?.categoryName || "Not selected",
        brand: brands.find((b) => b._id === formData.brand)?.brandName || "Not selected",
        margin: formData.variant?.costPrice && formData.variant.retailPrice
            ? (((parseFloat(formData.variant.retailPrice) - parseFloat(formData.variant?.costPrice)) / parseFloat(formData.variant.retailPrice)) * 100).toFixed(1)
            : "0",
        isValid: formData.productName && formData.sku && formData.category && formData.brand,
    }

    const renderStepContent = () => {
        switch (step) {
            // case 1:
            //     return (
            //         <ImagesSection
            //             formData={formData}
            //             setFormData={setFormData}
            //             imagePreviews={imagePreviews}
            //             onImageUpload={handleImageUpload}
            //             onRemoveImage={removeImage}
            //         />
            //     )

            case 1:
                return (
                    <BasicInformation
                        formData={formData}
                        setFormData={setFormData}
                        categories={categories}
                        brands={brands}
                    />
                )

            case 2:
                return <AdditionalInformation formData={formData} setFormData={setFormData} />

            case 3:
                return (
                    <VariantInformation
                        showVariantSection={showVariantSection}
                        setShowVariantSection={setShowVariantSection}
                        formData={formData}
                        setFormData={setFormData}
                        pricingTiers={formData.pricingTiers}
                        onAddPricingTier={addPricingTier}
                        onRemovePricingTier={removePricingTier}
                        onUpdatePricingTier={updatePricingTier}
                        productToEdit={productToEdit}
                    />
                )

            case 4:
                return (
                    <>
                        <SupplierInformation formData={formData} setFormData={setFormData} suppliers={suppliers} />
                        <TagsSection
                            formData={formData}
                            tagInput={tagInput}
                            setTagInput={setTagInput}
                            onAddTag={addTag}
                            onRemoveTag={removeTag}
                        />
                    </>
                )

            case 5:
                return <SummarySection formSummary={formSummary} showVariantSection={showVariantSection} />

            default:
                return null
        }
    }

    return (
        <div className="space-y-8">
            {/* Progress / Stepper bar */}
            <div className="flex items-center justify-between mb-8 px-4">
                {Array.from({ length: totalSteps }).map((_, i) => {
                    const isActive = i + 1 === step
                    const isCompleted = i + 1 < step
                    return (
                        <div key={i} className="flex items-center flex-1">
                            {/* Circle */}
                            <div
                                className={`
                        relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all
                        ${isActive
                                        ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30"
                                        : isCompleted
                                            ? "bg-primary/80 text-primary-foreground"
                                            : "bg-muted text-muted-foreground border-2 border-muted-foreground/30"
                                    }
                    `}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    i + 1
                                )}
                            </div>

                            {/* Connecting line (except last) */}
                            {i < totalSteps - 1 && (
                                <div
                                    className={`
                            h-[2px] flex-1 mx-2 transition-all
                            ${isCompleted || isActive ? "bg-primary" : "bg-muted"}
                        `}
                                />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Card wrapper for better look */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {
                           step === 1 ? "Basic Information"
                                : step === 2 ? "Additional Details"
                                    : step === 3 ? "Variants & Pricing"
                                        : step === 4 ? "Supplier & Tags"
                                            : "Review & Save"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {renderStepContent()}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
                <div className="flex gap-3">
                    <Button variant="outline" onClick={resetForm}>
                        Clear Form
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    {step > 1 && (
                        <Button variant="outline" onClick={prevStep}>
                            Back
                        </Button>
                    )}
                </div>

                {step < totalSteps ? (
                    <Button onClick={nextStep}>
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={!formSummary.isValid || createProductMutation.isLoading}
                    >
                        {createProductMutation.isLoading ? "Saving..." : "Save Product"}
                    </Button>
                )}
            </div>
        </div>
    )
}