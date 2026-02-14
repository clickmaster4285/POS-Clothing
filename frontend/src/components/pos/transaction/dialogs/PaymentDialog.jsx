// @/components/pos/transaction/dialogs/PaymentDialog.tsx

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransaction } from "@/context/TransactionContext";
import { toast } from "@/hooks/use-toast";



export function PaymentDialog({
    open,
    onOpenChange,
    onSuccess,
}) {
    const { totals } = useTransaction();

    const [amountTendered, setAmountTendered] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const finalTotal = totals.grandTotal;

    const handlePayment = () => {
        const tendered = parseFloat(amountTendered);

        if (isNaN(tendered) || tendered <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid amount",
                variant: "destructive",
            });
            return;
        }

        if (tendered < finalTotal) {
            toast({
                title: "Insufficient payment",
                description: `Amount tendered is less than $${finalTotal.toFixed(2)}`,
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        setTimeout(() => {
            const changeDue = tendered - finalTotal;

            const paymentData = {
                amountTendered: tendered,
                changeDue,
                paymentMethod: "cash",
                amountPaid: finalTotal,
                timestamp: new Date().toISOString(),
            };

            toast({
                title: "Payment successful",
                description: `Change due: $${changeDue.toFixed(2)}`,
            });

            setIsProcessing(false);
            onOpenChange(false);
            onSuccess(paymentData); // 🔥 Important
            setAmountTendered("");
        }, 800);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Process Payment</DialogTitle>
                    <DialogDescription>          {/* ← add this */}
                        Enter the amount received from the customer. Change will be calculated automatically.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-primary">
                            ${finalTotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount Tendered</label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                            </span>

                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={amountTendered}
                                onChange={(e) => setAmountTendered(e.target.value)}
                                className="pl-7"
                                autoFocus
                            />
                        </div>
                    </div>

                    {amountTendered &&
                        !isNaN(parseFloat(amountTendered)) && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Change Due:
                                </span>
                                <span className="font-semibold">
                                    $
                                    {Math.max(
                                        0,
                                        parseFloat(amountTendered) - finalTotal
                                    ).toFixed(2)}
                                </span>
                            </div>
                        )}
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handlePayment}
                        disabled={isProcessing || !amountTendered}
                    >
                        {isProcessing ? "Processing..." : "Complete Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
