import { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTransaction } from '@/context/TransactionContext';


const voidReasons = [
    'Customer Changed Mind',
    'Item Damaged',
    'Incorrect Item Scanned',
    'Price Error',
    'Duplicate Item',
    'Other', // Keep this so the user can enter a custom reason
];


export function VoidTransactionDialog({ open, onOpenChange }) {
    const { transactionNumber, totals, cartItems, clearCart, setStatus, setCurrentStep } = useTransaction();
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    const handleVoid = () => {
        const finalReason = reason === 'Other' ? customReason : reason;
        if (!finalReason) return;
        setStatus('voided');
        setConfirmed(true);
    };

    const handleClose = () => {
        if (confirmed) {
            clearCart();
            setCurrentStep(0);
        }
        setReason('');
        setCustomReason('');
        setConfirmed(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                {!confirmed ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="w-5 h-5" /> Void Transaction
                            </DialogTitle>
                            <DialogDescription>This action cannot be undone. The entire transaction will be voided.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="text-sm space-y-1 p-3 bg-destructive/10 rounded-lg">
                                <div className="flex justify-between"><span>Transaction #</span><span className="font-mono">{transactionNumber}</span></div>
                                <div className="flex justify-between"><span>Items</span><span>{cartItems.length}</span></div>
                                <div className="flex justify-between font-semibold"><span>Amount</span><span>${totals.grandTotal.toFixed(2)}</span></div>
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-2">Void Reason *</label>
                                <Select value={reason} onValueChange={setReason}>
                                    <SelectTrigger><SelectValue placeholder="Select reason..." /></SelectTrigger>
                                    <SelectContent>
                                        {voidReasons.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            {reason === 'Other' && (
                                <Input placeholder="Enter reason..." value={customReason} onChange={(e) => setCustomReason(e.target.value)} />
                            )}
                            <p className="text-xs text-muted-foreground">* Manager approval may be required</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button variant="destructive" onClick={handleVoid} disabled={!reason || (reason === 'Other' && !customReason)}>
                                Void Transaction
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-pos-success">
                                <CheckCircle2 className="w-5 h-5" /> Transaction Voided
                            </DialogTitle>
                            <DialogDescription>The transaction has been voided successfully.</DialogDescription>
                        </DialogHeader>
                        <div className="text-sm space-y-1 p-3 bg-muted rounded-lg">
                            <div className="flex justify-between"><span>Transaction #</span><span className="font-mono">{transactionNumber}</span></div>
                            <div className="flex justify-between"><span>Status</span><span className="text-destructive font-medium">VOIDED</span></div>
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
