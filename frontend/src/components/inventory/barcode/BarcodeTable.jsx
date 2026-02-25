"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Barcode, Copy } from "lucide-react"

export function BarcodeTable({
    items,
    filteredItems,
    onSelectItem,
    onSelectAll,
    onUpdateQuantity,
    onQuickPrint,
    onCopyBarcode
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">
                        <Checkbox
                            checked={
                                filteredItems.length > 0 &&
                                filteredItems.every((item) => item.selected)
                            }
                            onCheckedChange={(checked) => onSelectAll(checked)}
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
                {items.map((item, index) => {
                    const globalIndex = filteredItems.findIndex(fi =>
                        fi.product._id === item.product._id &&
                        fi.variant._id === item.variant._id
                    )

                    return (
                        <TableRow key={`${item.product._id}-${item.variant._id}`}>
                            <TableCell>
                                <Checkbox
                                    checked={item.selected}
                                    onCheckedChange={(checked) =>
                                        onSelectItem(globalIndex, checked)
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
                                        onClick={() => onCopyBarcode(item.barcode)}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>${item.variant.price?.retailPrice?.toFixed(2)}</TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={item.printQuantity}
                                    onChange={(e) =>
                                        onUpdateQuantity(globalIndex, Number.parseInt(e.target.value) || 1)
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
                                        title="Select & Print this barcode"
                                        onClick={() => onQuickPrint(globalIndex)}
                                    >
                                        <Barcode className="h-4 w-4 text-primary" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}