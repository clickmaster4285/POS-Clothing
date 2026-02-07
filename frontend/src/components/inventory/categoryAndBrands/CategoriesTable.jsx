"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreVertical, FolderTree } from "lucide-react"
const API_URL = import.meta.env.VITE_API_URL;

export function CategoriesTable({
    filteredCategories,
    categories,
    handleEditCategory,
    handleDeleteCategory,
    handleToggleCategoryStatus,
    getParentCategoryName
}) {
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Code</TableHead>
                   
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredCategories.map((category) => (
                    <TableRow key={category._id || category.id}>
                        <TableCell>
                            <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                                {category.image ? (
                                    <img
                                        src={category.image.startsWith("http") ? category.image : `${API_URL}${category.image}`}
                                        alt={category.categoryName}
                                        className="h-full w-full object-cover"
                                    />


                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <FolderTree className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {/* {category.parentCategory && (
                                    <span className="text-muted-foreground">└</span>
                                )} */}
                                <span className="font-medium px-2 ">{category.categoryName}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                {category.categoryCode}
                            </code>
                        </TableCell>
                       
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {/* <Switch
                                    checked={category.isActive}
                                    onCheckedChange={() => handleToggleCategoryStatus(category._id || category.id)}
                                /> */}
                                <Badge
                                    variant="outline"
                                    className={(
                                        category.isActive
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-gray-50 text-gray-700 border-gray-200"
                                    )}
                                >
                                    {category.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleToggleCategoryStatus(category._id || category.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}