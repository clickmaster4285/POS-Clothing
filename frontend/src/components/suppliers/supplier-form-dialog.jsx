"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const emptyForm = {
    supplier_id: "",
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    tax_id: "",
    registration_number: "",
    is_active: true, // always active
    banking: {
        bank_name: "",
        account_number: "",
        account_holder_name: "",
        payment_terms: "Net 30",
        credit_limit: 0,
        currency: "USD",
    },
    performance: {
        total_orders: 0,
        completed_orders: 0,
        on_time_delivery_rate: 0,
        quality_rating: 0,
    },
};

export function SupplierFormDialog({
    open,
    onOpenChange,
    supplier,
    onSubmit,
    isSubmitting,
}) {
    const [form, setForm] = useState(emptyForm);
    const isEdit = supplier !== null;

    // Generate random supplier ID
    const generateSupplierId = () => `SUP-${Math.floor(10000 + Math.random() * 90000)}`;

    useEffect(() => {
        if (supplier) {
            setForm({
                ...supplier,
                banking: { ...supplier.banking },
                performance: { ...supplier.performance },
            });
        } else {
            setForm({ ...emptyForm, supplier_id: generateSupplierId() });
        }
    }, [supplier, open]);

    function updateField(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function updateBanking(key, value) {
        setForm((prev) => ({ ...prev, banking: { ...prev.banking, [key]: value } }));
    }

    function handleAutoGenerateId() {
        setForm((prev) => ({ ...prev, supplier_id: generateSupplierId() }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(form);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Basic Information */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="supplier_id">Supplier ID</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="supplier_id"
                                        placeholder="e.g., SUP-006"
                                        value={form.supplier_id}
                                        disabled
                                    />
                                    <Button type="button" onClick={handleAutoGenerateId}>
                                        Auto Generate
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="company_name">Company Name</Label>
                                <Input
                                    id="company_name"
                                    placeholder="Enter company name"
                                    value={form.company_name}
                                    onChange={(e) => updateField("company_name", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="contact_person">Contact Person</Label>
                                <Input
                                    id="contact_person"
                                    placeholder="Contact person name"
                                    value={form.contact_person}
                                    onChange={(e) => updateField("contact_person", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    placeholder="03-XXXXXXXXXX"
                                    value={form.phone}
                                    onChange={(e) => {
                                        // allow max 11 digits
                                        const val = e.target.value.replace(/\D/g, ""); // numbers only
                                        if (val.length <= 11) updateField("phone", val);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="supplier@example.com"
                                    value={form.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="tax_id">Tax ID</Label>
                                <Input
                                    id="tax_id"
                                    placeholder="e.g., TX-2024-006"
                                    value={form.tax_id}
                                    onChange={(e) => updateField("tax_id", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="registration_number">Registration Number</Label>
                                <Input
                                    id="registration_number"
                                    placeholder="e.g., REG-XXX-0000"
                                    value={form.registration_number}
                                    onChange={(e) => updateField("registration_number", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Full address"
                                    value={form.address}
                                    onChange={(e) => updateField("address", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* No switch: always active */}
                        <input type="hidden" value={true} />
                    </div>

                    <Separator />

                    {/* Banking Details */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-foreground">Banking Details</h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="bank_name">Bank Name</Label>
                                <Input
                                    id="bank_name"
                                    placeholder="Bank name"
                                    value={form.banking.bank_name}
                                    onChange={(e) => updateBanking("bank_name", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="account_number">Account Number</Label>
                                <Input
                                    id="account_number"
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                    value={form.banking.account_number}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        if (val.length <= 20) updateBanking("account_number", val);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="account_holder_name">Account Holder Name</Label>
                                <Input
                                    id="account_holder_name"
                                    placeholder="Account holder name"
                                    value={form.banking.account_holder_name}
                                    onChange={(e) => updateBanking("account_holder_name", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="payment_terms">Payment Terms</Label>
                                <Select
                                    value={form.banking.payment_terms}
                                    onValueChange={(val) => updateBanking("payment_terms", val)}
                                >
                                    <SelectTrigger id="payment_terms">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Net 30">Net 30</SelectItem>
                                        <SelectItem value="Net 60">Net 60</SelectItem>
                                        <SelectItem value="Immediate">Immediate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="credit_limit">Credit Limit</Label>
                                <Input
                                    id="credit_limit"
                                    type="number"
                                    placeholder="0"
                                    value={form.banking.credit_limit}
                                    onChange={(e) => updateBanking("credit_limit", Number(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    placeholder="USD"
                                    value={form.banking.currency}
                                    onChange={(e) => updateBanking("currency", e.target.value)}
                                />
                            </div>
                        </div> */}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isEdit ? "Update Supplier" : "Add Supplier"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
