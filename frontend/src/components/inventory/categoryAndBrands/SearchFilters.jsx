"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"

export function SearchFilters({
    searchTerm,
    setSearchTerm,
    activeTab,
    resetCategoryForm,
    resetBrandForm,
    setIsCategoryDialogOpen,
    setIsBrandDialogOpen
}) {
    return (
        <Card className="border-border/50">
            <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex-1 min-w-[200px] max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            if (activeTab === "categories") {
                                resetCategoryForm()
                                setIsCategoryDialogOpen(true)
                            } else {
                                resetBrandForm()
                                setIsBrandDialogOpen(true)
                            }
                        }}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add {activeTab === "categories" ? "Category" : "Brand"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}