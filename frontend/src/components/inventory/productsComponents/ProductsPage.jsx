import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { List, Plus } from "lucide-react"
import ProductListTab from "./ProductListTab"
import AddProductTab from "./AddProductTab"
import ViewProductDialog from "./ViewProductDialog"
import EditProductDialog from "./EditProductDialog"
import { useProducts } from "@/hooks/inv_hooks/useProducts"
import { useBrands } from "@/hooks/inv_hooks/useBrand"
import { useCategories } from "@/hooks/inv_hooks/useCategory"
import { useSuppliers } from "@/hooks/useSupplier"


export default function ProductPage() {
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState("product-list")
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

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
    const suppliers = suppliersData?.data || []

    
    const handleViewProduct = (product) => {
        setSelectedProduct(product)
        setIsViewDialogOpen(true)
    }

    const handleOpenEdit = (product) => {
        setSelectedProduct(product)
        setIsEditDialogOpen(true)
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>
    }

    return (
        <div className="">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Products</h1>
                    <p className="text-muted-foreground">Manage your product catalog</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-card border border-border">
                    <TabsTrigger value="product-list" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <List className="h-4 w-4" />
                        Product List
                    </TabsTrigger>
                    <TabsTrigger value="add-product" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </TabsTrigger>
                </TabsList>

                {/* Product List Tab */}
                <TabsContent value="product-list" className="space-y-4">
                    <ProductListTab
                        products={products}
                        categories={categories}
                        brands={brands}
                        refetchProducts={refetchProducts}
                        onViewProduct={handleViewProduct}
                        onEditProduct={handleOpenEdit}
                    />
                </TabsContent>

                {/* Add Product Tab */}
                <TabsContent value="add-product">
                    <AddProductTab
                        categories={categories}
                        brands={brands}
                        suppliers={suppliers}
                        refetchProducts={refetchProducts}
                        onTabChange={setActiveTab}
                    />
                </TabsContent>
            </Tabs>

            {/* View Product Dialog */}
            <ViewProductDialog
                isOpen={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                product={selectedProduct}
                onEdit={handleOpenEdit}
            />

            {/* Edit Product Dialog */}
            <EditProductDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                product={selectedProduct}
                categories={categories}
                brands={brands}
                refetchProducts={refetchProducts}
            />
        </div>
    )
}