"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, Download } from "lucide-react"
import { BarcodeTable } from "./BarcodeTable"
import { Pagination } from "@/components/ui/Pagination"

export function GenerateBarcodesTab({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    filteredItems,
    paginatedItems,
    currentPage,
    totalPages,
    onPageChange,
    onSelectItem,
    onSelectAll,
    onUpdateQuantity,
    onQuickPrint,
    onCopyBarcode
}) {
    return (
        <>
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
                    <BarcodeTable
                        items={paginatedItems}
                        filteredItems={filteredItems}
                        onSelectItem={onSelectItem}
                        onSelectAll={onSelectAll}
                        onUpdateQuantity={onUpdateQuantity}
                        onQuickPrint={onQuickPrint}
                        onCopyBarcode={onCopyBarcode}
                    />
                </CardContent>
            </Card>

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </>
    )
}