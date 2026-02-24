import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

export default function SummarySection({ formSummary, showVariantSection }) {
   


    return (
        <div className="space-y-6">

            {/* Header */}
            <h3 className="text-2xl font-bold border-b pb-2">Product Summary</h3>

            {/* Basic Info */}
            <Card className="bg-muted/20 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" /> Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div><strong>Name:</strong> {formSummary.productName}</div>
                    <div><strong>SKU:</strong> {formSummary.sku}</div>
                  
                    <div><strong>Brand:</strong> {formSummary.brand}</div>
                    <div><strong>Category:</strong> {formSummary.category}</div>
                   
                    <div><strong>Department:</strong> {formSummary.department}</div>
                    <div><strong>Season:</strong> {formSummary.season}</div>
                    <div><strong>Collection:</strong> {formSummary.collection}</div>
                    <div><strong>Material:</strong> {formSummary.material}</div>
                    <div><strong>Care Instructions:</strong> {formSummary.careInstructions}</div>
                    <div><strong>Country of Origin:</strong> {formSummary.countryOfOrigin}</div>
                    <div><strong>Age Group:</strong> {formSummary.ageGroup}</div>
                    <div><strong>Gender:</strong> {formSummary.gender}</div>
                    <div><strong>Style Type:</strong> {formSummary.styleType}</div>
                    <div><strong>Status:</strong> {formSummary.isActive}</div>
                </CardContent>
            </Card>

                  {/* Variants */}
            { (
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold  pb-1">Variants</h4>
                    {formSummary.variants.map((v, idx) => (
                        <Card key={idx} className="bg-muted/10 shadow-md pt-5">
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div><strong>Size:</strong> {v.size}</div>
                                <div><strong>Style:</strong> {v.style}</div>
                             
                               
                                {/* <div><strong>SKU:</strong> {v.variantSku}</div> */}
                                <div><strong>Cost Price:</strong> {v.costPrice}</div>
                                <div><strong>Retail Price:</strong> {v.retailPrice}</div>
                                <div><strong>Margin:</strong> {v.margin}</div>
                                <div><strong>Supplier:</strong> {v.supplier}</div>
                                <div className="col-span-full">
                                    <strong>Stock:</strong>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {v.stockByAttribute.map((s, sIdx) => (
                                            <Badge key={sIdx} variant="outline" className="px-2 py-1">
                                                {s.color}: {s.quantity}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Tags */}
            <Card className="bg-muted/20 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {formSummary.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="px-3 py-1">
                            {tag}
                        </Badge>
                    ))}
                </CardContent>
            </Card>


      
        </div>
    )
}
