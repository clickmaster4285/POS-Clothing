"use client"

import { useState } from "react"

import { StatCard } from "@/components/inventory/stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
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
    ClipboardCheck,
    Search,
    Plus,
    MoreVertical,
    Eye,
    Play,
    CheckCircle,
    AlertTriangle,
    FileText,
    Calendar,
    TrendingDown,
} from "lucide-react"


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

export const dummyStockCounts = [
    {
        id: "1",
        countNumber: "CNT-2025-001",
        branch: dummyBranches[0],
        location: "store",
        countType: "physical",
        countDate: "2025-01-25",
        countedBy: ["John Manager", "Jane Staff"],
        items: [
            { product: dummyProducts[0], variantId: "1a", expectedQuantity: 50, countedQuantity: 48, variance: -2, variancePercent: -4, remarks: "2 units missing" },
            { product: dummyProducts[0], variantId: "1b", expectedQuantity: 30, countedQuantity: 30, variance: 0, variancePercent: 0 },
            { product: dummyProducts[1], variantId: "2a", expectedQuantity: 15, countedQuantity: 14, variance: -1, variancePercent: -6.67, remarks: "1 unit not found" },
        ],
        status: "completed",
        totalExpected: 95,
        totalCounted: 92,
        totalVariance: -3,
    },
    {
        id: "2",
        countNumber: "CNT-2025-002",
        branch: dummyBranches[0],
        countType: "cycle",
        countDate: "2025-01-30",
        countedBy: ["Jane Staff"],
        items: [
            { product: dummyProducts[2], variantId: "3a", expectedQuantity: 25, countedQuantity: 0, variance: 0, variancePercent: 0 },
            { product: dummyProducts[2], variantId: "3b", expectedQuantity: 20, countedQuantity: 0, variance: 0, variancePercent: 0 },
        ],
        status: "in-progress",
        totalExpected: 45,
        totalCounted: 0,
        totalVariance: 0,
    },
]

export const dummyPurchaseOrders = [
    {
        id: "1",
        poNumber: "PO-2025-001",
        branch: dummyBranches[0],
        supplier: dummySuppliers[0],
        orderDate: "2025-01-15",
        expectedDeliveryDate: "2025-01-25",
        items: [
            { product: dummyProducts[0], variantId: "1a", quantity: 100, unitCost: 15, lineTotal: 1500, receivedQuantity: 100 },
            { product: dummyProducts[0], variantId: "1b", quantity: 100, unitCost: 15, lineTotal: 1500, receivedQuantity: 100 },
        ],
        subtotal: 3000,
        tax: 300,
        shippingCost: 50,
        totalAmount: 3350,
        status: "received",
        createdBy: "Purchasing Dept",
    },
    {
        id: "2",
        poNumber: "PO-2025-002",
        branch: dummyBranches[0],
        supplier: dummySuppliers[1],
        orderDate: "2025-01-28",
        expectedDeliveryDate: "2025-02-05",
        items: [
            { product: dummyProducts[1], variantId: "2a", quantity: 50, unitCost: 60, lineTotal: 3000, receivedQuantity: 0 },
            { product: dummyProducts[1], variantId: "2b", quantity: 50, unitCost: 60, lineTotal: 3000, receivedQuantity: 0 },
        ],
        subtotal: 6000,
        tax: 600,
        shippingCost: 100,
        totalAmount: 6700,
        status: "sent",
        createdBy: "Purchasing Dept",
    },
    {
        id: "3",
        poNumber: "PO-2025-003",
        branch: dummyBranches[1],
        supplier: dummySuppliers[0],
        orderDate: "2025-01-29",
        items: [
            { product: dummyProducts[2], variantId: "3a", quantity: 30, unitCost: 25, lineTotal: 750, receivedQuantity: 0 },
        ],
        subtotal: 750,
        tax: 75,
        shippingCost: 25,
        totalAmount: 850,
        status: "pending-approval",
        createdBy: "Mall Manager",
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
export const dummyAuditReports = [
    {
        id: "1",
        branch: dummyBranches[0],
        reportDate: "2025-01-26",
        reportType: "discrepancy",
        period: { startDate: "2025-01-01", endDate: "2025-01-25" },
        findings: [
            { description: "Stock variance for T-Shirt Black S", product: dummyProducts[0], variantId: "1a", quantity: 2, value: 30, reason: "Shrinkage" },
            { description: "Stock variance for Sneakers Red/Black 40", product: dummyProducts[1], variantId: "2a", quantity: 1, value: 60, reason: "Shrinkage" },
        ],
        totalShrinkage: 3,
        shrinkagePercent: 3.16,
        preparedBy: "John Manager",
    },
]


export default function StockAuditPage() {
    const [activeTab, setActiveTab] = useState("counts")
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isCreateCountDialogOpen, setIsCreateCountDialogOpen] = useState(false)
    const [isCountDialogOpen, setIsCountDialogOpen] = useState(false)
    const [selectedCount, setSelectedCount] = useState(null)
    const [stockCounts, setStockCounts] = useState(dummyStockCounts)
    const [auditReports] = useState(dummyAuditReports)

    // Form state for new count
    const [countForm, setCountForm] = useState({
        branch: "",
        countType: "physical",
        countDate: "",
        location: "",
    })

    // Count entry state
    const [countEntries, setCountEntries] = useState({})

    const filteredCounts = stockCounts.filter((count) => {
        const matchesSearch = count.countNumber.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || count.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        totalCounts: stockCounts.length,
        inProgress: stockCounts.filter((c) => c.status === "in-progress").length,
        completed: stockCounts.filter((c) => c.status === "completed").length,
        totalVariance: stockCounts.reduce((acc, c) => acc + Math.abs(c.totalVariance), 0),
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
            case "approved":
                return "bg-green-50 text-green-700 border-green-200"
            case "in-progress":
                return "bg-blue-50 text-blue-700 border-blue-200"
            case "scheduled":
                return "bg-amber-50 text-amber-700 border-amber-200"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    const handleCreateCount = () => {
        const branch = dummyBranches.find((b) => b.id === countForm.branch)
        if (!branch) return

        // Create count items from products
        const items = dummyProducts.slice(0, 3).flatMap((product) =>
            product.variants.slice(0, 1).map((variant) => ({
                product,
                variantId: variant.id,
                expectedQuantity: Math.floor(Math.random() * 50) + 10,
                countedQuantity: 0,
                variance: 0,
                variancePercent: 0,
            }))
        )

        const newCount = {
            id: String(stockCounts.length + 1),
            countNumber: `CNT-2025-${String(stockCounts.length + 1).padStart(3, "0")}`,
            branch,
            location: countForm.location || undefined,
            countType: countForm.countType,
            countDate: countForm.countDate || new Date().toISOString().split("T")[0],
            countedBy: ["Current User"],
            items,
            status: "scheduled",
            totalExpected: items.reduce((acc, item) => acc + item.expectedQuantity, 0),
            totalCounted: 0,
            totalVariance: 0,
        }

        setStockCounts([newCount, ...stockCounts])
        setIsCreateCountDialogOpen(false)
        setCountForm({ branch: "", countType: "physical", countDate: "", location: "" })
    }

    const handleStartCount = (count) => {
        // Initialize count entries
        const entries = {}
        for (const item of count.items) {
            entries[`${item.product.id}-${item.variantId}`] = item.countedQuantity
        }
        setCountEntries(entries)
        setSelectedCount(count)
        setIsCountDialogOpen(true)

        // Update status to in-progress
        setStockCounts(
            stockCounts.map((c) =>
                c.id === count.id ? { ...c, status: "in-progress" } : c
            )
        )
    }

    const handleUpdateCountEntry = (productId, variantId, value) => {
        setCountEntries({
            ...countEntries,
            [`${productId}-${variantId}`]: value,
        })
    }

    const handleSubmitCount = () => {
        if (!selectedCount) return

        const updatedItems = selectedCount.items.map((item) => {
            const counted = countEntries[`${item.product.id}-${item.variantId}`] || 0
            const variance = counted - item.expectedQuantity
            const variancePercent =
                item.expectedQuantity > 0 ? (variance / item.expectedQuantity) * 100 : 0
            return {
                ...item,
                countedQuantity: counted,
                variance,
                variancePercent,
            }
        })

        const totalCounted = updatedItems.reduce((acc, item) => acc + item.countedQuantity, 0)
        const totalVariance = updatedItems.reduce((acc, item) => acc + item.variance, 0)

        setStockCounts(
            stockCounts.map((c) =>
                c.id === selectedCount.id
                    ? {
                        ...c,
                        items: updatedItems,
                        totalCounted,
                        totalVariance,
                        status: "completed",
                    }
                    : c
            )
        )

        setIsCountDialogOpen(false)
        setSelectedCount(null)
        setCountEntries({})
    }

    const calculateProgress = (count) => {
        const countedItems = count.items.filter((item) => item.countedQuantity > 0).length
        return count.items.length > 0 ? (countedItems / count.items.length) * 100 : 0
    }

    return (
        <>
           
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Stock Audit</h1>
                    <p className="text-muted-foreground">
                        Conduct stock counts and review audit reports
                    </p>
                </div>
                <Button onClick={() => setIsCreateCountDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Stock Count
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Counts"
                    value={stats.totalCounts}
                    icon={ClipboardCheck}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgress}
                    icon={Play}
                    bgColor="bg-amber-50"
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    icon={CheckCircle}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Total Variance"
                    value={stats.totalVariance}
                    icon={AlertTriangle}
                    bgColor="bg-red-50"
                    iconColor="text-red-600"
                />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="counts">Stock Counts</TabsTrigger>
                    <TabsTrigger value="reports">Audit Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="counts" className="space-y-4">
                    {/* Filters */}
                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by count number..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Counts Table */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Stock Counts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Count #</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Variance</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCounts.map((count) => (
                                        <TableRow key={count.id}>
                                            <TableCell className="font-medium">{count.countNumber}</TableCell>
                                            <TableCell>{count.countDate}</TableCell>
                                            <TableCell>{count.branch.name}</TableCell>
                                            <TableCell className="capitalize">{count.countType}</TableCell>
                                            <TableCell>{count.items.length} items</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={calculateProgress(count)} className="h-2 w-20" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {Math.round(calculateProgress(count))}%
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={(
                                                        "font-medium",
                                                        count.totalVariance < 0
                                                            ? "text-red-600"
                                                            : count.totalVariance > 0
                                                                ? "text-amber-600"
                                                                : "text-green-600"
                                                    )}
                                                >
                                                    {count.totalVariance > 0 ? "+" : ""}
                                                    {count.totalVariance}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={(getStatusColor(count.status))}>
                                                    {count.status.replace("-", " ")}
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
                                                        {(count.status === "scheduled" ||
                                                            count.status === "in-progress") && (
                                                                <DropdownMenuItem onClick={() => handleStartCount(count)}>
                                                                    <Play className="mr-2 h-4 w-4" />
                                                                    {count.status === "scheduled" ? "Start Count" : "Continue"}
                                                                </DropdownMenuItem>
                                                            )}
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        {count.status === "completed" && (
                                                            <DropdownMenuItem>
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Audit Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Report Date</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Findings</TableHead>
                                        <TableHead>Shrinkage</TableHead>
                                        <TableHead>Shrinkage %</TableHead>
                                        <TableHead>Prepared By</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {auditReports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium">{report.reportDate}</TableCell>
                                            <TableCell>{report.branch.name}</TableCell>
                                            <TableCell className="capitalize">{report.reportType}</TableCell>
                                            <TableCell>
                                                {report.period.startDate} - {report.period.endDate}
                                            </TableCell>
                                            <TableCell>{report.findings.length} items</TableCell>
                                            <TableCell className="text-red-600 font-medium">
                                                {report.totalShrinkage} units
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={(
                                                        report.shrinkagePercent > 5
                                                            ? "bg-red-50 text-red-700 border-red-200"
                                                            : report.shrinkagePercent > 2
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-green-50 text-green-700 border-green-200"
                                                    )}
                                                >
                                                    {report.shrinkagePercent.toFixed(2)}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{report.preparedBy}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Report
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            Export PDF
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
                </TabsContent>
            </Tabs>

            {/* Create Count Dialog */}
            <Dialog open={isCreateCountDialogOpen} onOpenChange={setIsCreateCountDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>New Stock Count</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Branch *</Label>
                            <Select
                                value={countForm.branch}
                                onValueChange={(value) => setCountForm({ ...countForm, branch: value })}
                            >
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
                        <div className="space-y-2">
                            <Label>Count Type *</Label>
                            <Select
                                value={countForm.countType}
                                onValueChange={(value) => setCountForm({ ...countForm, countType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="physical">Physical Count</SelectItem>
                                    <SelectItem value="cycle">Cycle Count</SelectItem>
                                    <SelectItem value="annual">Annual Count</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Count Date *</Label>
                            <Input
                                type="date"
                                value={countForm.countDate}
                                onChange={(e) => setCountForm({ ...countForm, countDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Location (Optional)</Label>
                            <Select
                                value={countForm.location}
                                onValueChange={(value) => setCountForm({ ...countForm, location: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="warehouse">Warehouse</SelectItem>
                                    <SelectItem value="store">Store</SelectItem>
                                    <SelectItem value="showroom">Showroom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateCountDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCount} disabled={!countForm.branch}>
                            Schedule Count
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Count Entry Dialog */}
            <Dialog open={isCountDialogOpen} onOpenChange={setIsCountDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Stock Count - {selectedCount?.countNumber}</DialogTitle>
                    </DialogHeader>
                    {selectedCount && (
                        <div className="space-y-4 py-4">
                            <div className="flex justify-between text-sm">
                                <span>Branch: {selectedCount.branch.name}</span>
                                <span>Date: {selectedCount.countDate}</span>
                                <span className="capitalize">Type: {selectedCount.countType}</span>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Variant</TableHead>
                                        <TableHead className="text-right">Expected</TableHead>
                                        <TableHead className="text-right w-[120px]">Counted</TableHead>
                                        <TableHead className="text-right">Variance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedCount.items.map((item) => {
                                        const variant = item.product.variants.find((v) => v.id === item.variantId)
                                        const counted =
                                            countEntries[`${item.product.id}-${item.variantId}`] || 0
                                        const variance = counted - item.expectedQuantity
                                        return (
                                            <TableRow key={`${item.product.id}-${item.variantId}`}>
                                                <TableCell className="font-medium">
                                                    {item.product.productName}
                                                </TableCell>
                                                <TableCell>
                                                    {variant?.size} / {variant?.color}
                                                </TableCell>
                                                <TableCell className="text-right">{item.expectedQuantity}</TableCell>
                                                <TableCell className="text-right">
                                                    <Input
                                                        type="number"
                                                        value={counted}
                                                        onChange={(e) =>
                                                            handleUpdateCountEntry(
                                                                item.product.id,
                                                                item.variantId,
                                                                Number.parseInt(e.target.value) || 0
                                                            )
                                                        }
                                                        className="w-20 text-right ml-auto"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={(
                                                            "font-medium",
                                                            variance < 0
                                                                ? "text-red-600"
                                                                : variance > 0
                                                                    ? "text-amber-600"
                                                                    : "text-green-600"
                                                        )}
                                                    >
                                                        {variance > 0 ? "+" : ""}
                                                        {variance}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCountDialogOpen(false)}>
                            Save Draft
                        </Button>
                        <Button onClick={handleSubmitCount}>Complete Count</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
