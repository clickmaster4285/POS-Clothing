import { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-react';
import { useTransaction } from '@/context/TransactionContext';


const voidReasons = [
    'Customer Changed Mind',
    'Item Damaged',
    'Incorrect Item Scanned',
    'Price Error',
    'Duplicate Item',
    'Other', // Keep this so the user can enter a custom reason
];





export function VoidItemDialog({ open, onOpenChange }) {
    const { cartItems, removeCartItem } = useTransaction();
    const [selectedItemId, setSelectedItemId] = useState('');
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [voidedItemName, setVoidedItemName] = useState('');

    const handleVoid = () => {
        const finalReason = reason === 'Other' ? customReason : reason;
        if (!selectedItemId || !finalReason) return;
        const item = cartItems.find((i) => i.id === selectedItemId);
        if (item) {
            setVoidedItemName(`${item.name} (${item.size}, ${item.color.name})`);
            removeCartItem(selectedItemId);
            setConfirmed(true);
        }
    };

    const handleClose = () => {
        setSelectedItemId('');
        setReason('');
        setCustomReason('');
        setConfirmed(false);
        setVoidedItemName('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                {!confirmed ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Void Item</DialogTitle>
                            <DialogDescription>Select an item to remove from the cart.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium block mb-2">Select Item</label>
                                <div className="space-y-1 max-h-40 overflow-auto">
                                    {cartItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedItemId(item.id)}
                                            className={(
                                                'w-full text-left p-2 rounded text-sm border transition-colors',
                                                selectedItemId === item.id ? 'border-primary bg-primary/10' : 'hover:bg-muted'
                                            )}
                                        >
                                            {item.name} · {item.size} · {item.color.name} · x{item.quantity} · ${(item.unitPrice * item.quantity).toFixed(2)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-2">Reason *</label>
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
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button variant="destructive" onClick={handleVoid} disabled={!selectedItemId || !reason || (reason === 'Other' && !customReason)}>
                                Void Item
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-pos-success">
                                <CheckCircle2 className="w-5 h-5" /> Item Voided
                            </DialogTitle>
                            <DialogDescription>{voidedItemName} has been removed.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleClose}>Done</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
