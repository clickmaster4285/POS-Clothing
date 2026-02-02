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
import {
    FileText,
    Search,
    Plus,
    MoreVertical,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    Send,
    Package,
    DollarSign,
    Clock,
    List,
    ShoppingCart,
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





export default function PurchaseOrdersPage() {
    const [activeTab, setActiveTab] = useState("orders-list")
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [orders, setOrders] = useState(dummyPurchaseOrders)
    const [selectedOrder, setSelectedOrder] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        branch: "",
        supplier: "",
        expectedDeliveryDate: "",
    })

    // Order items
    const [orderItems, setOrderItems] = useState([])

    // Current item being added
    const [currentItem, setCurrentItem] = useState({
        productId: "",
        variantId: "",
        quantity: "",
        unitCost: "",
    })

    const resetForm = () => {
        setFormData({ branch: "", supplier: "", expectedDeliveryDate: "" })
        setOrderItems([])
        setCurrentItem({ productId: "", variantId: "", quantity: "", unitCost: "" })
    }

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        totalOrders: orders.length,
        pendingApproval: orders.filter((o) => o.status === "pending-approval").length,
        inTransit: orders.filter((o) => o.status === "sent").length,
        totalValue: orders.reduce((acc, o) => acc + o.totalAmount, 0),
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "received":
                return "bg-green-50 text-green-700 border-green-200"
            case "pending-approval":
            case "draft":
                return "bg-amber-50 text-amber-700 border-amber-200"
            case "approved":
                return "bg-blue-50 text-blue-700 border-blue-200"
            case "sent":
                return "bg-purple-50 text-purple-700 border-purple-200"
            case "cancelled":
                return "bg-red-50 text-red-700 border-red-200"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    const handleAddItem = () => {
        if (!currentItem.productId || !currentItem.variantId || !currentItem.quantity || !currentItem.unitCost) return
        setOrderItems([...orderItems, { ...currentItem }])
        setCurrentItem({ productId: "", variantId: "", quantity: "", unitCost: "" })
    }

    const handleRemoveItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index))
    }

    const handleCreateOrder = () => {
        if (!formData.branch || !formData.supplier || orderItems.length === 0) return

        const branch = dummyBranches.find((b) => b.id === formData.branch)
        const supplier = dummySuppliers.find((s) => s.id === formData.supplier)

        const items= orderItems.map((item) => {
            const product = dummyProducts.find((p) => p.id === item.productId)
            const quantity = Number.parseInt(item.quantity)
            const unitCost = Number.parseFloat(item.unitCost)
            return {
                product,
                variantId: item.variantId,
                quantity,
                unitCost,
                lineTotal: quantity * unitCost,
                receivedQuantity: 0,
            }
        })

        const subtotal = items.reduce((acc, item) => acc + item.lineTotal, 0)
        const tax = subtotal * 0.1
        const shippingCost = 50

        const newOrder = {
            id: String(Date.now()),
            poNumber: `PO-2025-${String(orders.length + 1).padStart(3, "0")}`,
            branch,
            supplier,
            orderDate: new Date().toISOString().split("T")[0],
            expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
            items,
            subtotal,
            tax,
            shippingCost,
            totalAmount: subtotal + tax + shippingCost,
            status: "draft",
            createdBy: "Current User",
        }

        setOrders([newOrder, ...orders])
        resetForm()
        setActiveTab("orders-list")
    }

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    }

    const handleDeleteOrder = (orderId) => {
        setOrders(orders.filter((o) => o.id !== orderId))
    }

    const currentProductVariants = dummyProducts.find((p) => p.id === currentItem.productId)?.variants || []

    // Calculate order summary
    const orderSubtotal = orderItems.reduce((acc, item) => {
        return acc + (Number.parseInt(item.quantity) || 0) * (Number.parseFloat(item.unitCost) || 0)
    }, 0)
    const orderTax = orderSubtotal * 0.1
    const orderShipping = orderItems.length > 0 ? 50 : 0
    const orderTotal = orderSubtotal + orderTax + orderShipping

    const formSummary = {
        supplier: dummySuppliers.find((s) => s.id === formData.supplier)?.supplierName || "Not selected",
        branch: dummyBranches.find((b) => b.id === formData.branch)?.name || "Not selected",
        itemCount: orderItems.length,
        isValid: formData.branch && formData.supplier && orderItems.length > 0,
    }

    return (
        <>
           

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
                    <p className="text-muted-foreground">Manage purchase orders and supplier deliveries</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                    <Clock className="h-3 w-3" />
                    {stats.pendingApproval} Pending Approval
                </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-card border border-border">
                    <TabsTrigger value="orders-list" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <List className="h-4 w-4" />
                        Orders List
                    </TabsTrigger>
                    <TabsTrigger value="create-order" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        <Plus className="h-4 w-4" />
                        Create Order
                    </TabsTrigger>
                </TabsList>

                {/* Orders List Tab */}
                <TabsContent value="orders-list" className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-blue-50 p-3">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.totalOrders}</p>
                                        <p className="text-sm text-muted-foreground">Total Orders</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-amber-50 p-3">
                                        <Clock className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.pendingApproval}</p>
                                        <p className="text-sm text-muted-foreground">Pending Approval</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-purple-50 p-3">
                                        <Send className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats.inTransit}</p>
                                        <p className="text-sm text-muted-foreground">In Transit</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-green-50 p-3">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">Total Value</p>
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
                                            placeholder="Search by PO number or supplier..."
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
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending-approval">Pending Approval</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="sent">Sent</SelectItem>
                                        <SelectItem value="received">Received</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Purchase Orders ({filteredOrders.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>PO Number</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.poNumber}</TableCell>
                                            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{order.supplier.supplierName}</TableCell>
                                            <TableCell>{order.branch.name}</TableCell>
                                            <TableCell>{order.items.length} items</TableCell>
                                            <TableCell className="font-medium">${order.totalAmount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={(getStatusColor(order.status))}>
                                                    {order.status.replace("-", " ")}
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
                                                        <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        {order.status === "draft" && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, "pending-approval")}>
                                                                    <Send className="mr-2 h-4 w-4" />
                                                                    Submit for Approval
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-destructive">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {order.status === "pending-approval" && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, "approved")}>
                                                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                                    Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")} className="text-destructive">
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Reject
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {order.status === "approved" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "sent")}>
                                                                <Send className="mr-2 h-4 w-4" />
                                                                Mark as Sent
                                                            </DropdownMenuItem>
                                                        )}
                                                        {order.status === "sent" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "received")}>
                                                                <Package className="mr-2 h-4 w-4 text-green-600" />
                                                                Mark as Received
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

                    {/* Order Details Panel */}
                    {selectedOrder && (
                        <Card className="border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-lg">Order Details: {selectedOrder.poNumber}</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Supplier</p>
                                        <p className="font-medium">{selectedOrder.supplier.supplierName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Branch</p>
                                        <p className="font-medium">{selectedOrder.branch.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order Date</p>
                                        <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Expected Delivery</p>
                                        <p className="font-medium">{selectedOrder.expectedDeliveryDate || "N/A"}</p>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Variant</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Unit Cost</TableHead>
                                            <TableHead className="text-right">Line Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedOrder.items.map((item, idx) => {
                                            const variant = item.product.variants.find((v) => v.id === item.variantId)
                                            return (
                                                <TableRow key={idx}>
                                                    <TableCell>{item.product.productName}</TableCell>
                                                    <TableCell>{variant?.size || "Default"} / {variant?.color || "Default"}</TableCell>
                                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                                    <TableCell className="text-right">${item.unitCost.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-medium">${item.lineTotal.toFixed(2)}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 flex justify-end">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal:</span>
                                            <span>${selectedOrder.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tax:</span>
                                            <span>${selectedOrder.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Shipping:</span>
                                            <span>${selectedOrder.shippingCost.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold border-t pt-2">
                                            <span>Total:</span>
                                            <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Create Order Tab */}
                <TabsContent value="create-order">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ShoppingCart className="h-5 w-5 text-primary" />
                                        Order Form
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Branch *</Label>
                                            <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
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
                                            <Label>Supplier *</Label>
                                            <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select supplier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dummySuppliers.map((supplier) => (
                                                        <SelectItem key={supplier.id} value={supplier.id}>
                                                            {supplier.supplierName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Expected Delivery Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.expectedDeliveryDate}
                                            onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                                        />
                                    </div>

                                    {/* Add Item Section */}
                                    <div className="border border-border rounded-lg p-4 space-y-4">
                                        <h4 className="font-medium">Add Item</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Product</Label>
                                                <Select value={currentItem.productId} onValueChange={(value) => setCurrentItem({ ...currentItem, productId: value, variantId: "" })}>
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
                                                <Label>Variant</Label>
                                                <Select
                                                    value={currentItem.variantId}
                                                    onValueChange={(value) => setCurrentItem({ ...currentItem, variantId: value })}
                                                    disabled={!currentItem.productId}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select variant" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currentProductVariants.map((variant) => (
                                                            <SelectItem key={variant.id} value={variant.id}>
                                                                {variant.size || "Default"} / {variant.color || "Default"}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Quantity</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={currentItem.quantity}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                                                    placeholder="Enter quantity"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Unit Cost</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={currentItem.unitCost}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, unitCost: e.target.value })}
                                                        placeholder="0.00"
                                                        className="pl-7"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleAddItem}
                                            disabled={!currentItem.productId || !currentItem.variantId || !currentItem.quantity || !currentItem.unitCost}
                                            className="w-full"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Item
                                        </Button>
                                    </div>

                                    {/* Order Items List */}
                                    {orderItems.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Order Items ({orderItems.length})</h4>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Product</TableHead>
                                                        <TableHead>Variant</TableHead>
                                                        <TableHead className="text-right">Qty</TableHead>
                                                        <TableHead className="text-right">Unit Cost</TableHead>
                                                        <TableHead className="text-right">Total</TableHead>
                                                        <TableHead className="w-[50px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {orderItems.map((item, idx) => {
                                                        const product = dummyProducts.find((p) => p.id === item.productId)
                                                        const variant = product?.variants.find((v) => v.id === item.variantId)
                                                        const lineTotal = Number.parseInt(item.quantity) * Number.parseFloat(item.unitCost)
                                                        return (
                                                            <TableRow key={idx}>
                                                                <TableCell>{product?.productName}</TableCell>
                                                                <TableCell>{variant?.size || "Default"} / {variant?.color || "Default"}</TableCell>
                                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                                <TableCell className="text-right">${Number.parseFloat(item.unitCost).toFixed(2)}</TableCell>
                                                                <TableCell className="text-right font-medium">${lineTotal.toFixed(2)}</TableCell>
                                                                <TableCell>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(idx)}>
                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <Button variant="outline" onClick={resetForm} className="bg-transparent">
                                            Clear Form
                                        </Button>
                                        <Button onClick={handleCreateOrder} disabled={!formSummary.isValid}>
                                            Create Order
                                        </Button>
                                    </div>
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
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Supplier</p>
                                        <p className="text-xl font-semibold mt-1">{formSummary.supplier}</p>
                                    </div>

                                    <div className="rounded-lg border border-border p-4">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Branch</p>
                                        <p className="text-xl font-semibold mt-1">{formSummary.branch}</p>
                                    </div>

                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <p className="text-xs text-blue-600 uppercase tracking-wider">Items</p>
                                        <p className="text-3xl font-bold text-blue-700 mt-1">{formSummary.itemCount}</p>
                                        <p className="text-xs text-blue-600 mt-1">items in order</p>
                                    </div>

                                    <div className="rounded-lg border border-border p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal:</span>
                                            <span>${orderSubtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax (10%):</span>
                                            <span>${orderTax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping:</span>
                                            <span>${orderShipping.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold border-t pt-2">
                                            <span>Total:</span>
                                            <span>${orderTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className={(
                                        "rounded-lg border p-4",
                                        formSummary.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                                    )}>
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Form Status</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {formSummary.isValid ? (
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Ready to Submit
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                                                    {orderItems.length === 0 ? "Add at least one item" : "Select branch and supplier"}
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
