"use client";

import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";


export function SupplierFilters({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    paymentFilter,
    onPaymentChange,
}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search suppliers by name or ID..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>

            {/* Payment Terms Filter */}
            <Select value={paymentFilter} onValueChange={onPaymentChange}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Terms" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Terms</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="Immediate">Immediate</SelectItem>
                </SelectContent>
            </Select>

            {/* Export */}
            <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
            </Button>
        </div>
    );
}
