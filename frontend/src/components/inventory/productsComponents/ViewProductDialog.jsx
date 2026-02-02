import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



export default function ViewProductDialog({
    isOpen,
    onOpenChange,
    product,
    onEdit
}) {
    if (!product) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="flex gap-6">
                        {product.primaryImage && (
                            <div className="h-32 w-32 rounded-lg bg-muted overflow-hidden">
                                <img
                                    src={product.primaryImage}
                                    alt={product.productName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-2xl font-semibold">{product.productName}</h3>
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-muted-foreground">SKU: {product.sku}</p>
                                {product.barcode && (
                                    <p className="text-muted-foreground">Barcode: {product.barcode}</p>
                                )}
                                <Badge className={
                                    product.isActive
                                        ? "bg-green-100 text-green-700 border-green-200"
                                        : "bg-red-100 text-red-700 border-red-200"
                                }>
                                    {product.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3">Basic Information</h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Category</p>
                                    <p className="font-medium">{product.category?.categoryName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Brand</p>
                                    <p className="font-medium">{product.brand?.brandName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Department</p>
                                    <p className="font-medium">{product.department}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3">Additional Information</h4>
                            <div className="space-y-3">
                                {product.season && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Season</p>
                                        <p className="font-medium">{product.season}</p>
                                    </div>
                                )}
                                {product.material && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Material</p>
                                        <p className="font-medium">{product.material}</p>
                                    </div>
                                )}
                                {product.countryOfOrigin && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Country of Origin</p>
                                        <p className="font-medium">{product.countryOfOrigin}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {product.variants && product.variants.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-3">Variants ({product.variants.length})</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Variant SKU</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Color</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Retail</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {product.variants.map((variant, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{variant.variantSku || product.sku}</TableCell>
                                            <TableCell>{variant.size || "-"}</TableCell>
                                            <TableCell>{variant.color || "-"}</TableCell>
                                            <TableCell>${variant.price?.costPrice?.toFixed(2) || "0.00"}</TableCell>
                                            <TableCell>${variant.price?.retailPrice?.toFixed(2) || "0.00"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {product.tags && product.tags.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.description && (
                        <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-muted-foreground">{product.description}</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={() => {
                        onOpenChange(false)
                        onEdit(product)
                    }}>
                        Edit Product
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}