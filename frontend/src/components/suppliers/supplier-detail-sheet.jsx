"use client";

import React from "react"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
    Building2,
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    CreditCard,
    Star,
    TrendingUp,
    Clock,
} from "lucide-react";

function InfoRow({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm text-foreground">{value || "N/A"}</p>
            </div>
        </div>
    );
}

export function SupplierDetailSheet({
    supplier,
    open,
    onOpenChange,
}) {
    if (!supplier) return null;

    const deliveryRate = supplier.performance.on_time_delivery_rate;
    const completionRate =
        supplier.performance.total_orders > 0
            ? (
                (supplier.performance.completed_orders /
                    supplier.performance.total_orders) *
                100
            ).toFixed(1)
            : "0";

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <SheetTitle className="text-lg">
                                {supplier.company_name}
                            </SheetTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">
                                    {supplier.supplier_id}
                                </span>
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
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex flex-col gap-6">
                    {/* Contact Information */}
                    <section>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Contact Information
                        </h3>
                        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
                            <InfoRow
                                icon={User}
                                label="Contact Person"
                                value={supplier.contact_person}
                            />
                            <InfoRow icon={Phone} label="Phone" value={supplier.phone} />
                            <InfoRow icon={Mail} label="Email" value={supplier.email} />
                            <InfoRow
                                icon={MapPin}
                                label="Address"
                                value={supplier.address}
                            />
                            <InfoRow icon={FileText} label="Tax ID" value={supplier.tax_id} />
                            <InfoRow
                                icon={FileText}
                                label="Registration No."
                                value={supplier.registration_number}
                            />
                        </div>
                    </section>

                    <Separator />

                    {/* Banking Details */}
                    <section>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Banking Details
                        </h3>
                        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
                            <InfoRow
                                icon={CreditCard}
                                label="Bank Name"
                                value={supplier.banking.bank_name}
                            />
                            <InfoRow
                                icon={CreditCard}
                                label="Account Number"
                                value={supplier.banking.account_number}
                            />
                            <InfoRow
                                icon={User}
                                label="Account Holder"
                                value={supplier.banking.account_holder_name}
                            />
                            <InfoRow
                                icon={Clock}
                                label="Payment Terms"
                                value={supplier.banking.payment_terms}
                            />
                            <div className="flex items-start gap-3">
                                <CreditCard className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Credit Limit</p>
                                    <p className="text-sm text-foreground">
                                        {supplier.banking.currency}{" "}
                                        {supplier.banking.credit_limit.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Performance Metrics */}
                    <section>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Performance Metrics
                        </h3>
                        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
                            {/* Orders Summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-secondary p-3 text-center">
                                    <p className="text-2xl font-bold text-foreground">
                                        {supplier.performance.total_orders}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Total Orders</p>
                                </div>
                                <div className="rounded-lg bg-secondary p-3 text-center">
                                    <p className="text-2xl font-bold text-foreground">
                                        {supplier.performance.completed_orders}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Completed Orders
                                    </p>
                                </div>
                            </div>

                            {/* On-Time Delivery */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            On-Time Delivery Rate
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">
                                        {deliveryRate}%
                                    </span>
                                </div>
                                <Progress value={deliveryRate} className="h-2" />
                            </div>

                            {/* Completion Rate */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            Completion Rate
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">
                                        {completionRate}%
                                    </span>
                                </div>
                                <Progress value={Number(completionRate)} className="h-2" />
                            </div>

                            {/* Quality Rating */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        Quality Rating
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={`detail-star-${i}`}
                                            className={`h-4 w-4 ${i < Math.round(supplier.performance.quality_rating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-muted-foreground/30"
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-1 text-sm font-semibold text-foreground">
                                        {supplier.performance.quality_rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Timestamps */}
                    <div className="flex justify-between text-xs text-muted-foreground pb-4">
                        <span>
                            Created: {new Date(supplier.created_at).toLocaleDateString()}
                        </span>
                        <span>
                            Updated: {new Date(supplier.updated_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
