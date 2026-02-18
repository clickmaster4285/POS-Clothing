import { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-react';
import { useTransaction } from '@/context/TransactionContext';
import { toast } from '@/hooks/use-toast';

const voidReasons = [
    'Customer Changed Mind',
    'Item Damaged',
    'Incorrect Item Scanned',
    'Price Error',
    'Duplicate Item',
    'Other',
];

export function VoidItemDialog({ open, onOpenChange }) {
    const { cartItems, updateCartItem, removeCartItem } = useTransaction();

    const [selectedItems, setSelectedItems] = useState({});
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [voidedItemsSummary, setVoidedItemsSummary] = useState([]);

    const handleToggleItem = (itemId) => {
        setSelectedItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] ? prev[itemId] : 1, // default quantity 1
        }));
    };

    const handleQuantityChange = (itemId, qty, max) => {
        setSelectedItems((prev) => ({
            ...prev,
            [itemId]: Math.min(Math.max(1, qty), max),
        }));
    };

    const handleVoid = () => {
        const finalReason = reason === 'Other' ? customReason : reason;

        if (!finalReason || Object.keys(selectedItems).length === 0) {
            toast({ title: 'Select items and reason', variant: 'destructive' });
            return;
        }

        // 🚨 New Check: If only 1 item exists in cart
        if (cartItems.length === 1) {
            const onlyItem = cartItems[0];
            const selectedQty = selectedItems[onlyItem.id];

            // If user is trying to remove the entire last item
            if (selectedQty && selectedQty >= onlyItem.quantity) {
                toast({
                    title: "Cannot void last item",
                    description: "Only one item left. Please void the entire transaction.",
                    variant: "destructive"
                });
                return;
            }
        }

        const summary = [];

        Object.entries(selectedItems).forEach(([id, qty]) => {
            const item = cartItems.find((i) => i.id === id);
            if (!item) return;

            if (qty >= item.quantity) {
                removeCartItem(id);
                summary.push(`${item.name} (${item.size}, ${item.color.name}) x${item.quantity}`);
            } else {
                updateCartItem(id, { quantity: item.quantity - qty });
                summary.push(`${item.name} (${item.size}, ${item.color.name}) x${qty}`);
            }
        });

        setVoidedItemsSummary(summary);
        setConfirmed(true);
    };

    // 🚨 Check if trying to void entire last item
    const isLastItemFullVoid = (() => {
        if (cartItems.length !== 1) return false;

        const onlyItem = cartItems[0];
        const selectedQty = selectedItems[onlyItem.id];

        return selectedQty && selectedQty >= onlyItem.quantity;
    })();


    const handleClose = () => {
        setSelectedItems({});
        setReason('');
        setCustomReason('');
        setConfirmed(false);
        setVoidedItemsSummary([]);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                {!confirmed ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Void Items</DialogTitle>
                            <DialogDescription>Select items to remove from the cart and set quantities.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 max-h-96 overflow-auto">
                            {/* Items List */}
                            {cartItems.map((item) => {
                                const selectedQty = selectedItems[item.id] || 0;
                                return (
                                    <div key={item.id} className="flex items-center justify-between p-2 border rounded gap-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!selectedItems[item.id]}
                                                onChange={() => handleToggleItem(item.id)}
                                            />
                                            <div>
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.size} · {item.color.name} · x{item.quantity}</p>
                                            </div>
                                        </div>
                                        {selectedItems[item.id] && (
                                            <Input
                                                type="number"
                                                min={1}
                                                max={item.quantity}
                                                value={selectedQty}
                                                onChange={(e) =>
                                                    handleQuantityChange(item.id, parseInt(e.target.value) || 1, item.quantity)
                                                }
                                                className="w-20"
                                            />
                                        )}
                                    </div>
                                );
                            })}

                            {/* Reason */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Reason *</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                >
                                    <option value="">Select reason...</option>
                                    {voidReasons.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            {reason === 'Other' && (
                                <Input placeholder="Enter reason..." value={customReason} onChange={(e) => setCustomReason(e.target.value)} />
                            )}
                        </div>
                        {isLastItemFullVoid && (
                            <p className="text-sm text-red-600 font-medium">
                                This is the last item in the cart. Please void the entire transaction instead.
                            </p>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button
                                variant="destructive"
                                onClick={handleVoid}
                                disabled={
                                    Object.keys(selectedItems).length === 0 ||
                                    !reason ||
                                    (reason === 'Other' && !customReason) ||
                                    isLastItemFullVoid
                                }
                            >
                                Void Items
                            </Button>
                           

                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-pos-success">
                                <CheckCircle2 className="w-5 h-5" /> Items Voided
                            </DialogTitle>
                            <DialogDescription>
                                {voidedItemsSummary.map((i, idx) => (
                                    <p key={idx} className="text-sm">{i}</p>
                                ))}
                            </DialogDescription>
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
