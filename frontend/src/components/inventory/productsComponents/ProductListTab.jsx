import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Package,
    Search,
    Download,
    Layers,
    DollarSign,
    AlertTriangle,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    ImageIcon,
    CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUpdateProduct, useDeleteProduct } from "@/hooks/inv_hooks/useProducts"


export default function ProductListTab({
    products,
    categories,
    brands,
    refetchProducts,
    onViewProduct,
    onEditProduct
}) {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [brandFilter, setBrandFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const updateProductMutation = useUpdateProduct()
    const deleteProductMutation = useDeleteProduct()

    const stats = {
        totalProducts: products.length,
        totalVariants: products.reduce((acc, p) => acc + (p.variants?.length || 0), 0),
        activeProducts: products.filter((p) => p.isActive).length,
        lowStock: products.filter((p) => p.variants?.some((v) => v.quantity < 10)).length,
    }

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || product.category?._id === categoryFilter
        const matchesBrand = brandFilter === "all" || product.brand?._id === brandFilter
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && product.isActive) ||
            (statusFilter === "inactive" && !product.isActive)
        return matchesSearch && matchesCategory && matchesBrand && matchesStatus
    })

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProductMutation.mutateAsync(id)
            toast({
                title: "Success",
                description: "Product deleted successfully",
            })
            refetchProducts()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product",
                variant: "destructive",
            })
        }
    }

    const handleToggleStatus = async (product) => {
        try {
            await updateProductMutation.mutateAsync({
                id: product._id,
                isActive: !product.isActive
            })
            toast({
                title: "Success",
                description: `Product ${!product.isActive ? 'activated' : 'deactivated'}`,
            })
            refetchProducts()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            })
        }
    }

    return (
        <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-blue-50 p-3">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalProducts}</p>
                                <p className="text-sm text-muted-foreground">Total Products</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-green-50 p-3">
                                <Layers className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalVariants}</p>
                                <p className="text-sm text-muted-foreground">Total Variants</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-amber-50 p-3">
                                <DollarSign className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.activeProducts}</p>
                                <p className="text-sm text-muted-foreground">Active Products</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-red-50 p-3">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.lowStock}</p>
                                <p className="text-sm text-muted-foreground">Low Stock</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products by name or SKU..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.categoryName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={brandFilter} onValueChange={setBrandFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Brand" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Brands</SelectItem>
                                {brands.map((brand) => (
                                    <SelectItem key={brand._id} value={brand._id}>
                                        {brand.brandName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="border-border/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                        Product List ({filteredProducts.length} products)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                               
                                <TableHead>Product Name</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Variants</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product._id}>
                                   
                                    <TableCell onClick={() => onViewProduct(product)}  className="font-medium">{product.productName}</TableCell>
                                    <TableCell onClick={() => onViewProduct(product)}  className="text-muted-foreground">{product.sku}</TableCell>
                                    <TableCell onClick={() => onViewProduct(product)}>{product.category?.categoryName || "N/A"}</TableCell>
                                    <TableCell onClick={() => onViewProduct(product)}>{product.brand?.brandName || "N/A"}</TableCell>
                                    <TableCell onClick={() => onViewProduct(product)}>{product.variants?.length || 0}</TableCell>
                                    <TableCell>
                                        ${product.variants?.[0]?.price?.retailPrice?.toFixed(2) || "0.00"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`cursor-pointer ${product.isActive
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                                }`}
                                            onClick={() => handleToggleStatus(product)}
                                        >
                                            {product.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewProduct(product)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEditProduct(product)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Product
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}