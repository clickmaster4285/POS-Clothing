"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload, X, Plus, Trash2 } from "lucide-react"
const API_URL = import.meta.env.VITE_API_URL;
export function CategoryFormDialog({
    isOpen,
    onOpenChange,
    categoryForm,
    setCategoryForm,
    isEditMode,
    isUploading,
    parentCategories,
    categories,
    handleAddCategory,
    handleCategoryImageUpload,
    handleAddAttribute,
    handleRemoveAttribute,
    handleAttributeChange,
    handleAddOption,
    handleOptionChange,
    handleRemoveOption
}) {
    const categoryImageRef = useRef(null)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Image Upload Section */}
                    <div className="space-y-2">
                        <Label>Category Image</Label>
                        <div className="flex items-center gap-4">
                            {categoryForm.imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={
                                            categoryForm.imagePreview?.startsWith("http")
                                                ? categoryForm.imagePreview
                                                : categoryForm.imagePreview?.startsWith("blob:")
                                                    ? categoryForm.imagePreview
                                                    : `${API_URL}${categoryForm.imagePreview}`
                                        }
                                        alt="Category preview"
                                        className="h-32 w-32 rounded-lg object-cover border"
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6"
                                        onClick={() => setCategoryForm(prev => ({
                                            ...prev, image: null,
                                            imagePreview: "" }))}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="h-32 w-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => categoryImageRef.current?.click()}
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Upload Image</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Recommended: 400x400px, JPG, PNG, or WebP format
                                </p>
                                <input
                                    type="file"
                                    ref={categoryImageRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleCategoryImageUpload}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => categoryImageRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Uploading..." : "Choose File"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category Name *</Label>
                            <Input
                                value={categoryForm.categoryName}
                                onChange={(e) =>
                                    setCategoryForm({ ...categoryForm, categoryName: e.target.value })
                                }
                                placeholder="Enter category name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Category Code *</Label>
                            <Input
                                value={categoryForm.categoryCode}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        categoryCode: e.target.value.toUpperCase(),
                                    })
                                }
                                placeholder="e.g., CLT"
                                maxLength={5}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Parent Category (Optional)</Label>
                            <Select
                                value={categoryForm.parentCategory}
                                onValueChange={(value) =>
                                    setCategoryForm({ ...categoryForm, parentCategory: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Top Level)</SelectItem>
                                    {parentCategories
                                        .filter((cat) => cat._id !== categoryForm.id && cat.id !== categoryForm.id)
                                        .map((cat) => (
                                            <SelectItem key={cat._id || cat.id} value={cat._id || cat.id}>
                                                {cat.categoryName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select
                                value={categoryForm.department}
                                onValueChange={(value) =>
                                    setCategoryForm({ ...categoryForm, department: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Men", "Women", "Kids", "Unisex", "All"].map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Display Order</Label>
                            <Input
                                type="number"
                                value={categoryForm.displayOrder}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        displayOrder: Number(e.target.value),
                                    })
                                }
                                min="0"
                            />
                        </div>
                       
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={categoryForm.description}
                            onChange={(e) =>
                                setCategoryForm({ ...categoryForm, description: e.target.value })
                            }
                            placeholder="Enter category description"
                            rows={3}
                        />
                    </div>

                    {/* Attributes Section */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg">Attributes</Label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddAttribute}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Attribute
                            </Button>
                        </div>

                        {categoryForm.attributes.map((attr, index) => (
                            <div key={index} className="space-y-3 p-4 border rounded-lg">
                                <div className="flex items-center justify-between">
                                    <Label>Attribute #{index + 1}</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveAttribute(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Attribute name"
                                        value={attr.name}
                                        onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                    />
                                    <Select
                                        value={attr.type}
                                        onValueChange={(value) => handleAttributeChange(index, 'type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="select">Select</SelectItem>
                                            <SelectItem value="multiselect">Multi-Select</SelectItem>
                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(attr.type === 'select' || attr.type === 'multiselect') && (
                                    <div className="space-y-2">
                                        <Label>Options</Label>
                                        {attr.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex items-center gap-2">
                                                <Input
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveOption(index, optionIndex)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAddOption(index)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Option
                                        </Button>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={attr.isRequired}
                                        onCheckedChange={(checked) => handleAttributeChange(index, 'isRequired', checked)}
                                    />
                                    <Label>Required Field</Label>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEO Section */}
                    <div className="space-y-4 border-t pt-4">
                        <Label className="text-lg">SEO Settings</Label>
                        <div className="space-y-2">
                            <Label>Meta Title</Label>
                            <Input
                                value={categoryForm.seo.metaTitle}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        seo: { ...categoryForm.seo, metaTitle: e.target.value }
                                    })
                                }
                                placeholder="Meta title for SEO"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Meta Description</Label>
                            <Textarea
                                value={categoryForm.seo.metaDescription}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        seo: { ...categoryForm.seo, metaDescription: e.target.value }
                                    })
                                }
                                placeholder="Meta description for SEO"
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input
                                value={categoryForm.seo.slug}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        seo: { ...categoryForm.seo, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }
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
                        onClick={handleAddCategory}
                        disabled={!categoryForm.categoryName || !categoryForm.categoryCode || isUploading}
                    >
                        {isEditMode ? "Save Changes" : "Add Category"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}