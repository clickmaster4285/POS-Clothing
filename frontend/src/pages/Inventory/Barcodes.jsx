"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Settings } from "lucide-react"

import { BarcodeStats } from "@/components/inventory/barcode/BarcodeStats"
import { GenerateBarcodesTab } from "@/components/inventory/barcode/GenerateBarcodesTab"
import { PrintQueueTab } from "@/components/inventory/barcode/PrintQueueTab"
import { PrintDialog } from "@/components/inventory/barcode/PrintDialog"
import { TemplateDialog } from "@/components/inventory/barcode/TemplateDialog"

import { useProducts } from "@/hooks/inv_hooks/useProducts"
import { BarcodeItems } from "@/components/inventory/barcode/BarcodeItems"

export default function BarcodeManagementPage() {
    const [activeTab, setActiveTab] = useState("generate")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState("standard")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const { data: productsData } = useProducts()
    const products = productsData?.data || []

    const {
        barcodeItems,
        setBarcodeItems,
        filteredItems,
        selectedItems,
        totalLabels,
        handleSelectItem,
        handleSelectAll,
        handleUpdateQuantity,
        handleQuickPrint
    } = BarcodeItems(products, searchTerm, categoryFilter)

    const stats = {
        totalProducts: barcodeItems.length,
        withBarcode: barcodeItems.filter((item) => item.barcode).length,
        selectedItems: selectedItems.length,
        totalLabels,
    }

    const templates = [
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
    ]

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

            <BarcodeStats stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="generate">Generate Barcodes</TabsTrigger>
                    <TabsTrigger value="print-queue">Print Queue</TabsTrigger>
                </TabsList>

                <TabsContent value="generate" className="space-y-4">
                    <GenerateBarcodesTab
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        filteredItems={filteredItems}
                        paginatedItems={filteredItems.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                        )}
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        onSelectItem={handleSelectItem}
                        onSelectAll={handleSelectAll}
                        onUpdateQuantity={handleUpdateQuantity}
                        onQuickPrint={handleQuickPrint}
                        onCopyBarcode={(barcode) => navigator.clipboard.writeText(barcode)}
                    />
                </TabsContent>

                <TabsContent value="print-queue" className="space-y-4">
                    <PrintQueueTab
                        selectedItems={selectedItems}
                        onPrintAll={() => setIsPrintDialogOpen(true)}
                    />
                </TabsContent>
            </Tabs>

            <PrintDialog
                open={isPrintDialogOpen}
                onOpenChange={setIsPrintDialogOpen}
                selectedItems={selectedItems}
                totalLabels={totalLabels}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                templates={templates}
            />

            <TemplateDialog
                open={isTemplateDialogOpen}
                onOpenChange={setIsTemplateDialogOpen}
                templates={templates}
            />
        </>
    )
}