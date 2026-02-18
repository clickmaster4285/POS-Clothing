import { useState } from 'react';
import {
    CreditCard, PauseCircle, PlayCircle, XCircle, XSquare,
    UserSearch, DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTransaction } from '@/context/TransactionContext';
import { HoldDialog } from '@/components/pos/transaction/dialogs/HoldDialog';
import { RetrieveDialog } from '@/components/pos/transaction/dialogs/RetrieveDialog';
import { VoidTransactionDialog } from '@/components/pos/transaction/dialogs/VoidTransactionDialog';
import { VoidItemDialog } from '@/components/pos/transaction/dialogs/VoidItemDialog';
import { PaymentDialog } from '@/components/pos/transaction/dialogs/PaymentDialog';
import { CustomerLookupDialog } from '@/components/pos/transaction/dialogs/CustomerLookupDialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function QuickActions() {
    const { cartItems, totals } = useTransaction();
    const [showHold, setShowHold] = useState(false);
    const [showRetrieve, setShowRetrieve] = useState(false);
    const [showVoidTxn, setShowVoidTxn] = useState(false);
    const [showVoidItem, setShowVoidItem] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showCustomerLookup, setShowCustomerLookup] = useState(false);

    const actions = [
        // {
        //     label: 'Proceed to Payment',
        //     icon: CreditCard,
        //     color: 'bg-primary text-white',
        //     onClick: () => {
        //         if (cartItems.length === 0) {
        //             toast({
        //                 title: 'Cart is empty',
        //                 description: 'Add products before proceeding to payment',
        //                 variant: 'destructive',
        //             });
        //             return;
        //         }
        //         setShowPayment(true);
        //     },
        // },
        // {
        //     label: 'Hold Transaction',
        //     icon: PauseCircle,
        //     color: 'bg-amber-500 text-white',
        //     onClick: () => {
        //         if (cartItems.length === 0) {
        //             toast({ title: 'Cart is empty', variant: 'destructive' });
        //             return;
        //         }
        //         setShowHold(true);
        //     },
        // },
        {
            label: 'Retrieve Held',
            icon: PlayCircle,
            color: 'bg-blue-500 text-white',
            onClick: () => setShowRetrieve(true),
        },
        {
            label: 'Void Transaction',
            icon: XCircle,
            color: 'bg-destructive text-white',
            onClick: () => {
                if (cartItems.length === 0) {
                    toast({ title: 'No active transaction', variant: 'destructive' });
                    return;
                }
                setShowVoidTxn(true);
            },
        },
        {
            label: 'Void Item',
            icon: XSquare,
            color: 'bg-orange-600 text-white',
            onClick: () => {
                if (cartItems.length === 0) {
                    toast({ title: 'Cart is empty', variant: 'destructive' });
                    return;
                }
                setShowVoidItem(true);
            },
        },
        // {
        //     label: 'Customer Lookup',
        //     icon: UserSearch,
        //     color: 'bg-secondary text-secondary-foreground',
        //     onClick: () => setShowCustomerLookup(true),
        // },
        // {
        //     label: 'Price Check',
        //     icon: DollarSign,
        //     color: 'bg-secondary text-secondary-foreground',
        //     onClick: () => toast({ title: 'Price Check', description: 'Feature coming soon' }),
        // },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - Responsive */}
            <h2 className="text-lg sm:text-xl font-bold text-foreground px-1">
                Quick Actions
            </h2>

            {/* Summary Card - Mobile Optimized */}
            <Card className="overflow-hidden">
                <CardContent className="p-4 sm:p-4">
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">
                        {/* Items count - Left side */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                Items in cart:
                            </span>
                            <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 text-xs sm:text-sm font-semibold bg-primary/10 text-primary rounded-full">
                                {cartItems.length}
                            </span>
                        </div>

                        {/* Total amount - Right side */}
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                                Total:
                            </span>
                            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                                ${(totals?.grandTotal || 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Detailed Transaction Breakdown */}
                    {cartItems.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-dashed space-y-1 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${(totals?.subtotal || 0).toFixed(2)}</span>
                            </div>

                            {totals?.totalDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Item Discounts:</span>
                                    <span>- ${(totals?.totalDiscount || 0).toFixed(2)}</span>
                                </div>
                            )}

                            {totals?.loyaltyDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Loyalty Discount:</span>
                                    <span>- ${(totals?.loyaltyDiscount || 0).toFixed(2)}</span>
                                </div>
                            )}

                            {/* Final Total */}
                            <div className="flex justify-between pt-2 border-t border-dashed font-semibold text-primary">
                                <span>Grand Total:</span>
                                <span>${(totals?.grandTotal || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


            {/* Action Grid - Responsive Layout */}
            <div className="space-y-3 sm:space-y-4">
                {/* Section title for actions - visible on larger screens */}
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 hidden sm:block">
                    Available Actions
                </h3>

                {/* Responsive grid - adjusts columns based on screen size */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-2">
                    {actions.map((action) => (
                        <button
                            key={action.label}
                            onClick={action.onClick}
                            className={cn(
                                'flex flex-col items-center justify-center gap-2 sm:gap-3',
                                'p-4 sm:p-5 md:p-6',
                                'rounded-xl sm:rounded-2xl',
                                'shadow hover:shadow-lg',
                                'transition-all duration-200',
                                'hover:scale-[1.02] sm:hover:scale-105',
                                'active:scale-[0.98] sm:active:scale-[0.98]',
                                'w-full',
                                'text-center',
                                action.color
                            )}
                        >
                            {/* Icon - responsive sizing */}
                            <action.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />

                            {/* Label - responsive text size */}
                            <span className="text-xs sm:text-sm md:text-base font-semibold leading-tight">
                                {action.label}
                            </span>

                            {/* Optional: Touch target hint for mobile */}
                            <span className="text-[10px] opacity-80 sm:hidden">
                                Tap to continue
                            </span>
                        </button>
                    ))}
                </div>

                {/* Empty state message - when no actions are available */}
                {actions.length === 0 && (
                    <div className="text-center py-8 sm:py-12 px-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted mb-4">
                            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm sm:text-base font-medium text-foreground mb-1">
                            No Quick Actions
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-[250px] mx-auto">
                            Quick actions will appear here when available
                        </p>
                    </div>
                )}
            </div>

            {/* Dialogs - Responsive handling is inside each dialog component */}
            <HoldDialog open={showHold} onOpenChange={setShowHold} />
            <RetrieveDialog open={showRetrieve} onOpenChange={setShowRetrieve} />
            <VoidTransactionDialog open={showVoidTxn} onOpenChange={setShowVoidTxn} />
            <VoidItemDialog open={showVoidItem} onOpenChange={setShowVoidItem} />
            <PaymentDialog open={showPayment} onOpenChange={setShowPayment} />
            <CustomerLookupDialog open={showCustomerLookup} onOpenChange={setShowCustomerLookup} />
        </div>
    );
}

