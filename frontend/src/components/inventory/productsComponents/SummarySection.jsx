import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"



export default function SummarySection({
    formSummary,
    showVariantSection
}) {
    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
                    <p className="text-xl font-semibold mt-1">{formSummary.category}</p>
                </div>

                <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Brand</p>
                    <p className="text-xl font-semibold mt-1">{formSummary.brand}</p>
                </div>

                {showVariantSection && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-xs text-amber-600 uppercase tracking-wider">Profit Margin</p>
                        <p className="text-3xl font-bold text-amber-700 mt-1">{formSummary.margin}%</p>
                        <p className="text-xs text-amber-600 mt-1">calculated margin</p>
                    </div>
                )}

                <div className={`rounded-lg border p-4 ${formSummary.isValid
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                    }`}>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Form Status</p>
                    <div className="flex items-center gap-2 mt-2">
                        {formSummary.isValid ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ready
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                                Missing required fields
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {formSummary.isValid
                            ? "All required fields are filled"
                            : "Please fill all required fields marked with *"}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}