"use client"

import { useState, useRef } from "react"

import { StatCard } from "@/components/inventory/stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    Barcode,
    Search,
    Printer,
    Download,
    QrCode,
    Package,
    Tag,
    Plus,
    Settings,
    Eye,
    Copy,
} from "lucide-react"

export const dummyCategories= [
    { id: "1", categoryName: "Clothing", categoryCode: "CLT", isActive: true },
    { id: "2", categoryName: "Footwear", categoryCode: "FTW", isActive: true },
    { id: "3", categoryName: "Accessories", categoryCode: "ACC", isActive: true },
]

export const dummyBrands = [
    { id: "1", brandName: "Nike", brandCode: "NK", isActive: true },
    { id: "2", brandName: "Adidas", brandCode: "AD", isActive: true },
    { id: "3", brandName: "Puma", brandCode: "PM", isActive: true },
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

export default function BarcodeManagementPage() {
    const [activeTab, setActiveTab] = useState("generate")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState("standard")

    // Generate barcode items from products
    const [barcodeItems, setBarcodeItems] = useState(
        dummyProducts.flatMap((product) =>
            product.variants.map((variant) => ({
                product,
                variant,
                barcode: variant.variantBarcode || product.barcode || generateBarcode(),
                selected: false,
                printQuantity: 1,
            }))
        )
    )

    const [templates] = useState([
        {
            id: "standard",
            name: "Standard Label",
            size: "50mm x 25mm",
            showPrice: true,
            showSku: true,
            showName: true,
            barcodeType: "barcode",
        },
        {
            id: "compact",
            name: "Compact Label",
            size: "30mm x 20mm",
            showPrice: false,
            showSku: true,
            showName: false,
            barcodeType: "barcode",
        },
        {
            id: "shelf",
            name: "Shelf Label",
            size: "60mm x 40mm",
            showPrice: true,
            showSku: true,
            showName: true,
            barcodeType: "barcode",
        },
        {
            id: "qr",
            name: "QR Code Label",
            size: "40mm x 40mm",
            showPrice: true,
            showSku: false,
            showName: true,
            barcodeType: "qrcode",
        },
    ])

    function generateBarcode() {
        return String(Math.floor(Math.random() * 9000000000000) + 1000000000000)
    }

    const filteredItems = barcodeItems.filter((item) => {
        const matchesSearch =
            item.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode.includes(searchTerm)
        const matchesCategory =
            categoryFilter === "all" || item.product.category.id === categoryFilter
        return matchesSearch && matchesCategory
    })

    const selectedItems = barcodeItems.filter((item) => item.selected)
    const totalLabels = selectedItems.reduce((acc, item) => acc + item.printQuantity, 0)

    const handleSelectItem = (index, checked) => {
        setBarcodeItems(
            barcodeItems.map((item, i) =>
                filteredItems[index] === item ? { ...item, selected: checked } : item
            )
        )
    }

    const handleSelectAll = (checked) => {
        setBarcodeItems(
            barcodeItems.map((item) =>
                filteredItems.includes(item) ? { ...item, selected: checked } : item
            )
        )
    }

    const handleUpdateQuantity = (index, quantity) => {
        setBarcodeItems(
            barcodeItems.map((item, i) =>
                filteredItems[index] === item ? { ...item, printQuantity: Math.max(1, quantity) } : item
            )
        )
    }

    const handleRegenerateBarcode = (index) => {
        setBarcodeItems(
            barcodeItems.map((item, i) =>
                filteredItems[index] === item ? { ...item, barcode: generateBarcode() } : item
            )
        )
    }

    const handlePrint = () => {
        // In real app, this would trigger print
        setIsPrintDialogOpen(false)
        alert(`Printing ${totalLabels} labels...`)
    }

    const handleCopyBarcode = (barcode) => {
        navigator.clipboard.writeText(barcode)
    }

    const stats = {
        totalProducts: barcodeItems.length,
        withBarcode: barcodeItems.filter((item) => item.barcode).length,
        selectedItems: selectedItems.length,
        totalLabels,
    }

    const currentTemplate = templates.find((t) => t.id === selectedTemplate)

    return (
        <>
           
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Barcode Management</h1>
                    <p className="text-muted-foreground">Generate and print product barcodes</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsTemplateDialogOpen(true)}
                        className="gap-2"
                    >
                        <Settings className="h-4 w-4" />
                        Templates
                    </Button>
                    <Button
                        onClick={() => setIsPrintDialogOpen(true)}
                        disabled={selectedItems.length === 0}
                        className="gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Print Labels ({selectedItems.length})
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="With Barcode"
                    value={stats.withBarcode}
                    icon={Barcode}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Selected Items"
                    value={stats.selectedItems}
                    icon={Tag}
                    bgColor="bg-amber-50"
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Labels to Print"
                    value={stats.totalLabels}
                    icon={Printer}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="generate">Generate Barcodes</TabsTrigger>
                    <TabsTrigger value="print-queue">Print Queue</TabsTrigger>
                </TabsList>

                <TabsContent value="generate" className="space-y-4">
                    {/* Filters */}
                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by product, SKU, or barcode..."
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
                                        <SelectItem value="1">Clothing</SelectItem>
                                        <SelectItem value="2">Footwear</SelectItem>
                                        <SelectItem value="3">Accessories</SelectItem>
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
                            <CardTitle className="text-lg">Products ({filteredItems.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={
                                                    filteredItems.length > 0 &&
                                                    filteredItems.every((item) => item.selected)
                                                }
                                                onCheckedChange={(checked) => handleSelectAll(checked)}
                                            />
                                        </TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Variant</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Barcode</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="w-[100px]">Quantity</TableHead>
                                        <TableHead className="w-[120px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item, index) => (
                                        <TableRow key={`${item.product.id}-${item.variant.id}`}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={item.selected}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectItem(index, checked )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.product.productName}</TableCell>
                                            <TableCell>
                                                {item.variant.size} / {item.variant.color}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.variant.variantSku}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                                        {item.barcode}
                                                    </code>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => handleCopyBarcode(item.barcode)}
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>${item.variant.price.retailPrice.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={item.printQuantity}
                                                    onChange={(e) =>
                                                        handleUpdateQuantity(index, Number.parseInt(e.target.value) || 1)
                                                    }
                                                    className="w-20 text-center"
                                                    min={1}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRegenerateBarcode(index)}
                                                    >
                                                        <Barcode className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="print-queue" className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Print Queue ({selectedItems.length} items)</CardTitle>
                            {selectedItems.length > 0 && (
                                <Button size="sm" onClick={() => setIsPrintDialogOpen(true)} className="gap-2">
                                    <Printer className="h-4 w-4" />
                                    Print All
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {selectedItems.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Printer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No items in print queue</p>
                                    <p className="text-sm">Select items from the Generate tab to add them here</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedItems.map((item) => (
                                        <Card key={`${item.product.id}-${item.variant.id}`} className="border">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="font-medium text-sm">{item.product.productName}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {item.variant.size} / {item.variant.color}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline">{item.printQuantity}x</Badge>
                                                </div>
                                                {/* Barcode Preview */}
                                                <div className="bg-white border rounded-lg p-3 text-center">
                                                    <div className="h-12 bg-gradient-to-r from-black via-white to-black bg-[length:4px_100%] mb-2" />
                                                    <p className="font-mono text-xs">{item.barcode}</p>
                                                </div>
                                                <div className="mt-3 text-sm">
                                                    <p>SKU: {item.variant.variantSku}</p>
                                                    <p className="font-bold">${item.variant.price.retailPrice.toFixed(2)}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Print Dialog */}
            <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Print Labels</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Label Template</Label>
                            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name} ({template.size})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {currentTemplate && (
                            <div className="bg-muted rounded-lg p-4 space-y-2">
                                <h4 className="font-medium">Template Preview</h4>
                                <div className="text-sm space-y-1">
                                    <p>Size: {currentTemplate.size}</p>
                                    <p>Type: {currentTemplate.barcodeType === "qrcode" ? "QR Code" : "Barcode"}</p>
                                    <div className="flex gap-2 mt-2">
                                        {currentTemplate.showName && (
                                            <Badge variant="outline">Name</Badge>
                                        )}
                                        {currentTemplate.showSku && <Badge variant="outline">SKU</Badge>}
                                        {currentTemplate.showPrice && (
                                            <Badge variant="outline">Price</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-muted rounded-lg p-4">
                            <div className="flex justify-between text-sm">
                                <span>Selected Items:</span>
                                <span className="font-medium">{selectedItems.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Total Labels:</span>
                                <span className="font-medium">{totalLabels}</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePrint} className="gap-2">
                            <Printer className="h-4 w-4" />
                            Print Labels
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Template Settings Dialog */}
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Label Templates</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Template Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Fields</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell className="font-medium">{template.name}</TableCell>
                                        <TableCell>{template.size}</TableCell>
                                        <TableCell className="capitalize">{template.barcodeType}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {template.showName && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Name
                                                    </Badge>
                                                )}
                                                {template.showSku && (
                                                    <Badge variant="outline" className="text-xs">
                                                        SKU
                                                    </Badge>
                                                )}
                                                {template.showPrice && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Price
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                            Close
                        </Button>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
