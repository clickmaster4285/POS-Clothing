import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


export default function AdditionalInformation({
    formData,
    setFormData
}) {
    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="season">Season</Label>
                        <Input
                            id="season"
                            value={formData.season}
                            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                            placeholder="e.g., Summer 2024"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="collection">Collection</Label>
                        <Input
                            id="collection"
                            value={formData.collection}
                            onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                            placeholder="e.g., Spring Collection"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="material">Material</Label>
                        <Input
                            id="material"
                            value={formData.material}
                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                            placeholder="e.g., Cotton, Polyester"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                        <Input
                            id="countryOfOrigin"
                            value={formData.countryOfOrigin}
                            onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                            placeholder="e.g., Pakistan"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ageGroup">Age Group</Label>
                        <Input
                            id="ageGroup"
                            value={formData.ageGroup}
                            onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                            placeholder="e.g., Adult, Teen"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="styleType">Style Type</Label>
                        <Input
                            id="styleType"
                            value={formData.styleType}
                            onChange={(e) => setFormData({ ...formData, styleType: e.target.value })}
                            placeholder="e.g., Casual, Formal"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="careInstructions">Care Instructions</Label>
                    <Textarea
                        id="careInstructions"
                        value={formData.careInstructions}
                        onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                        placeholder="Enter care instructions"
                        rows={2}
                    />
                </div>
            </CardContent>
        </Card>
    )
}