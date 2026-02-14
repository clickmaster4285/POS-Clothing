import React from "react";
import { X, Tag, Calendar, Hash, Award, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";

const ViewPromotionSheet = ({ promotion, open, onClose }) => {
    if (!promotion) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTypeColor = (type) => {
        const colors = {
            "BOGO": "bg-green-100 text-green-800 border-green-200",
            "Discount": "bg-blue-100 text-blue-800 border-blue-200",
            "Mix & Match": "bg-amber-100 text-amber-800 border-amber-200",
        };
        return colors[type] || "bg-purple-100 text-purple-800 border-purple-200";
    };

    const getPriorityColor = (priority) => {
        const colors = {
            "High": "bg-red-100 text-red-800 border-red-200",
            "Medium": "bg-amber-100 text-amber-800 border-amber-200",
            "Low": "bg-blue-100 text-blue-800 border-blue-200",
        };
        return colors[priority] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <Tag className="h-5 w-5 text-primary" />
                        Promotion Details
                    </SheetTitle>
                    {/* <SheetClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4 h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </SheetClose> */}
                </SheetHeader>

                <div className="space-y-6">
                    {/* Header Section with Name and Type */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground">{promotion.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="outline" className={("px-3 py-1", getTypeColor(promotion.type))}>
                                    {promotion.type}
                                </Badge>
                                <Badge variant="outline" className={("px-3 py-1", getPriorityColor(promotion.priority))}>
                                    {promotion.priority} Priority
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={(
                                        "px-3 py-1",
                                        promotion.status === "active"
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-gray-100 text-gray-800 border-gray-200"
                                    )}
                                >
                                    {promotion.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Discount Info */}
                    <div className="bg-muted/50 p-5 rounded-lg border">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                            Discount
                        </h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-primary">
                                {promotion.amountValue}
                                {promotion.amountType === "Percentage" ? "%" : "$"}
                            </span>
                            {promotion.discountDescription && (
                                <span className="text-sm text-muted-foreground">
                                    ({promotion.discountDescription})
                                </span>
                            )}
                        </div>
                        {promotion.quantityRules && (
                            <p className="text-sm text-muted-foreground mt-2">
                                <span className="font-medium">Rule:</span> {promotion.quantityRules}
                            </p>
                        )}
                    </div>

                    {/* Coupon Code */}
                    {promotion.couponCode && (
                        <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                Coupon Code
                            </h4>
                            <div className="font-mono text-lg font-bold text-primary bg-primary/10 px-4 py-2.5 rounded-md inline-block border border-primary/30">
                                {promotion.couponCode}
                            </div>
                        </div>
                    )}

                    {/* Qualifying Items */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Hash className="h-3.5 w-3.5" />
                            Qualifying Items
                        </h4>

                        {promotion.qualifyingCategories?.length > 0 && (
                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <p className="text-sm font-medium mb-2 text-foreground/80">Categories:</p>
                                <div className="flex flex-wrap gap-2">
                                    {promotion.qualifyingCategories.map((cat, idx) => (
                                        <Badge key={idx} variant="secondary" className="px-3 py-1">
                                            {typeof cat === 'object' ? cat.name || cat.categoryName : cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {promotion.qualifyingProducts?.length > 0 && (
                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <p className="text-sm font-medium mb-2 text-foreground/80">Specific Products:</p>
                                <div className="flex flex-wrap gap-2">
                                    {promotion.qualifyingProducts.map((prod, idx) => (
                                        <Badge key={idx} variant="secondary" className="px-3 py-1">
                                            {typeof prod === 'object' ? prod.name || prod.productName : prod}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(!promotion.qualifyingCategories?.length && !promotion.qualifyingProducts?.length) && (
                            <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg border">
                                Applies to all items
                            </p>
                        )}
                    </div>

                    {/* Validity Period */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Validity Period
                        </h4>
                        <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                                <p className="font-medium">{formatDate(promotion.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">End Date</p>
                                <p className="font-medium">{formatDate(promotion.endDate)}</p>
                            </div>
                        </div>

                        {promotion.hasExpiration && promotion.expirationDate && (
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                                    <span className="text-amber-600">⚠</span>
                                    Expires on {formatDate(promotion.expirationDate)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Award className="h-3.5 w-3.5" />
                            Settings
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <p className="text-xs text-muted-foreground mb-2">Auto Apply</p>
                                <div className="flex items-center gap-2">
                                    {promotion.autoApply ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="font-medium text-green-700">Enabled</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                            <span className="font-medium text-gray-500">Disabled</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <p className="text-xs text-muted-foreground mb-2">Allow Stacking</p>
                                <div className="flex items-center gap-2">
                                    {promotion.allowFurtherDiscounts ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="font-medium text-green-700">Yes</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                            <span className="font-medium text-gray-500">No</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-end gap-3">
                    <SheetClose asChild>
                        <Button variant="outline" className="px-6">
                            Close
                        </Button>
                    </SheetClose>
                    {/* <Button className="px-6">
                        Edit Promotion
                    </Button> */}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ViewPromotionSheet;