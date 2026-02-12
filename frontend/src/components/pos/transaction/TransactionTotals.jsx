import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransaction } from '@/context/TransactionContext';

export function TransactionTotals() {
    const {
        totals,
        cartItems,
        setCurrentStep,
        paymentDetails,
        loyaltyDiscount,
        finalTotal,
        redeemPoints,
        selectedCustomer,
    } = useTransaction();

    // Safe number formatting – prevents NaN display
    const safeToFixed = (value) => (Number(value) || 0).toFixed(2);

    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">
                Transaction Totals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breakdown */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Items ({itemCount})
                            </span>
                            <span>${safeToFixed(totals.subtotal)}</span>
                        </div>

                        {totals.totalDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Item Discounts</span>
                                <span>- ${safeToFixed(totals.totalDiscount)}</span>
                            </div>
                        )}

                        {loyaltyDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Loyalty Discount</span>
                                <span>- ${safeToFixed(loyaltyDiscount)}</span>
                            </div>
                        )}

                        <div className="border-t pt-3 space-y-1">
                            <p className="text-sm font-medium">Tax Breakdown</p>
                            {totals.taxBreakdown.map((t) => (
                                <div key={t.rate} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Tax @ {t.rate}%
                                    </span>
                                    <span>${safeToFixed(t.amount)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Tax</span>
                            <span>${safeToFixed(totals.totalTax)}</span>
                        </div>

                        <div className="flex justify-between text-xl font-bold pt-3 border-t">
                            <span>Grand Total</span>
                            <span>${safeToFixed(totals.grandTotal)}</span>
                        </div>

                        <div className="flex justify-between text-2xl font-bold pt-2 border-t">
                            <span>Final Total</span>
                            <span className="text-primary">
                                ${safeToFixed(finalTotal)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Special Discounts & Payment Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Special Discounts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Loyalty Points</span>
                                <span>
                                    {redeemPoints && selectedCustomer && loyaltyDiscount > 0
                                        ? `- $${safeToFixed(loyaltyDiscount)}`
                                        : '—'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Coupon Code</span>
                                <span>—</span>
                            </div>
                        </CardContent>
                    </Card>

                    {paymentDetails && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Payment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount Tendered</span>
                                    <span>${safeToFixed(paymentDetails.amountTendered)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Change Due</span>
                                    <span className="font-semibold">
                                        ${safeToFixed(paymentDetails.changeDue)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Shopping Cart
                </Button>

                <Button
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => setCurrentStep(3)}
                >
                    Continue Process
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}