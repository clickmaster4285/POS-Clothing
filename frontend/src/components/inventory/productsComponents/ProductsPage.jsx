"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { List, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductListTab from "./ProductListTab"
import AddProductTab from "./AddProductTab"
import ViewProductDialog from "./ViewProductDialog"
// import EditProductDialog from "./EditProductDialog" // ← no longer needed
import { useProducts } from "@/hooks/inv_hooks/useProducts"
import { useBrands } from "@/hooks/inv_hooks/useBrand"
import { useCategories } from "@/hooks/inv_hooks/useCategory"
import { useSuppliers } from "@/hooks/useSupplier"

export default function ProductPage() {
    const { toast } = useToast()
    const [showForm, setShowForm] = useState(false) // controls if form is visible
    const [productToEdit, setProductToEdit] = useState(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

    // API hooks
    const { data: productsData, isLoading, refetch: refetchProducts } = useProducts({
        page: 1,
        limit: 20,
    })
    const { data: brandsData } = useBrands()
    const { data: categoriesData } = useCategories()
    const { data: suppliersData } = useSuppliers()

    const products = productsData?.data || []
    const brands = brandsData?.data || []
    const categories = categoriesData?.data || []
    const suppliers = suppliersData || []
   
    const handleViewProduct = (product) => {
        setProductToEdit(product)
        setIsViewDialogOpen(true)
    }

    const handleOpenEdit = (product) => {
        setProductToEdit(product)
        setShowForm(true)
    }

    const handleAddNew = () => {
        setProductToEdit(null) // ensure add mode
        setShowForm(true)
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setProductToEdit(null)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                Loading...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Products</h1>
                    <p className="text-muted-foreground">Manage your product catalog</p>
                </div>

                <Button onClick={handleAddNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* Main Content Area */}
            {showForm ? (
                <AddProductTab
                    categories={categories}
                    brands={brands}
                    suppliers={suppliers}
                    refetchProducts={refetchProducts}
                    onClose={handleCloseForm}           // renamed from onTabChange
                    productToEdit={productToEdit}
                    onSuccess={() => {
                        refetchProducts()
                        handleCloseForm()
                    }}
                />
            ) : (
                <ProductListTab
                    products={products}
                    categories={categories}
                    brands={brands}
                    refetchProducts={refetchProducts}
                    onViewProduct={handleViewProduct}
                    onEditProduct={handleOpenEdit}
                />
            )}

            {/* View Product Dialog */}
            <ViewProductDialog
                isOpen={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                product={productToEdit}
                onEdit={handleOpenEdit}
            />

           
        </div>
    )
}