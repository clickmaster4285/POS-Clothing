
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload, X, Globe } from "lucide-react"
const API_URL = import.meta.env.VITE_API_URL;


export function BrandFormDialog({
    isOpen,
    onOpenChange,
    brandForm,
    setBrandForm,
    isEditMode,
    isUploading,
    categories,
    handleAddBrand,
    handleBrandLogoUpload
}) {
    const brandLogoRef = useRef(null)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Brand" : "Add New Brand"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Logo Upload Section */}
                    <div className="space-y-2">
                        <Label>Brand Logo</Label>
                        <div className="flex items-center gap-4">
                            {brandForm.logoPreview ? (
                                <div className="relative">
                                    <img
                                        src={
                                            brandForm.logoPreview?.startsWith("http")
                                                ? brandForm.logoPreview
                                                : brandForm.logoPreview?.startsWith("blob:")
                                                    ? brandForm.logoPreview
                                                    : `${API_URL}${brandForm.logoPreview}`
                                        }
                                        alt="Brand logo preview"
                                        className="h-32 w-32 rounded-lg object-cover border"
                                    />


                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6"
                                        onClick={() => setBrandForm(prev => ({ ...prev,logo:null, logoPreview: "" }))}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="h-32 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => brandLogoRef.current?.click()}
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Upload Logo</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Recommended: 400x400px, transparent background PNG
                                </p>
                                <input
                                    type="file"
                                    ref={brandLogoRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleBrandLogoUpload}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => brandLogoRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Uploading..." : "Choose File"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Brand Name *</Label>
                            <Input
                                value={brandForm.brandName}
                                onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                                placeholder="Enter brand name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Brand Code *</Label>
                            <Input
                                value={brandForm.brandCode}
                                onChange={(e) =>
                                    setBrandForm({ ...brandForm, brandCode: e.target.value.toUpperCase() })
                                }
                                placeholder="e.g., NK"
                                maxLength={5}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={brandForm.website}
                                    onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })}
                                    placeholder="https://example.com"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Country of Origin</Label>
                            <Input
                                value={brandForm.countryOfOrigin}
                                onChange={(e) => setBrandForm({ ...brandForm, countryOfOrigin: e.target.value })}
                                placeholder="e.g., United States"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Categories</Label>
                        <Select
                            value={brandForm.categories[0] || "none"}
                            onValueChange={(value) =>
                                setBrandForm(prev => ({
                                    ...prev,
                                    categories: value && value !== "none" ? [value] : []
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id || cat.id} value={cat._id || cat.id}>
                                        {cat.categoryName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={brandForm.description}
                            onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                            placeholder="Enter brand description"
                            rows={3}
                        />
                    </div>

                    {/* <div className="flex items-center justify-between">
                        <Label>Active Status</Label>
                        <Switch
                            checked={brandForm.isActive}
                            onCheckedChange={(checked) => setBrandForm({ ...brandForm, isActive: checked })}
                        />
                    </div> */}

                    {/* SEO Section */}
                    <div className="space-y-4 border-t pt-4">
                        <Label className="text-lg">SEO Settings</Label>
                        <div className="space-y-2">
                            <Label>Meta Title</Label>
                            <Input
                                value={brandForm.seo.metaTitle}
                                onChange={(e) =>
                                    setBrandForm({
                                        ...brandForm,
                                        seo: { ...brandForm.seo, metaTitle: e.target.value }
                                    })
                                }
                                placeholder="Meta title for SEO"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Meta Description</Label>
                            <Textarea
                                value={brandForm.seo.metaDescription}
                                onChange={(e) =>
                                    setBrandForm({
                                        ...brandForm,
                                        seo: { ...brandForm.seo, metaDescription: e.target.value }
                                    })
                                }
                                placeholder="Meta description for SEO"
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input
                                value={brandForm.seo.slug}
                                onChange={(e) =>
                                    setBrandForm({
                                        ...brandForm,
                                        seo: { ...brandForm.seo, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }
                                    })
                                }
                                placeholder="URL-friendly slug"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddBrand}
                        disabled={!brandForm.brandName || !brandForm.brandCode || isUploading}
                    >
                        {isEditMode ? "Save Changes" : "Add Brand"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}