import { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2 } from 'lucide-react';
import { useTransaction } from '@/context/TransactionContext';
import { toast } from '@/hooks/use-toast';

// ===== In-page held transactions store =====
const heldTransactions = [];

// Function to generate park code
function generateParkCode() {
    return `PARK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

// Function to hold/park a transaction
function holdTransaction(transaction) {
    heldTransactions.push(transaction);
}

// ===== HoldDialog Component =====
const holdReasons = [
    'Customer stepping out',
    'Waiting for approval',
    'Price verification needed',
    'Customer browsing more',
    'Other',
];

export function HoldDialog({ open, onOpenChange }) {
    const { cartItems, totals, clearCart, setCurrentStep } = useTransaction();
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [parkCode, setParkCode] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    const handleHold = () => {
        const finalReason = reason === 'Other' ? customReason : reason;
        if (!finalReason) {
            toast({ title: 'Please select a reason', variant: 'destructive' });
            return;
        }

        const code = generateParkCode();
        holdTransaction({
            id: `hold-${Date.now()}`,
            parkCode: code,
            reason: finalReason,
            items: [...cartItems],
            subtotal: totals.grandTotal,
            timestamp: new Date(),
        });

        setParkCode(code);
        setConfirmed(true);
    };

    const handleClose = () => {
        if (confirmed) {
            clearCart();
            setCurrentStep(0);
        }
        setReason('');
        setCustomReason('');
        setParkCode('');
        setConfirmed(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                {!confirmed ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Hold/Park Transaction</DialogTitle>
                            <DialogDescription>
                                This will save the current transaction so you can retrieve it later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium block mb-2">Reason</label>
                                <Select value={reason} onValueChange={setReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a reason..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {holdReasons.map((r) => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {reason === 'Other' && (
                                <Input
                                    placeholder="Enter reason..."
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                />
                            )}
                            <div className="text-sm text-muted-foreground">
                                Items: {cartItems.length} · Total: ${totals.grandTotal.toFixed(2)}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleHold}>Hold Transaction</Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-pos-success">
                                <CheckCircle2 className="w-5 h-5" /> Transaction Held
                            </DialogTitle>
                            <DialogDescription>Your transaction has been parked successfully.</DialogDescription>
                        </DialogHeader>
                        <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground mb-2">Park Code</p>
                            <p className="text-3xl font-mono font-bold text-primary">{parkCode}</p>
                            <p className="text-xs text-muted-foreground mt-2">Use this code to retrieve the transaction</p>
                        </div>
                        <DialogFooter>
                            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleClose}>Done</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
