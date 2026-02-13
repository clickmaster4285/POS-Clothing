import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { useTransaction } from "@/context/TransactionContext";
import { toast } from "@/hooks/use-toast";
import { useHeldTransactions, useCompleteHeldTransaction } from "@/hooks/pos_hooks/useTransaction";

export function RetrieveDialog({ open, onOpenChange }) {
    const { setCartItems, setCurrentStep, cartItems, setStatus, setSelectedCustomer } = useTransaction();
    const { data, isLoading, isError } = useHeldTransactions();
    const heldTransactions = data?.heldTransactions || [];
    const { mutateAsync: completeTxn, isLoading: completing } = useCompleteHeldTransaction();

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountTendered, setAmountTendered] = useState("");

    const handleRetrieve = (txn) => {
        if (cartItems.length > 0) {
            toast({ title: "Cart not empty", description: "Complete or void current transaction", variant: "destructive" });
            return;
        }
        setCartItems(txn.cartItems);
        setCurrentStep(1);
        setStatus(txn.status || "held");
        setSelectedCustomer(txn.customer || null);
        toast({ title: "Transaction retrieved", description: `Park code: ${txn.parkCode}` });
    };

    const handleCompletePayment = async (txn) => {
        const tendered = parseFloat(amountTendered);
        if (!tendered || tendered < txn.totals.grandTotal) {
            toast({ title: "Invalid amount", description: "Amount tendered must be >= grand total", variant: "destructive" });
            return;
        }

        const payment = {
            paymentMethod,
            amountTendered: tendered,
            changeDue: tendered - txn.totals.grandTotal,
        };

        try {
            await completeTxn({ id: txn._id, payment });
            toast({ title: "Transaction completed", description: `Park code: ${txn.parkCode}` });
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            toast({ title: "Failed to complete transaction", variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Retrieve Held Transaction</DialogTitle>
                    <DialogDescription>Select a parked transaction to continue and complete payment.</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <p className="text-center py-6">Loading...</p>
                ) : isError ? (
                    <p className="text-center py-6 text-destructive">Failed to fetch held transactions</p>
                ) : heldTransactions.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">No held transactions</p>
                ) : (
                    <div className="space-y-4 max-h-80 overflow-auto">
                        {heldTransactions.map((txn) => {
                            const tendered = parseFloat(amountTendered);
                            const changeDue = !isNaN(tendered) ? tendered - txn.totals.grandTotal : 0;

                            return (
                                <div key={txn._id} className="p-3 border rounded-lg bg-card flex flex-col gap-2">
                                    <div onClick={() => handleRetrieve(txn)} className="cursor-pointer">
                                        <p className="font-mono font-semibold text-sm">{txn.parkCode}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{txn.holdReason}</p>
                                        <p className="text-xs text-muted-foreground">{txn.cartItems.length} items</p>
                                        <p className="font-semibold text-sm">${txn.totals.grandTotal.toFixed(2)}</p>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Payment Method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="card">Card</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="number"
                                            placeholder="Amount Tendered"
                                            value={amountTendered}
                                            onChange={(e) => setAmountTendered(e.target.value)}
                                        />

                                    

                                        <Button
                                            className="bg-green-500 text-white hover:bg-green-600"
                                            onClick={() => handleCompletePayment(txn)}
                                            disabled={completing}
                                        >
                                            Complete Payment
                                        </Button>
                                    </div>
                                    <div className="text-sm font-semibold pt-3">
                                        Change Due: ${changeDue > 0 ? changeDue.toFixed(2) : "0.00"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
