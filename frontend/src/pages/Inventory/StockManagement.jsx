"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Boxes,
    Search,
    Plus,
    MoreVertical,
    ArrowUpDown,
    AlertTriangle,
    PackagePlus,
    PackageMinus,
    Truck,
    CheckCircle,
    XCircle,
    ArrowRight,
    List,
} from "lucide-react"
import { useProducts } from "@/hooks/inv_hooks/useProducts"
import { useBrands } from "@/hooks/inv_hooks/useBrand"
import { useCategories } from "@/hooks/inv_hooks/useCategory"
import { useSuppliers } from "@/hooks/useSupplier"

export const dummyBranches = [
    { id: "1", name: "Main Store", location: "Downtown", isActive: true },
    { id: "2", name: "Mall Outlet", location: "City Mall", isActive: true },
    { id: "3", name: "Warehouse", location: "Industrial Area", isActive: true },
]
export const dummySuppliers = [
    { id: "1", supplierName: "Global Textiles", supplierCode: "GT001", contactPerson: "John Smith", email: "john@globaltextiles.com", phone: "+1234567890", isActive: true },
    { id: "2", supplierName: "Fashion Imports", supplierCode: "FI001", contactPerson: "Jane Doe", email: "jane@fashionimports.com", phone: "+0987654321", isActive: true },
]
export const dummyBrands = [
    { id: "1", brandName: "Nike", brandCode: "NK", isActive: true },
    { id: "2", brandName: "Adidas", brandCode: "AD", isActive: true },
    { id: "3", brandName: "Puma", brandCode: "PM", isActive: true },
]
export const dummyCategories = [
    { id: "1", categoryName: "Clothing", categoryCode: "CLT", isActive: true },
    { id: "2", categoryName: "Footwear", categoryCode: "FTW", isActive: true },
    { id: "3", categoryName: "Accessories", categoryCode: "ACC", isActive: true },
]
export const dummyProducts = [
    {
        id: "1",
        productName: "Classic Cotton T-Shirt",
        sku: "TSH-001",
        barcode: "8901234567890",
        brand: dummyBrands[0],
        category: dummyCategories[0],
        department: "Men",
        primaryImage: "/products/tshirt.jpg",
        isActive: true,
        variants: [
            { id: "1a", size: "S", color: "Black", variantSku: "TSH-001-BLK-S", price: { costPrice: 15, retailPrice: 29.99 }, isActive: true },
            { id: "1b", size: "M", color: "Black", variantSku: "TSH-001-BLK-M", price: { costPrice: 15, retailPrice: 29.99 }, isActive: true },
            { id: "1c", size: "L", color: "Black", variantSku: "TSH-001-BLK-L", price: { costPrice: 15, retailPrice: 29.99 }, isActive: true },
            { id: "1d", size: "M", color: "White", variantSku: "TSH-001-WHT-M", price: { costPrice: 15, retailPrice: 29.99 }, isActive: true },
        ],
    },
    {
        id: "2",
        productName: "Running Sneakers Pro",
        sku: "SHO-001",
        barcode: "8901234567891",
        brand: dummyBrands[0],
        category: dummyCategories[1],
        department: "Unisex",
        primaryImage: "/products/sneakers.jpg",
        isActive: true,
        variants: [
            { id: "2a", size: "40", color: "Red/Black", variantSku: "SHO-001-RB-40", price: { costPrice: 60, retailPrice: 129.99 }, isActive: true },
            { id: "2b", size: "42", color: "Red/Black", variantSku: "SHO-001-RB-42", price: { costPrice: 60, retailPrice: 129.99 }, isActive: true },
            { id: "2c", size: "44", color: "Red/Black", variantSku: "SHO-001-RB-44", price: { costPrice: 60, retailPrice: 129.99 }, isActive: true },
        ],
    },
    {
        id: "3",
        productName: "Leather Belt Premium",
        sku: "ACC-001",
        barcode: "8901234567892",
        brand: dummyBrands[1],
        category: dummyCategories[2],
        department: "Men",
        primaryImage: "/products/belt.jpg",
        isActive: true,
        variants: [
            { id: "3a", size: "32", color: "Brown", variantSku: "ACC-001-BRN-32", price: { costPrice: 25, retailPrice: 59.99 }, isActive: true },
            { id: "3b", size: "34", color: "Brown", variantSku: "ACC-001-BRN-34", price: { costPrice: 25, retailPrice: 59.99 }, isActive: true },
            { id: "3c", size: "34", color: "Black", variantSku: "ACC-001-BLK-34", price: { costPrice: 25, retailPrice: 59.99 }, isActive: true },
        ],
    },
    {
        id: "4",
        productName: "Sports Jacket Elite",
        sku: "JKT-001",
        barcode: "8901234567893",
        brand: dummyBrands[2],
        category: dummyCategories[0],
        department: "Men",
        primaryImage: "/products/jacket.jpg",
        isActive: true,
        variants: [
            { id: "4a", size: "M", color: "Navy", variantSku: "JKT-001-NVY-M", price: { costPrice: 80, retailPrice: 179.99 }, isActive: true },
            { id: "4b", size: "L", color: "Navy", variantSku: "JKT-001-NVY-L", price: { costPrice: 80, retailPrice: 179.99 }, isActive: true },
        ],
    },
    {
        id: "5",
        productName: "Fresh Milk 1L",
        sku: "DRY-001",
        barcode: "8901234567894",
        brand: dummyBrands[0],
        category: dummyCategories[0],
        department: "Unisex",
        primaryImage: "/products/milk.jpg",
        isActive: true,
        variants: [
            { id: "5a", variantSku: "DRY-001-1L", price: { costPrice: 2, retailPrice: 3.25 }, isActive: true },
        ],
    },
]
export const dummyStocks = [
    {
        id: "1",
        product: dummyProducts[0],
        variantId: "1a",
        branch: dummyBranches[0],
        location: "store",
        storageDetails: { rack: "A1", shelf: "1", bin: "01" },
        currentStock: 45,
        reservedStock: 5,
        availableStock: 40,
        inTransitStock: 10,
        damagedStock: 0,
        reorderPoint: 20,
        stockValue: 675,
        isLowStock: false,
    },
    {
        id: "2",
        product: dummyProducts[0],
        variantId: "1b",
        branch: dummyBranches[0],
        location: "store",
        storageDetails: { rack: "A1", shelf: "1", bin: "02" },
        currentStock: 12,
        reservedStock: 2,
        availableStock: 10,
        inTransitStock: 0,
        damagedStock: 1,
        reorderPoint: 20,
        stockValue: 180,
        isLowStock: true,
    },
    {
        id: "3",
        product: dummyProducts[1],
        variantId: "2a",
        branch: dummyBranches[0],
        location: "store",
        storageDetails: { rack: "B2", shelf: "2", bin: "01" },
        currentStock: 8,
        reservedStock: 0,
        availableStock: 8,
        inTransitStock: 5,
        damagedStock: 0,
        reorderPoint: 10,
        stockValue: 480,
        isLowStock: true,
    },
    {
        id: "4",
        product: dummyProducts[2],
        variantId: "3a",
        branch: dummyBranches[0],
        location: "store",
        storageDetails: { rack: "C1", shelf: "1", bin: "01" },
        currentStock: 25,
        reservedStock: 0,
        availableStock: 25,
        inTransitStock: 0,
        damagedStock: 0,
        reorderPoint: 10,
        stockValue: 625,
        isLowStock: false,
    },
    {
        id: "5",
        product: dummyProducts[3],
        variantId: "4a",
        branch: dummyBranches[0],
        location: "store",
        storageDetails: { rack: "D1", shelf: "1", bin: "01" },
        currentStock: 5,
        reservedStock: 1,
        availableStock: 4,
        inTransitStock: 10,
        damagedStock: 0,
        reorderPoint: 8,
        stockValue: 400,
        isLowStock: true,
    },
]

export const dummyStockAdjustments = [
    {
        id: "1",
        branch: dummyBranches[0],
        adjustmentType: "add",
        reason: "New stock received",
        items: [{ product: dummyProducts[0], variantId: "1a", quantity: 50 }],
        adjustedBy: "John Manager",
        status: "completed",
        createdAt: "2025-01-28T10:30:00Z",
        referenceNumber: "ADJ-001",
    },
    {
        id: "2",
        branch: dummyBranches[0],
        adjustmentType: "damage",
        reason: "Damaged during handling",
        items: [{ product: dummyProducts[1], variantId: "2a", quantity: 2 }],
        adjustedBy: "Jane Staff",
        status: "pending",
        createdAt: "2025-01-29T14:15:00Z",
        referenceNumber: "ADJ-002",
    },
]
export const dummyStockTransfers = [
    {
        id: "1",
        transferNumber: "TRF-2025-001",
        fromBranch: dummyBranches[2],
        fromLocation: "warehouse",
        toBranch: dummyBranches[0],
        toLocation: "store",
        items: [
            { product: dummyProducts[0], variantId: "1a", quantity: 30, transferredQuantity: 30, receivedQuantity: 30 },
            { product: dummyProducts[0], variantId: "1b", quantity: 20, transferredQuantity: 20, receivedQuantity: 20 },
        ],
        status: "completed",
        requestedBy: "Store Manager",
        expectedDeliveryDate: "2025-01-25",
        createdAt: "2025-01-20T09:00:00Z",
    },
    {
        id: "2",
        transferNumber: "TRF-2025-002",
        fromBranch: dummyBranches[2],
        fromLocation: "warehouse",
        toBranch: dummyBranches[1],
        toLocation: "store",
        items: [
            { product: dummyProducts[1], variantId: "2a", quantity: 15, transferredQuantity: 15, receivedQuantity: 0 },
        ],
        status: "in-transit",
        requestedBy: "Mall Manager",
        expectedDeliveryDate: "2025-01-30",
        createdAt: "2025-01-28T11:00:00Z",
    },
]

export default function StockManagementPage() {


    const { data: productsData } = useProducts()
    const { data: brandsData } = useBrands()
    const { data: categoriesData } = useCategories()
    const { data: suppliersData } = useSuppliers()

    const products = productsData?.data || []
    const brands = brandsData?.data || []
    const categories = categoriesData?.data || []
    const suppliers = suppliersData?.data || []

    
    const [activeTab, setActiveTab] = useState("overview")
    const [searchTerm, setSearchTerm] = useState("")
    const [branchFilter, setBranchFilter] = useState("all")
    const [stocks, setStocks] = useState(dummyStocks)
    const [adjustments, setAdjustments] = useState(dummyStockAdjustments)
    const [transfers, setTransfers] = useState(dummyStockTransfers)


    // Adjustment form
    const [adjustForm, setAdjustForm] = useState({
        product: "",
        variant: "",
        type: "add",
        quantity: "",
        reason: "",
        branch: "",
    })

    // Transfer form
    const [transferForm, setTransferForm] = useState({
        fromBranch: "",
        toBranch: "",
        product: "",
        variant: "",
        quantity: "",
        notes: "",
    })

    const resetAdjustForm = () => {
        setAdjustForm({ product: "", variant: "", type: "add", quantity: "", reason: "", branch: "" })
    }

    const resetTransferForm = () => {
        setTransferForm({ fromBranch: "", toBranch: "", product: "", variant: "", quantity: "", notes: "" })
    }

    const filteredStocks = stocks.filter((stock) => {
        const matchesSearch =
            stock.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesBranch = branchFilter === "all" || stock.branch.id === branchFilter
        return matchesSearch && matchesBranch
    })

    const lowStockItems = stocks.filter((s) => s.isLowStock)
    const totalValue = stocks.reduce((acc, s) => acc + s.stockValue, 0)

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
            case "approved":
                return "bg-green-50 text-green-700 border-green-200"
            case "pending":
            case "draft":
                return "bg-amber-50 text-amber-700 border-amber-200"
            case "in-transit":
                return "bg-blue-50 text-blue-700 border-blue-200"
            case "rejected":
            case "cancelled":
                return "bg-red-50 text-red-700 border-red-200"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    const handleAddAdjustment = () => {
        const product = dummyProducts.find((p) => p.id === adjustForm.product)
        const branch = dummyBranches.find((b) => b.id === adjustForm.branch)
        if (!product || !branch || !adjustForm.quantity) return

        const newAdjustment = {
            id: String(Date.now()),
            branch,
            adjustmentType: adjustForm.type,
            reason: adjustForm.reason,
            items: [
                {
                    product,
                    variantId: adjustForm.variant,
                    quantity: Number.parseInt(adjustForm.quantity),
                },
            ],
            adjustedBy: "Current User",
            status: "pending",
            createdAt: new Date().toISOString(),
            referenceNumber: `ADJ-${String(adjustments.length + 1).padStart(3, "0")}`,
        }
        setAdjustments([newAdjustment, ...adjustments])

        // Update stock based on adjustment type
        if (adjustForm.type === "add") {
            setStocks(stocks.map((s) => {
                if (s.product.id === adjustForm.product && s.variantId === adjustForm.variant && s.branch.id === adjustForm.branch) {
                    const qty = Number.parseInt(adjustForm.quantity)
                    return {
                        ...s,
                        currentStock: s.currentStock + qty,
                        availableStock: s.availableStock + qty,
                        stockValue: s.stockValue + (qty * s.product.variants[0].price.costPrice),
                    }
                }
                return s
            }))
        } else if (adjustForm.type === "remove" || adjustForm.type === "damage") {
            setStocks(stocks.map((s) => {
                if (s.product.id === adjustForm.product && s.variantId === adjustForm.variant && s.branch.id === adjustForm.branch) {
                    const qty = Number.parseInt(adjustForm.quantity)
                    return {
                        ...s,
                        currentStock: Math.max(0, s.currentStock - qty),
                        availableStock: Math.max(0, s.availableStock - qty),
                        damagedStock: adjustForm.type === "damage" ? s.damagedStock + qty : s.damagedStock,
                        stockValue: Math.max(0, s.stockValue - (qty * s.product.variants[0].price.costPrice)),
                    }
                }
                return s
            }))
        }

        resetAdjustForm()
        setActiveTab("adjustments")
    }

    const handleAddTransfer = () => {
        const fromBranch = dummyBranches.find((b) => b.id === transferForm.fromBranch)
        const toBranch = dummyBranches.find((b) => b.id === transferForm.toBranch)
        const product = dummyProducts.find((p) => p.id === transferForm.product)
        if (!fromBranch || !toBranch || !product || !transferForm.quantity) return

        const newTransfer = {
            id: String(Date.now()),
            transferNumber: `TRF-2025-${String(transfers.length + 1).padStart(3, "0")}`,
            fromBranch,
            toBranch,
            items: [
                {
                    product,
                    variantId: transferForm.variant,
                    quantity: Number.parseInt(transferForm.quantity),
                    transferredQuantity: 0,
                    receivedQuantity: 0,
                },
            ],
            status: "pending",
            requestedBy: "Current User",
            createdAt: new Date().toISOString(),
        }
        setTransfers([newTransfer, ...transfers])
        resetTransferForm()
        setActiveTab("transfers")
    }

    const handleApproveAdjustment = (id) => {
        setAdjustments(adjustments.map((a) => (a.id === id ? { ...a, status: "approved" } : a)))
    }

    const handleRejectAdjustment = (id) => {
        setAdjustments(adjustments.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)))
    }

    const handleTransferStatus = (id, status) => {
        setTransfers(transfers.map((t) => (t.id === id ? { ...t, status } : t)))
    }

    const selectedProductVariants = dummyProducts.find((p) => p.id === adjustForm.product)?.variants || []
    const transferProductVariants = dummyProducts.find((p) => p.id === transferForm.product)?.variants || []

    // Adjustment form summary
    const adjustSummary = {
        product: dummyProducts.find((p) => p.id === adjustForm.product)?.productName || "Not selected",
        branch: dummyBranches.find((b) => b.id === adjustForm.branch)?.name || "Not selected",
        typeLabel: adjustForm.type === "add" ? "Stock Addition" : adjustForm.type === "remove" ? "Stock Removal" : adjustForm.type === "damage" ? "Damage Write-off" : "Return",
        isValid: adjustForm.product && adjustForm.variant && adjustForm.quantity && adjustForm.branch && adjustForm.reason,
    }

    // Transfer form summary
    const transferSummary = {
        product: dummyProducts.find((p) => p.id === transferForm.product)?.productName || "Not selected",
        from: dummyBranches.find((b) => b.id === transferForm.fromBranch)?.name || "Not selected",
        to: dummyBranches.find((b) => b.id === transferForm.toBranch)?.name || "Not selected",
        isValid: transferForm.fromBranch && transferForm.toBranch && transferForm.product && transferForm.variant && transferForm.quantity && transferForm.fromBranch !== transferForm.toBranch,
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
                    <p className="text-muted-foreground">Manage stock levels, adjustments, and transfers</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {lowStockItems.length} Low Stock Items
                </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-card border border-border">
                    <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <List className="h-4 w-4" />
                        Stock Overview
                    </TabsTrigger>
                    <TabsTrigger value="adjustment-form" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <ArrowUpDown className="h-4 w-4" />
                        Stock Adjustment
                    </TabsTrigger>
                    <TabsTrigger value="transfer-form" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <Truck className="h-4 w-4" />
                        Stock Transfer
                    </TabsTrigger>
                </TabsList>

                {/* Stock Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-blue-50 p-3">
                                        <Boxes className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stocks.length}</p>
                                        <p className="text-sm text-muted-foreground">Total SKUs</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-green-50 p-3">
                                        <Boxes className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">Total Stock Value</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-amber-50 p-3">
                                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{lowStockItems.length}</p>
                                        <p className="text-sm text-muted-foreground">Low Stock Items</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-purple-50 p-3">
                                        <Truck className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{transfers.filter((t) => t.status !== "completed").length}</p>
                                        <p className="text-sm text-muted-foreground">Pending Transfers</p>
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
                                            placeholder="Search by product name or SKU..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={branchFilter} onValueChange={setBranchFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Branches</SelectItem>
                                        {dummyBranches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Table */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Stock Levels</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Variant</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead className="text-right">Current</TableHead>
                                        <TableHead className="text-right">Reserved</TableHead>
                                        <TableHead className="text-right">Available</TableHead>
                                        <TableHead className="text-right">In Transit</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStocks.map((stock) => {
                                        const variant = stock.product.variants.find((v) => v.id === stock.variantId)
                                        return (
                                            <TableRow key={stock.id}>
                                                <TableCell className="font-medium">{stock.product.productName}</TableCell>
                                                <TableCell>
                                                    {variant?.size} / {variant?.color}
                                                </TableCell>
                                                <TableCell>{stock.branch.name}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {stock.storageDetails.rack}-{stock.storageDetails.shelf}-{stock.storageDetails.bin}
                                                </TableCell>
                                                <TableCell className="text-right">{stock.currentStock}</TableCell>
                                                <TableCell className="text-right">{stock.reservedStock}</TableCell>
                                                <TableCell className="text-right font-medium">{stock.availableStock}</TableCell>
                                                <TableCell className="text-right">{stock.inTransitStock}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={(
                                                            stock.isLowStock
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-green-50 text-green-700 border-green-200"
                                                        )}
                                                    >
                                                        {stock.isLowStock ? "Low Stock" : "In Stock"}
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
                                                            <DropdownMenuItem onClick={() => {
                                                                setAdjustForm({
                                                                    ...adjustForm,
                                                                    product: stock.product.id,
                                                                    variant: stock.variantId,
                                                                    branch: stock.branch.id,
                                                                    type: "add",
                                                                })
                                                                setActiveTab("adjustment-form")
                                                            }}>
                                                                <PackagePlus className="mr-2 h-4 w-4" />
                                                                Add Stock
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => {
                                                                setAdjustForm({
                                                                    ...adjustForm,
                                                                    product: stock.product.id,
                                                                    variant: stock.variantId,
                                                                    branch: stock.branch.id,
                                                                    type: "remove",
                                                                })
                                                                setActiveTab("adjustment-form")
                                                            }}>
                                                                <PackageMinus className="mr-2 h-4 w-4" />
                                                                Remove Stock
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => {
                                                                setTransferForm({
                                                                    ...transferForm,
                                                                    product: stock.product.id,
                                                                    variant: stock.variantId,
                                                                    fromBranch: stock.branch.id,
                                                                })
                                                                setActiveTab("transfer-form")
                                                            }}>
                                                                <Truck className="mr-2 h-4 w-4" />
                                                                Transfer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Recent Adjustments & Transfers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="border-border/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Recent Adjustments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {adjustments.slice(0, 5).map((adj) => (
                                        <div key={adj.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <div>
                                                <p className="font-medium text-sm">{adj.referenceNumber}</p>
                                                <p className="text-xs text-muted-foreground">{adj.items[0]?.product.productName}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="outline" className={(getStatusColor(adj.status), "text-xs")}>
                                                    {adj.status}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground mt-1">{adj.adjustmentType}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Recent Transfers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {transfers.slice(0, 5).map((transfer) => (
                                        <div key={transfer.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <div>
                                                <p className="font-medium text-sm">{transfer.transferNumber}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {transfer.fromBranch.name} → {transfer.toBranch.name}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className={(getStatusColor(transfer.status), "text-xs")}>
                                                {transfer.status.replace("-", " ")}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Stock Adjustment Form Tab */}
                <TabsContent value="adjustment-form">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ArrowUpDown className="h-5 w-5 text-primary" />
                                        Adjustment Form
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Adjustment Type *</Label>
                                        <Select value={adjustForm.type} onValueChange={(value) => setAdjustForm({ ...adjustForm, type: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="add">Add Stock</SelectItem>
                                                <SelectItem value="remove">Remove Stock</SelectItem>
                                                <SelectItem value="damage">Damage Write-off</SelectItem>
                                                <SelectItem value="return">Return</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Branch *</Label>
                                        <Select value={adjustForm.branch} onValueChange={(value) => setAdjustForm({ ...adjustForm, branch: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dummyBranches.map((branch) => (
                                                    <SelectItem key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Product *</Label>
                                            <Select value={adjustForm.product} onValueChange={(value) => setAdjustForm({ ...adjustForm, product: value, variant: "" })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dummyProducts.map((product) => (
                                                        <SelectItem key={product.id} value={product.id}>
                                                            {product.productName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Variant *</Label>
                                            <Select
                                                value={adjustForm.variant}
                                                onValueChange={(value) => setAdjustForm({ ...adjustForm, variant: value })}
                                                disabled={!adjustForm.product}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select variant" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {selectedProductVariants.map((variant) => (
                                                        <SelectItem key={variant.id} value={variant.id}>
                                                            {variant.size || "Default"} / {variant.color || "Default"}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity *</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={adjustForm.quantity}
                                            onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                                            placeholder="Enter quantity"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reason">Reason *</Label>
                                        <Textarea
                                            id="reason"
                                            value={adjustForm.reason}
                                            onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                                            placeholder="Enter reason for adjustment"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button variant="outline" onClick={resetAdjustForm} className="bg-transparent">
                                            Clear Form
                                        </Button>
                                        <Button onClick={handleAddAdjustment} disabled={!adjustSummary.isValid}>
                                            Submit Adjustment
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Adjustments History */}
                            <Card className="border-border/50 mt-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Adjustments History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Reference</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Branch</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Items</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="w-[80px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {adjustments.map((adj) => (
                                                <TableRow key={adj.id}>
                                                    <TableCell className="font-medium">{adj.referenceNumber}</TableCell>
                                                    <TableCell>{new Date(adj.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell>{adj.branch.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="capitalize">{adj.adjustmentType}</Badge>
                                                    </TableCell>
                                                    <TableCell>{adj.items.length} items</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={(getStatusColor(adj.status))}>{adj.status}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {adj.status === "pending" && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleApproveAdjustment(adj.id)}>
                                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                                        Approve
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleRejectAdjustment(adj.id)} className="text-destructive">
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Reject
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Summary Section */}
                        <div className="space-y-4">
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg border border-border p-4">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Adjustment Type</p>
                                        <p className="text-xl font-semibold mt-1">{adjustSummary.typeLabel}</p>
                                    </div>

                                    <div className="rounded-lg border border-border p-4">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Product</p>
                                        <p className="text-xl font-semibold mt-1">{adjustSummary.product}</p>
                                    </div>

                                    <div className="rounded-lg border border-border p-4">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Branch</p>
                                        <p className="text-xl font-semibold mt-1">{adjustSummary.branch}</p>
                                    </div>

                                    {adjustForm.quantity && (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                            <p className="text-xs text-amber-600 uppercase tracking-wider">Quantity</p>
                                            <p className="text-3xl font-bold text-amber-700 mt-1">{adjustForm.quantity}</p>
                                            <p className="text-xs text-amber-600 mt-1">units to {adjustForm.type}</p>
                                        </div>
                                    )}

                                    <div className={(
                                        "rounded-lg border p-4",
                                        adjustSummary.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                                    )}>
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Form Status</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {adjustSummary.isValid ? (
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Ready to Submit
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                                                    Missing required fields
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Stock Transfer Form Tab */}
                <TabsContent value="transfer-form">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Truck className="h-5 w-5 text-primary" />
                                        Transfer Form
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>From Branch *</Label>
                                            <Select value={transferForm.fromBranch} onValueChange={(value) => setTransferForm({ ...transferForm, fromBranch: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dummyBranches.map((branch) => (
                                                        <SelectItem key={branch.id} value={branch.id}>
                                                            {branch.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>To Branch *</Label>
                                            <Select value={transferForm.toBranch} onValueChange={(value) => setTransferForm({ ...transferForm, toBranch: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select destination" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dummyBranches.filter((b) => b.id !== transferForm.fromBranch).map((branch) => (
                                                        <SelectItem key={branch.id} value={branch.id}>
                                                            {branch.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Product *</Label>
                                            <Select value={transferForm.product} onValueChange={(value) => setTransferForm({ ...transferForm, product: value, variant: "" })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dummyProducts.map((product) => (
                                                        <SelectItem key={product.id} value={product.id}>
                                                            {product.productName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Variant *</Label>
                                            <Select
                                                value={transferForm.variant}
                                                onValueChange={(value) => setTransferForm({ ...transferForm, variant: value })}
                                                disabled={!transferForm.product}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select variant" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {transferProductVariants.map((variant) => (
                                                        <SelectItem key={variant.id} value={variant.id}>
                                                            {variant.size || "Default"} / {variant.color || "Default"}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="transferQty">Quantity *</Label>
                                        <Input
                                            id="transferQty"
                                            type="number"
                                            min="1"
                                            value={transferForm.quantity}
                                            onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                                            placeholder="Enter quantity to transfer"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            value={transferForm.notes}
                                            onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                                            placeholder="Additional notes for this transfer"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button variant="outline" onClick={resetTransferForm} className="bg-transparent">
                                            Clear Form
                                        </Button>
                                        <Button onClick={handleAddTransfer} disabled={!transferSummary.isValid}>
                                            Create Transfer
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Transfers History */}
                            <Card className="border-border/50 mt-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Transfers History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Transfer #</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>From</TableHead>
                                                <TableHead>To</TableHead>
                                                <TableHead>Items</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="w-[80px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transfers.map((transfer) => (
                                                <TableRow key={transfer.id}>
                                                    <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                                                    <TableCell>{new Date(transfer.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell>{transfer.fromBranch.name}</TableCell>
                                                    <TableCell>{transfer.toBranch.name}</TableCell>
                                                    <TableCell>{transfer.items.length} items</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={(getStatusColor(transfer.status))}>
                                                            {transfer.status.replace("-", " ")}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {transfer.status !== "completed" && transfer.status !== "cancelled" && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    {transfer.status === "pending" && (
                                                                        <DropdownMenuItem onClick={() => handleTransferStatus(transfer.id, "in-transit")}>
                                                                            <Truck className="mr-2 h-4 w-4" />
                                                                            Mark In Transit
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    {transfer.status === "in-transit" && (
                                                                        <DropdownMenuItem onClick={() => handleTransferStatus(transfer.id, "completed")}>
                                                                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                                            Mark Received
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem onClick={() => handleTransferStatus(transfer.id, "cancelled")} className="text-destructive">
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Cancel Transfer
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Summary Section */}
                        <div className="space-y-4">
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg border border-border p-4">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Product</p>
                                        <p className="text-xl font-semibold mt-1">{transferSummary.product}</p>
                                    </div>

                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <p className="text-xs text-blue-600 uppercase tracking-wider">Transfer Route</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="font-semibold text-blue-700">{transferSummary.from}</span>
                                            <ArrowRight className="h-4 w-4 text-blue-600" />
                                            <span className="font-semibold text-blue-700">{transferSummary.to}</span>
                                        </div>
                                    </div>

                                    {transferForm.quantity && (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                            <p className="text-xs text-amber-600 uppercase tracking-wider">Quantity</p>
                                            <p className="text-3xl font-bold text-amber-700 mt-1">{transferForm.quantity}</p>
                                            <p className="text-xs text-amber-600 mt-1">units to transfer</p>
                                        </div>
                                    )}

                                    <div className={(
                                        "rounded-lg border p-4",
                                        transferSummary.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                                    )}>
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Form Status</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {transferSummary.isValid ? (
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Ready to Submit
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                                                    {transferForm.fromBranch === transferForm.toBranch && transferForm.fromBranch
                                                        ? "Same branch selected"
                                                        : "Missing required fields"}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}
