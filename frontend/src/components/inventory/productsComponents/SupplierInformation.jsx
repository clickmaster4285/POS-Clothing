import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



export default function SupplierInformation({
    formData,
    setFormData,
    suppliers
}) {
    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Select
                        value={formData.supplier.supplier}
                        onValueChange={(value) => setFormData({
                            ...formData,
                            supplier: { ...formData.supplier, supplier: value }
                        })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map((supplier) => (
                                <SelectItem key={supplier._id} value={supplier._id}>
                                    {supplier.company_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="supplierCode">Supplier Code</Label>
                        <Input
                            id="supplierCode"
                            value={formData.supplier.supplierCode}
                            onChange={(e) => setFormData({
                                ...formData,
                                supplier: { ...formData.supplier, supplierCode: e.target.value }
                            })}
                            placeholder="Supplier code"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="leadTime">Lead Time (days)</Label>
                        <Input
                            id="leadTime"
                            type="number"
                            value={formData.supplier.leadTime}
                            onChange={(e) => setFormData({
                                ...formData,
                                supplier: { ...formData.supplier, leadTime: e.target.value }
                            })}
                            placeholder="Days"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
                        <Input
                            id="minOrderQuantity"
                            type="number"
                            value={formData.supplier.minOrderQuantity}
                            onChange={(e) => setFormData({
                                ...formData,
                                supplier: { ...formData.supplier, minOrderQuantity: e.target.value }
                            })}
                            placeholder="Minimum quantity"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reorderLevel">Reorder Level</Label>
                        <Input
                            id="reorderLevel"
                            type="number"
                            value={formData.supplier.reorderLevel}
                            onChange={(e) => setFormData({
                                ...formData,
                                supplier: { ...formData.supplier, reorderLevel: e.target.value }
                            })}
                            placeholder="Reorder level"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}