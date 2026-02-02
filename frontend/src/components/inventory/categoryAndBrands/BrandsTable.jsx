"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreVertical } from "lucide-react"
const API_URL = import.meta.env.VITE_API_URL;

export function BrandsTable({
    filteredBrands,
    handleEditBrand,
    handleDeleteBrand,
    handleToggleBrandStatus
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Brand Logo</TableHead>
                    <TableHead>Brand Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredBrands.map((brand) => (
                    <TableRow key={brand._id || brand.id}>
                        <TableCell>
                            <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                                {brand.logo ? (
                                    <img
                                        
                                        src={brand.logo.startsWith("http") ? brand.logo : `${API_URL}${brand.logo}`}


                                       
                                        alt={brand.brandName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs font-bold">
                                        {brand.brandCode}
                                    </div>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="font-medium">{brand.brandName}</TableCell>
                        <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                {brand.brandCode}
                            </code>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                             
                                <Badge
                                    variant="outline"
                                    className={(
                                        brand.isActive
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-gray-50 text-gray-700 border-gray-200"
                                    )}
                                >
                                    {brand.isActive ? "Active" : "Inactive"}
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
                                    <DropdownMenuItem onClick={() => handleEditBrand(brand)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDeleteBrand(brand._id || brand.id)}
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