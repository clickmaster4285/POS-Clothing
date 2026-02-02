import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"



export default function TagsSection({
    formData,
    tagInput,
    setTagInput,
    onAddTag,
    onRemoveTag
}) {
    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Enter tag and press Add"
                        onKeyPress={(e) => e.key === 'Enter' && onAddTag()}
                    />
                    <Button type="button" onClick={onAddTag}>
                        Add
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <button
                                type="button"
                                onClick={() => onRemoveTag(tag)}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}