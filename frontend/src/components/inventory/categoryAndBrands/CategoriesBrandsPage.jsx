"use client"

import { useState, useRef } from "react"
import { StatCard } from "@/components/inventory/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    FolderTree,
    Layers,
    Tag,
    Building2,
} from "lucide-react"
import { useCategories, useCreateCategory, useUpdateCategory, useToggleCategoryStatus } from "@/hooks/inv_hooks/useCategory";
import { useBrands, useCreateBrand, useUpdateBrand, useToggleBrandStatus } from "@/hooks/inv_hooks/useBrand";

// Import components
import { SearchFilters } from "./SearchFilters"
import { CategoriesTable } from "./CategoriesTable"
import { BrandsTable } from "./BrandsTable"
import { CategoryFormDialog } from "./CategoryFormDialog"
import { BrandFormDialog } from "./BrandFormDialog"

import { ConfirmDeleteDialog } from "@/components/inventory/ConfirmDeleteDialog";

export default function CategoriesBrands() {
    const { data: brandsData, isLoading: isBrandsLoading } = useBrands();
    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();

    const [activeTab, setActiveTab] = useState("categories")
    const [searchTerm, setSearchTerm] = useState("")
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isUploading, setIsUploading] = useState(false)


    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    
   

    const brands = isBrandsLoading ? [] : brandsData?.data || []
    const categories = isCategoriesLoading ? [] : categoriesData?.data || []

    // Form states
    const [categoryForm, setCategoryForm] = useState({
        id: "",
        categoryName: "",
        categoryCode: "",
       
        description: "",
        image: null,          // File
        imagePreview: "",  
       
        department: "All",
        isActive: true,
        
    });

    const [brandForm, setBrandForm] = useState({
        id: "",
        brandName: "",
        brandCode: "",
        description: "",
        website: "",
        logo: null,          // File
        logoPreview: "", 
       
        countryOfOrigin: "",
        isActive: true,
        
    })

    //----------create mutations
    //brands
    const createBrandMutation = useCreateBrand();
    const updateBrandMutation = useUpdateBrand();
    const toggleBrandStatusMutation = useToggleBrandStatus();

    //categories
    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const toggleCategoryStatusMutation = useToggleCategoryStatus();

    const filteredCategories = categories.filter((cat) => {
        const name = cat.categoryName ?? "";
        const code = cat.categoryCode ?? "";
        return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const filteredBrands = brands.filter((brand) => {
        const name = brand.brandName ?? "";
        const code = brand.brandCode ?? "";
        return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const parentCategories = categories.filter((cat) => !cat.parentCategory)

    const stats = {
        totalCategories: categories.length,
        activeCategories: categories.filter((c) => c.isActive).length,
        totalBrands: brands.length,
        activeBrands: brands.filter((b) => b.isActive).length,
    }

    const simulateImageUpload = async (file) => {
        setIsUploading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))

        const imageUrl = URL.createObjectURL(file)
        setIsUploading(false)
        return imageUrl
    }

    const handleCategoryImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            alert("Only image files allowed")
            return
        }

        const preview = URL.createObjectURL(file)

        setCategoryForm(prev => ({
            ...prev,
            image: file,
            imagePreview: preview
        }))
    }

    const handleBrandLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only image files allowed");
            return;
        }

        const preview = URL.createObjectURL(file);

        setBrandForm(prev => ({
            ...prev,
            logo: file,
            logoPreview: preview
        }));
    };


    const handleAddCategory = async () => {
        if (!categoryForm.categoryName || !categoryForm.categoryCode) {
            alert("Please fill in all required fields")
            return
        }

        try {
            const formData = new FormData()

            // ===== BASIC FIELDS =====
            formData.append("categoryName", categoryForm.categoryName)
            formData.append("categoryCode", categoryForm.categoryCode)
          
            formData.append("description", categoryForm.description || "")
            formData.append("department", categoryForm.department || "")
        
            formData.append("isActive", categoryForm.isActive)

            // ===== IMAGE (THE KEY PART) =====
            if (categoryForm.image instanceof File) {
                formData.append("image", categoryForm.image) // 👈 FILE
            }

            // ===== ARRAYS / OBJECTS (MUST BE STRINGIFIED) =====
         
           

            // 🔍 DEBUG — YOU SHOULD SEE VALUES HERE
            for (let [key, value] of formData.entries()) {
             
            }

            // ===== API CALL =====
            if (isEditMode) {
                await updateCategoryMutation.mutateAsync({
                    id: categoryForm.id,
                    data: formData,
                })
            } else {
                await createCategoryMutation.mutateAsync(formData)
            }

            setIsCategoryDialogOpen(false)
            resetCategoryForm()
        } catch (error) {
            console.error("Error saving category:", error)
            alert("Failed to save category")
        }
    }


    const handleAddBrand = async () => {
        if (!brandForm.brandName || !brandForm.brandCode) {
            alert("Please fill required fields");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("brandName", brandForm.brandName);
            formData.append("brandCode", brandForm.brandCode);
            formData.append("description", brandForm.description || "");
            formData.append("website", brandForm.website || "");
            formData.append("countryOfOrigin", brandForm.countryOfOrigin || "");
            formData.append("isActive", brandForm.isActive);

           

           

            // 👇 FILE UPLOAD (THE KEY PART)
            if (brandForm.logo instanceof File) {
                formData.append("logo", brandForm.logo);
            }

            // DEBUG
            for (let [k, v] of formData.entries()) {
               
            }

            if (isEditMode) {
                await updateBrandMutation.mutateAsync({
                    id: brandForm.id,
                    data: formData,
                });
            } else {
                await createBrandMutation.mutateAsync(formData);
            }

            setIsBrandDialogOpen(false);
            resetBrandForm();

        } catch (err) {
            console.error(err);
            alert("Failed to save brand");
        }
    };

    const handleEditCategory = (category) => {
        setCategoryForm({
            id: category._id || category.id,
            categoryName: category.categoryName || "",
            categoryCode: category.categoryCode || "",
           
            description: category.description || "",
            image: null, // ✅ always null in edit
            imagePreview: category.image || "", // ✅ SHOW EXISTING IMAGE
          
            department: category.department || "All",
            isActive: category.isActive ?? true,
           
        });

        setIsEditMode(true);
        setIsCategoryDialogOpen(true);
    };


    const handleEditBrand = (brand) => {
        setBrandForm({
            id: brand._id || brand.id,
            brandName: brand.brandName || "",
            brandCode: brand.brandCode || "",
            description: brand.description || "",
            website: brand.website || "",
            logo: null,                      // ✅ null, not string
            logoPreview: brand.logo || "",   // ✅ preview
           
            countryOfOrigin: brand.countryOfOrigin || "",
            isActive: brand.isActive ?? true,
           
        });

        setIsEditMode(true);
        setIsBrandDialogOpen(true);
    };


    const handleDeleteCategory = async (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            await toggleCategoryStatusMutation.mutateAsync(id);
        }
    };

    const handleDeleteBrand = async (id) => {
        if (confirm('Are you sure you want to delete this brand?')) {
            await toggleBrandStatusMutation.mutateAsync(id);
        }
    };

    const handleToggleCategoryStatus = async (id) => {
        await toggleCategoryStatusMutation.mutateAsync(id);
    };

    const handleToggleBrandStatus = async (id) => {
        await toggleBrandStatusMutation.mutateAsync(id);
    };

    const resetCategoryForm = () => {
        setCategoryForm({
            id: "",
            categoryName: "",
            categoryCode: "",
           
            description: "",
            image: "",
           
            department: "All",
            isActive: true,
           
           
        })
        setIsEditMode(false)
    }

    const resetBrandForm = () => {
        setBrandForm({
            id: "",
            brandName: "",
            brandCode: "",
            description: "",
            website: "",
            logo: "",
          
            countryOfOrigin: "",
            isActive: true,
         
        })
        setIsEditMode(false)
    }

    const getParentCategoryName = (parentId) => {
        if (!parentId) return null
        const parent = categories.find((cat) => cat._id === parentId || cat.id === parentId)
        return parent?.categoryName
    }

    const handleAddAttribute = () => {
        setCategoryForm(prev => ({
            ...prev,
            attributes: [
                ...prev.attributes,
                {
                    name: "",
                    type: "text",
                    options: [],
                    isRequired: false,
                }
            ]
        }))
    }

    const handleRemoveAttribute = (index) => {
        setCategoryForm(prev => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index)
        }))
    }

    const handleAttributeChange = (index, field, value) => {
        setCategoryForm(prev => ({
            ...prev,
            attributes: prev.attributes.map((attr, i) =>
                i === index ? { ...attr, [field]: value } : attr
            )
        }))
    }

    const handleAddOption = (attrIndex) => {
        setCategoryForm(prev => ({
            ...prev,
            attributes: prev.attributes.map((attr, i) =>
                i === attrIndex ? {
                    ...attr,
                    options: [...attr.options, ""]
                } : attr
            )
        }))
    }

    const handleOptionChange = (attrIndex, optionIndex, value) => {
        setCategoryForm(prev => ({
            ...prev,
            attributes: prev.attributes.map((attr, i) =>
                i === attrIndex ? {
                    ...attr,
                    options: attr.options.map((opt, j) =>
                        j === optionIndex ? value : opt
                    )
                } : attr
            )
        }))
    }

    const handleRemoveOption = (attrIndex, optionIndex) => {
        setCategoryForm(prev => ({
            ...prev,
            attributes: prev.attributes.map((attr, i) =>
                i === attrIndex ? {
                    ...attr,
                    options: attr.options.filter((_, j) => j !== optionIndex)
                } : attr
            )
        }))
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Categories & Brands</h1>
                    <p className="text-muted-foreground">Manage product categories and brands</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Categories"
                    value={stats.totalCategories}
                    icon={FolderTree}
                    bgColor="bg-card"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Active Categories"
                    value={stats.activeCategories}
                    icon={Layers}
                    bgColor="bg-card"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Total Brands"
                    value={stats.totalBrands}
                    icon={Tag}
                    bgColor="bg-card"
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Active Brands"
                    value={stats.activeBrands}
                    icon={Building2}
                    bgColor="bg-card"
                    iconColor="text-purple-600"
                />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="brands">Brands</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-4">
                    {/* Filters */}
                    <SearchFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        activeTab={activeTab}
                        resetCategoryForm={resetCategoryForm}
                        resetBrandForm={resetBrandForm}
                        setIsCategoryDialogOpen={setIsCategoryDialogOpen}
                        setIsBrandDialogOpen={setIsBrandDialogOpen}
                    />

                    {/* Categories Table */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                                Categories ({filteredCategories.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CategoriesTable
                                filteredCategories={filteredCategories}
                                categories={categories}
                                handleEditCategory={handleEditCategory}
                                handleDeleteCategory={handleDeleteCategory}
                                handleToggleCategoryStatus={handleToggleCategoryStatus}
                                getParentCategoryName={getParentCategoryName}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="brands" className="space-y-4">
                    {/* Filters */}
                    <SearchFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        activeTab={activeTab}
                        resetCategoryForm={resetCategoryForm}
                        resetBrandForm={resetBrandForm}
                        setIsCategoryDialogOpen={setIsCategoryDialogOpen}
                        setIsBrandDialogOpen={setIsBrandDialogOpen}
                    />

                    {/* Brands Table */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Brands ({filteredBrands.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BrandsTable
                                filteredBrands={filteredBrands}
                                handleEditBrand={handleEditBrand}
                                handleDeleteBrand={handleDeleteBrand}
                                handleToggleBrandStatus={handleToggleBrandStatus}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add/Edit Category Dialog */}
            <CategoryFormDialog
                isOpen={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
                categoryForm={categoryForm}
                setCategoryForm={setCategoryForm}
                isEditMode={isEditMode}
                isUploading={isUploading}
                parentCategories={parentCategories}
                categories={categories}
                handleAddCategory={handleAddCategory}
                handleCategoryImageUpload={handleCategoryImageUpload}
                handleAddAttribute={handleAddAttribute}
                handleRemoveAttribute={handleRemoveAttribute}
                handleAttributeChange={handleAttributeChange}
                handleAddOption={handleAddOption}
                handleOptionChange={handleOptionChange}
                handleRemoveOption={handleRemoveOption}
            />

            {/* Add/Edit Brand Dialog */}
            <BrandFormDialog
                isOpen={isBrandDialogOpen}
                onOpenChange={setIsBrandDialogOpen}
                brandForm={brandForm}
                setBrandForm={setBrandForm}
                isEditMode={isEditMode}
                isUploading={isUploading}
                categories={categories}
                handleAddBrand={handleAddBrand}
                handleBrandLogoUpload={handleBrandLogoUpload}
            />
        </>
    )
}