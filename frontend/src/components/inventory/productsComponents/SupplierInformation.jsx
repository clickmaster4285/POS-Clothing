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

       

             
            </CardContent>
        </Card>
    )
}