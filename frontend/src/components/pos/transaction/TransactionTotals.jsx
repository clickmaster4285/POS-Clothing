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
        overallDiscountPercent,      // <-- add this
        overallDiscountAmount, 
        selectedCustomer,
    } = useTransaction();

    const safeToFixed = (value) => (Number(value) || 0).toFixed(2);
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Transaction Totals</h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Customer Info on Left */}
                {selectedCustomer ? (
                    <Card className="xl:col-span-1 border border-gray-200 shadow-sm">
                        <CardHeader className="pb-3 flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                                {selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}
                            </div>
                            <CardTitle className="text-base">Customer Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {/* Name */}
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Name</span>
                                <span className="font-semibold">{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                            </div>

                            {/* Email */}
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Email</span>
                                <span className="font-semibold">{selectedCustomer.email || '—'}</span>
                            </div>

                            {/* Phone */}
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Phone</span>
                                <span className="font-semibold">{selectedCustomer.phonePrimary || '—'}</span>
                            </div>

                            {/* City & Street */}
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">City</span>
                                <span className="font-semibold">{selectedCustomer.city || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Street</span>
                                <span className="font-semibold">{selectedCustomer.streetAddress || '—'}</span>
                            </div>

                            {/* Loyalty */}
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Loyalty Points</span>
                                <span className="font-semibold">{selectedCustomer.loyaltyPoints || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium">Loyalty Program</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold 
                    bg-green-100 text-green-800">
                                    {selectedCustomer.loyaltyProgram || 'None'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ):(<Card className="flex text-muted-foreground font-bold p-3 justify-center items-center">Walk in customer</Card>)}


                {/* Breakdown + Discounts on Right */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Breakdown */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Items subtotal */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items ({itemCount})</span>
                                <span>${safeToFixed(totals.subtotal)}</span>
                            </div>

                            {/* Item-level discounts */}
                            {totals.totalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Item Discounts</span>
                                    <span>- ${safeToFixed(totals.totalDiscount)}</span>
                                </div>
                            )}

                            {/* Overall discount (optional) */}
                            {overallDiscountAmount > 0 && (
                                <div className="flex justify-between text-sm text-blue-600">
                                    <span>Overall Discount ({overallDiscountPercent}%)</span>
                                    <span>- ${safeToFixed(overallDiscountAmount)}</span>
                                </div>
                            )}

                            {/* Loyalty discount */}
                            {loyaltyDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Loyalty Discount</span>
                                    <span>- ${safeToFixed(loyaltyDiscount)}</span>
                                </div>
                            )}

                            {/* Final total */}
                            <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-primary/20">
                                <span>Final Total</span>
                                <span className="text-primary">${safeToFixed(totals.grandTotal)}</span>
                            </div>
                        </CardContent>
                    </Card>


                

                    {/* Payment Summary */}
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
                                    <span className="font-bold text-primary">${safeToFixed(totals.grandTotal)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Shopping Cart
                </Button>

                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setCurrentStep(3)}>
                    Continue Process
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
