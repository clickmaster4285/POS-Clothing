"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Printer } from "lucide-react"

export function PrintQueueTab({ selectedItems, onPrintAll }) {
    return (
        <Card className="border-border/50">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Print Queue ({selectedItems.length} items)</CardTitle>
                {selectedItems.length > 0 && (
                    <Button size="sm" onClick={onPrintAll} className="gap-2">
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
                            <Card key={`${item.product._id}-${item.variant._id}`} className="border">
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
                                        <p className="font-bold">${item.variant.price?.retailPrice?.toFixed(2)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}