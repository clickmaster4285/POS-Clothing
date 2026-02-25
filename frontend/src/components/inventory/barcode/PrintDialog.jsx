"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintDialog({
    open,
    onOpenChange,
    selectedItems,
    totalLabels,
    selectedTemplate,
    setSelectedTemplate,
    templates
}) {
    const handlePrint = () => {
        if (selectedItems.length === 0) return

        const activeElement = document.activeElement
        const scrollX = window.scrollX
        const scrollY = window.scrollY

        const printIframe = document.createElement('iframe')
        printIframe.style.position = 'absolute'
        printIframe.style.width = '0'
        printIframe.style.height = '0'
        printIframe.style.border = 'none'
        document.body.appendChild(printIframe)

        let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Print Barcode Labels</title>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
        <style>
            body {
                margin: 0;
                padding: 12mm;
                font-family: Arial, Helvetica, sans-serif;
            }
            .labels-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(85mm, 1fr));
                gap: 10mm 8mm;
            }
            .label {
                border: 1px solid #ddd;
                padding: 6mm;
                text-align: center;
                background: white;
                box-sizing: border-box;
                height: 50mm;
                width: 90mm;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-size: 10pt;
                page-break-inside: avoid;
            }
            svg.barcode {
                width: 100%;
                height: 34mm;
                margin: 4mm 0;
            }
            .label-price {
                font-weight: bold;
                font-size: 13pt;
            }
            @media print {
                body { padding: 0; margin: 0; }
                .labels-grid { gap: 0; }
                .label { border: none; }
                @page { size: A4 portrait; margin: 10mm; }
            }
        </style>
    </head>
    <body>
        <div class="labels-grid">
    `

        selectedItems.forEach(item => {
            const qty = Number(item.printQuantity) || 1
            const price = Number(item.variant?.price?.retailPrice || 0).toFixed(0)
            const barcodeValue = String(item.barcode || item.variant?.variantSku || 'NO-BARCODE')

            for (let i = 0; i < qty; i++) {
                html += `
            <div class="label">
                <svg class="barcode" data-barcode="${barcodeValue}"></svg>
                <div class="label-price">Rs. ${price}</div>
            </div>
            `
            }
        })

        html += `
        </div>
        <script>
            document.querySelectorAll('.barcode').forEach(el => {
                const value = el.getAttribute('data-barcode') || 'ERROR';
                JsBarcode(el, value, {
                    format: "CODE128",
                    width: 2.3,
                    height: 100,
                    displayValue: true,
                    fontSize: 14,
                    margin: 8,
                    lineColor: "#000000"
                });
            });
            
            setTimeout(() => {
                window.print();
            }, 1000);
        </script>
    </body>
    </html>
    `

        printIframe.contentDocument?.open()
        printIframe.contentDocument?.write(html)
        printIframe.contentDocument?.close()

        setTimeout(() => {
            window.focus()
            window.scrollTo(scrollX, scrollY)
            if (activeElement && document.contains(activeElement)) {
                activeElement.focus()
            }
        }, 100)

        // Fixed: Removed the equals sign after question mark
        if (printIframe.contentWindow) {
            printIframe.contentWindow.onafterprint = () => {
                document.body.removeChild(printIframe)
            }
        }

        onOpenChange(false)
    }

    const currentTemplate = templates.find((t) => t.id === selectedTemplate)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print Labels
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}