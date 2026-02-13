import React, { useState } from "react";
import { X, DollarSign, CreditCard, Smartphone, Landmark } from "lucide-react";
import { toast } from "sonner";

const PaymentModal = ({ isOpen, onClose, onComplete, amount, returnTotal, exchangeTotal, selectedTxn }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountTendered, setAmountTendered] = useState(amount);
    const [change, setChange] = useState(0);

    if (!isOpen) return null;

    const handleAmountChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setAmountTendered(value);
        setChange(value - amount);
    };

    const handlePayment = () => {
        if (amountTendered < amount) {
            toast.error(`Insufficient amount. Need $${(amount - amountTendered).toFixed(2)} more`);
            return;
        }

        onComplete({
            method: paymentMethod,
            amount: amount,
            amountTendered: amountTendered,
            change: change,
            timestamp: new Date().toISOString()
        });

        toast.success(`Payment of $${amount.toFixed(2)} completed`);
    };

    const paymentMethods = [
        { id: "cash", label: "Cash", icon: DollarSign },
        { id: "card", label: "Card", icon: CreditCard },
        { id: "mobile", label: "Mobile Payment", icon: Smartphone },
        { id: "bank", label: "Bank Transfer", icon: Landmark }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">Additional Payment Required</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Return Value:</span>
                            <span className="font-medium">${returnTotal?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Exchange Value:</span>
                            <span className="font-medium">${exchangeTotal?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Amount to Pay:</span>
                                <span className="text-primary">${amount?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
                        <p>Original Transaction: {selectedTxn?.transactionNumber}</p>
                        <p>Date: {selectedTxn?.timestamp ? new Date(selectedTxn.timestamp).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex items-center gap-2 p-3 border rounded-lg transition ${paymentMethod === method.id
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'hover:bg-muted'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="text-sm">{method.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Amount Tendered
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                            </span>
                            <input
                                type="number"
                                value={amountTendered}
                                onChange={handleAmountChange}
                                min={amount}
                                step="0.01"
                                className="w-full pl-7 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>

                    {change > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-700 font-medium">Change Due</p>
                            <p className="text-2xl font-bold text-green-700">
                                ${change.toFixed(2)}
                            </p>
                        </div>
                    )}

                    {amountTendered < amount && amountTendered > 0 && (
                        <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-700">
                            Insufficient amount. Need ${(amount - amountTendered).toFixed(2)} more.
                        </div>
                    )}
                </div>

                <div className="flex gap-3 p-6 border-t">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={amountTendered < amount}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Complete Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;