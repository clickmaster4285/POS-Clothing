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
import { useSettings } from "@/hooks/useSettings";
import { Button } from '@/components/ui/button';

export function QuickActions() {
    const { cartItems, totals } = useTransaction();
    const [showHold, setShowHold] = useState(false);
    const [showRetrieve, setShowRetrieve] = useState(false);
    const [showVoidTxn, setShowVoidTxn] = useState(false);
    const [showVoidItem, setShowVoidItem] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showCustomerLookup, setShowCustomerLookup] = useState(false);

    const { data: settings } = useSettings();

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
          

            {/* Action Grid - Responsive Layout */}
            <div className="space-y-3 sm:space-y-4">
                {/* Section title for actions - visible on larger screens */}
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 hidden sm:block">
                    Available Actions
                </h3>

                {/* Responsive grid - adjusts columns based on screen size */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-3 sm:gap-2">
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            onClick={action.onClick}
                          
                        >
                        
                            {/* Label - responsive text size */}
                            <span>
                                {action.label}
                            </span>

                            {/* Optional: Touch target hint for mobile */}
                            <span className="text-[10px] opacity-80 sm:hidden">
                                Tap to continue
                            </span>
                        </Button>
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

