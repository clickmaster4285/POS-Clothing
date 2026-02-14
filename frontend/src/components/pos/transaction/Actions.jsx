import { useState } from "react";
import {
    CreditCard,
    PauseCircle,
    XCircle,
    XSquare,
    UserSearch,
} from "lucide-react";

import { useTransaction } from "@/context/TransactionContext";
import { HoldDialog } from "@/components/pos/transaction/dialogs/HoldDialog";
import { RetrieveDialog } from "@/components/pos/transaction/dialogs/RetrieveDialog";
import { VoidTransactionDialog } from "@/components/pos/transaction/dialogs/VoidTransactionDialog";
import { VoidItemDialog } from "@/components/pos/transaction/dialogs/VoidItemDialog";
import { PaymentDialog } from "@/components/pos/transaction/dialogs/PaymentDialog";
import { CustomerLookupDialog } from "@/components/pos/transaction/dialogs/CustomerLookupDialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Actions() {
    const {
        cartItems,
        saveTransaction,
        setPaymentDetails,
    } = useTransaction();

    const [showHold, setShowHold] = useState(false);
    const [showRetrieve, setShowRetrieve] = useState(false);
    const [showVoidTxn, setShowVoidTxn] = useState(false);
    const [showVoidItem, setShowVoidItem] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showCustomerLookup, setShowCustomerLookup] = useState(false);

    const handlePaymentSuccess = async (paymentData) => {
     
        try {
            setPaymentDetails(paymentData);
            await saveTransaction();
            toast({ title: "Transaction Completed" });
            setShowPayment(false);
        } catch (err) {
            toast({
                title: "Failed to save transaction",
                variant: "destructive",
            });
        }
    };

    const actions = [
        {
            label: "Proceed to Payment",
            icon: CreditCard,
            color: "bg-primary text-white",
            onClick: () => {
                if (cartItems.length === 0) {
                    toast({
                        title: "Cart is empty",
                        description: "Add products before proceeding to payment",
                        variant: "destructive",
                    });
                    return;
                }
                setShowPayment(true);
            },
        },
        {
            label: "Hold Transaction",
            icon: PauseCircle,
            color: "bg-amber-500 text-white",
            onClick: () => {
                if (cartItems.length === 0) {
                    toast({ title: "Cart is empty", variant: "destructive" });
                    return;
                }
                setShowHold(true);
            },
        },
        {
            label: "Void Transaction",
            icon: XCircle,
            color: "bg-destructive text-white",
            onClick: () => {
                if (cartItems.length === 0) {
                    toast({ title: "No active transaction", variant: "destructive" });
                    return;
                }
                setShowVoidTxn(true);
            },
        },
        {
            label: "Void Item",
            icon: XSquare,
            color: "bg-orange-600 text-white",
            onClick: () => {
                if (cartItems.length === 0) {
                    toast({ title: "Cart is empty", variant: "destructive" });
                    return;
                }
                setShowVoidItem(true);
            },
        },
        {
            label: "Customer Lookup",
            icon: UserSearch,
            color: "bg-secondary text-secondary-foreground",
            onClick: () => setShowCustomerLookup(true),
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Actions</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={action.onClick}
                        className={cn(
                            "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow hover:shadow-lg transition-all hover:scale-105 w-full max-w-[200px] text-center",
                            action.color
                        )}
                    >
                        <action.icon className="w-8 h-8" />
                        <span className="text-sm font-semibold">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Dialogs */}
            <HoldDialog open={showHold} onOpenChange={setShowHold} />
            <RetrieveDialog open={showRetrieve} onOpenChange={setShowRetrieve} />
            <VoidTransactionDialog open={showVoidTxn} onOpenChange={setShowVoidTxn} />
            <VoidItemDialog open={showVoidItem} onOpenChange={setShowVoidItem} />
            <PaymentDialog
                open={showPayment}
                onOpenChange={setShowPayment}
                onSuccess={handlePaymentSuccess}
            />
            <CustomerLookupDialog
                open={showCustomerLookup}
                onOpenChange={setShowCustomerLookup}
            />
        </div>
    );
}
