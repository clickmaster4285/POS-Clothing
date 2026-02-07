"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Pencil, Trash2, Star } from "lucide-react";


function RatingStars({ rating }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={`star-${i}`}
                    className={`h-3.5 w-3.5 ${i < Math.round(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
        </div>
    );
}

export function SupplierTable({
    suppliers,
    onView,
    onEdit,
    onDelete,
}) {
    if (suppliers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium text-foreground">No suppliers found</p>
                <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Supplier ID</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Payment Terms</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {suppliers.map((supplier) => (
                        <TableRow key={supplier._id} className="cursor-pointer hover:bg-secondary/50" onClick={() => onView(supplier)}>
                            <TableCell className="font-medium text-foreground">
                                {supplier.supplier_id}
                            </TableCell>
                            <TableCell className="text-foreground">{supplier.company_name}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {supplier.contact_person}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{supplier.phone}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {supplier.banking.payment_terms}
                            </TableCell>
                            <TableCell>
                                <RatingStars rating={supplier.performance.quality_rating} />
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        supplier.is_active
                                            ? "border-green-200 bg-green-50 text-green-700"
                                            : "border-red-200 bg-red-50 text-red-700"
                                    }
                                >
                                    {supplier.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More actions">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(supplier); }}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(supplier); }}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={(e) => { e.stopPropagation(); onDelete(supplier); }}
                                            className="text-red-600 focus:text-red-600"
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
        </div>
    );
}
