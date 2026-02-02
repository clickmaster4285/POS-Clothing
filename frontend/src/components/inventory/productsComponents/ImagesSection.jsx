import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"



export default function ImagesSection({
    formData,
    setFormData,
    imagePreviews,
    onImageUpload,
    onRemoveImage
}) {
    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Primary Image</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onImageUpload(e, false)}
                            className="cursor-pointer"
                        />
                        {formData.primaryImage && (
                            <span className="text-sm text-muted-foreground">{formData.primaryImage}</span>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Additional Images</Label>
                    <div className="grid grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    className="h-24 w-24 rounded-lg object-cover"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6"
                                    onClick={() => onRemoveImage(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                        <label className="cursor-pointer">
                            <div className="h-24 w-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-primary transition-colors">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground mt-1">Upload</span>
                            </div>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => onImageUpload(e, true)}
                            />
                        </label>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}