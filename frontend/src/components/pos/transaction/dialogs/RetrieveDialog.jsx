import { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTransaction } from '@/context/TransactionContext';
import { toast } from '@/hooks/use-toast';

const heldTransactions = [];

// Function to park a transaction
function holdTransaction(items, reason = 'Customer requested hold') {
    const parkCode = `PARK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    heldTransactions.push({
        parkCode,
        items,
        reason,
        subtotal,
        timestamp: new Date(),
    });
    return parkCode;
}

// Get all held transactions
function getHeldTransactions() {
    return heldTransactions;
}

// Retrieve a held transaction
function retrieveHeldTransaction(parkCode) {
    const index = heldTransactions.findIndex((t) => t.parkCode === parkCode);
    if (index === -1) return null;
    const txn = heldTransactions[index];
    heldTransactions.splice(index, 1); // remove after retrieval
    return txn;
}

// ===== RetrieveDialog Component =====
export function RetrieveDialog({ open, onOpenChange }) {
    const { setCartItems, cartItems, setCurrentStep } = useTransaction();
    const held = getHeldTransactions();

    const handleRetrieve = (parkCode) => {
        if (cartItems.length > 0) {
            toast({
                title: 'Current cart is not empty',
                description: 'Please complete or void the current transaction first',
                variant: 'destructive',
            });
            return;
        }
        const txn = retrieveHeldTransaction(parkCode);
        if (txn) {
            setCartItems(txn.items);
            setCurrentStep(1);
            onOpenChange(false);
            toast({
                title: 'Transaction retrieved',
                description: `Park code: ${parkCode}`,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Retrieve Held Transaction</DialogTitle>
                    <DialogDescription>Select a parked transaction to restore.</DialogDescription>
                </DialogHeader>
                {held.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No held transactions</p>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-auto">
                        {held.map((t) => (
                            <button
                                key={t.parkCode}
                                onClick={() => handleRetrieve(t.parkCode)}
                                className="w-full text-left p-3 border rounded-lg hover:border-primary transition-colors bg-card"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-mono font-semibold text-sm">{t.parkCode}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{t.reason}</p>
                                        <p className="text-xs text-muted-foreground">{t.items.length} items</p>
                                        {/* Show product images if available */}
                                        <div className="flex gap-1 mt-1">
                                            {t.items.map((i) => i.imageUrl && (
                                                <img
                                                    key={i.id}
                                                    src={i.imageUrl}
                                                    alt={i.name}
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm">${t.subtotal.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">{t.timestamp.toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            </DialogContent>
        </Dialog>
    );
}
