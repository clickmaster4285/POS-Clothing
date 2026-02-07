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

    const generateCategoryCode = () => {
        if (!categoryForm.categoryName) return

        const words = categoryForm.categoryName
            .replace(/[^a-zA-Z ]/g, "")
            .trim()
            .split(" ")
            .filter(Boolean)

        let code = ""

        if (words.length === 1) {
            code = words[0].substring(0, 5)
        } else {
            code = words.map(w => w[0]).join("")
        }

        setCategoryForm({
            ...categoryForm,
            categoryCode: code.toUpperCase().slice(0, 5),
        })
    }


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

                            <div className="flex gap-2">
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

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={generateCategoryCode}
                                    disabled={!categoryForm.categoryName}
                                >
                                    Auto
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Auto-generated from category name (max 5 characters)
                            </p>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
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