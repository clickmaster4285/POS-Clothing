import { useState, useEffect, useMemo, useCallback } from "react"

function generateFallbackBarcode(product, variant) {
    const prefix = product.sku?.slice(0, 8) || "PRODXXXX"
    const sizePart = variant.size ? variant.size.substring(0, 2).toUpperCase() : "XX"
    const colorPart = variant.color ? variant.color.substring(0, 3).toUpperCase() : "XXX"
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${sizePart}-${colorPart}-${random}`
}

export function BarcodeItems(products, searchTerm, categoryFilter) {
    const [barcodeItems, setBarcodeItems] = useState([])

    useEffect(() => {
        if (!products || products.length === 0) return

        const items = products.flatMap(product =>
            product.variants.map(variant => ({
                product,
                variant,
                barcode: variant.variantBarcode || variant.variantSku || generateFallbackBarcode(product, variant),
                selected: false,
                printQuantity: 1,
            }))
        )

        setBarcodeItems(items)
    }, [products])

    const filteredItems = useMemo(() => {
        return barcodeItems.filter((item) => {
            const matchesSearch =
                item.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.barcode.includes(searchTerm)
            const matchesCategory =
                categoryFilter === "all" || item.product.category.id === categoryFilter
            return matchesSearch && matchesCategory
        })
    }, [barcodeItems, searchTerm, categoryFilter])

    const selectedItems = useMemo(() => {
        return barcodeItems.filter((item) => item.selected)
    }, [barcodeItems])

    const totalLabels = useMemo(() => {
        return selectedItems.reduce((acc, item) => acc + item.printQuantity, 0)
    }, [selectedItems])

    const handleSelectItem = useCallback((index, checked) => {
        setBarcodeItems(prev =>
            prev.map((item, i) =>
                filteredItems[index] === item ? { ...item, selected: checked } : item
            )
        )
    }, [filteredItems])

    const handleSelectAll = useCallback((checked) => {
        setBarcodeItems(prev =>
            prev.map((item) =>
                filteredItems.includes(item) ? { ...item, selected: checked } : item
            )
        )
    }, [filteredItems])

    const handleUpdateQuantity = useCallback((index, quantity) => {
        setBarcodeItems(prev =>
            prev.map((item, i) =>
                filteredItems[index] === item ? { ...item, printQuantity: Math.max(1, quantity) } : item
            )
        )
    }, [filteredItems])

    const handleQuickPrint = useCallback((index) => {
        const itemToPrint = filteredItems[index]
        if (!itemToPrint) return

        setBarcodeItems(prevItems =>
            prevItems.map(item =>
                item === itemToPrint
                    ? { ...item, selected: true, printQuantity: Math.max(1, item.printQuantity) }
                    : item
            )
        )
    }, [filteredItems])

    return {
        barcodeItems,
        setBarcodeItems,
        filteredItems,
        selectedItems,
        totalLabels,
        handleSelectItem,
        handleSelectAll,
        handleUpdateQuantity,
        handleQuickPrint
    }
}