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
        redeemPoints,
        selectedCustomer,
    } = useTransaction();

    // Safe number formatting – prevents NaN display
    const safeToFixed = (value) => (Number(value) || 0).toFixed(2);

    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Transaction Totals</h2>

            <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Breakdown */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Items ({itemCount})</span>
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

                        {/* FINAL TOTAL - with loyalty discount applied */}
                        <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-primary/20">
                            <span>Final Total</span>
                            <span className="text-primary">${safeToFixed(totals.grandTotal)}</span>
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
                                <span
                                    className={redeemPoints && loyaltyDiscount > 0 ? 'text-green-600 font-semibold' : ''}
                                >
                                    {redeemPoints && selectedCustomer && loyaltyDiscount > 0
                                        ? `- $${safeToFixed(loyaltyDiscount)}`
                                        : '—'}
                                </span>
                            </div>

                            {/* <div className="flex justify-between">
                                <span className="text-muted-foreground">Coupon Code</span>
                                <span>—</span>
                            </div> */}
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
                                    <span className="font-semibold">${safeToFixed(paymentDetails.changeDue)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-medium">Amount to Pay</span>
                                    <span className="font-bold text-primary">
                                        ${safeToFixed(totals.grandTotal)}
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
