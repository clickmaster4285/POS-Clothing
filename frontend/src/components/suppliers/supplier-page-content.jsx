"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SupplierStats } from "./supplier-stats";
import { SupplierFilters } from "./supplier-filters";
import { SupplierTable } from "./supplier-table";
import { SupplierFormDialog } from "./supplier-form-dialog";
import { DeleteSupplierDialog } from "./delete-supplier-dialog";
import { SupplierDetailSheet } from "./supplier-detail-sheet";

import {
    useSuppliers,
    useCreateSupplier,
    useUpdateSupplier,
    useDeleteSupplier,
} from "@/hooks/useSupplier";

export default function SupplierPageContent() {
    // React Query hooks
    const { data: suppliers = [], isLoading, refetch } = useSuppliers();
    const createSupplierMutation = useCreateSupplier();
    const updateSupplierMutation = useUpdateSupplier();
    const deleteSupplierMutation = useDeleteSupplier();

    // Search and filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");

    // Dialog states
    const [formOpen, setFormOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingSupplier, setDeletingSupplier] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [detailOpen, setDetailOpen] = useState(false);
    const [viewingSupplier, setViewingSupplier] = useState(null);

    // Filtered suppliers
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((s) => {
            const matchesSearch =
                s.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.supplier_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.contact_person.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && s.is_active) ||
                (statusFilter === "inactive" && !s.is_active);

            const matchesPayment =
                paymentFilter === "all" || s.banking.payment_terms === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [suppliers, searchQuery, statusFilter, paymentFilter]);

    // Handlers
    function handleAdd() {
        setEditingSupplier(null);
        setFormOpen(true);
    }

    function handleEdit(supplier) {
        setEditingSupplier(supplier);
        setFormOpen(true);
    }

    function handleView(supplier) {
        setViewingSupplier(supplier);
        setDetailOpen(true);
    }

    function handleDeleteClick(supplier) {
        setDeletingSupplier(supplier);
        setDeleteOpen(true);
    }

    async function handleFormSubmit(data) {
        setIsSubmitting(true);
        try {
            if (editingSupplier) {
                await updateSupplierMutation.mutateAsync({
                    id: editingSupplier._id,
                    data,
                });
            } else {
                await createSupplierMutation.mutateAsync(data);
            }
            await refetch(); // refresh suppliers list
            setFormOpen(false);
        } catch (err) {
            console.error("Failed to save supplier", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteConfirm() {
        if (!deletingSupplier) return;
        setIsDeleting(true);
        try {
            await deleteSupplierMutation.mutateAsync(deletingSupplier._id);
            await refetch();
            setDeleteOpen(false);
            setDeletingSupplier(null);
        } catch (err) {
            console.error("Failed to delete supplier", err);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your supplier directory and banking details
                    </p>
                </div>
                <Button onClick={handleAdd} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Supplier
                </Button>
            </div>

            {/* Stats */}
            <SupplierStats suppliers={suppliers} />

            {/* Filters & Table */}
            <Card className="flex flex-col gap-4 p-5">
                <SupplierFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    paymentFilter={paymentFilter}
                    onPaymentChange={setPaymentFilter}
                />

                
            </Card>

            <Card className="p-2"><div>


                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <SupplierTable
                        suppliers={filteredSuppliers}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                )}
            </div></Card>

            {/* Dialogs */}
            <SupplierFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                supplier={editingSupplier}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
            />

            <DeleteSupplierDialog
                supplier={deletingSupplier}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />

            <SupplierDetailSheet
                supplier={viewingSupplier}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
        </div>
    );
}
