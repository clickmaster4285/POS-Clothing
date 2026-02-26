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
        overallDiscountPercent,
        overallDiscountAmount,
        selectedCustomer,
    } = useTransaction();

    const safeToFixed = (value) => (Number(value) || 0).toFixed(2);
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <div>
            {/* Customer Info */}
            {selectedCustomer ? (
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center gap-2">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                            {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                        </div>
                        <CardTitle className="text-base font-medium">Customer Info</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 px-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {/* Row 1: Name + Phone */}
                            <div>
                                <span className="text-sm text-muted-foreground font-medium">Name</span>
                                <div className="font-semibold text-sm truncate">
                                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground font-medium">Phone</span>
                                <div className="font-semibold text-sm">{selectedCustomer.phonePrimary || '—'}</div>
                            </div>

                            {/* Row 2: Email + Points */}
                            <div>
                                <span className="text-sm text-muted-foreground font-medium">Email</span>
                                <div className="font-semibold text-sm truncate">{selectedCustomer.email || '—'}</div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground font-medium">Points</span>
                                <div className="font-semibold text-sm">{selectedCustomer.loyaltyPoints || 0}</div>
                            </div>

                            {/* Row 3: Program + City (if exists) */}
                            <div>
                                <span className="text-sm text-muted-foreground font-medium">Program</span>
                                <div>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                        {selectedCustomer.loyaltyProgram || 'None'}
                                    </span>
                                </div>
                            </div>
                            {selectedCustomer.city && (
                                <div>
                                    <span className="text-sm text-muted-foreground font-medium">City</span>
                                    <div className="font-semibold text-sm">{selectedCustomer.city}</div>
                                </div>
                            )}
                            {!selectedCustomer.city && <div></div>}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="py-4 px-4">
                        <div className="flex items-center justify-center text-sm text-muted-foreground font-medium">
                            Walk-in Customer
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}