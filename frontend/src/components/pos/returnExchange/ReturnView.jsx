import React, { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const ReturnView = ({
    selectedTxn,
    returnItems,
    returnReason,
    onReturnReasonChange,
    onQtyChange,
    onBack,
    onExchange,
    formatDate,
    handleCreateReturnExchange,
    setReturnReason
}) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const customerName = selectedTxn.customer
        ? `${selectedTxn.customer.customerFirstName || ''} ${selectedTxn.customer.customerLastName || ''}`.trim()
        : 'Walk-in Customer';

   

    const handleItemCheck = (itemId) => {
        setSelectedItems(prev => {
            const newSelection = prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId];
            return newSelection;
        });
    };

    // Calculate per-item loyalty discount and points
    const totalItemsInTransaction = selectedTxn?.cartItems?.length || 1;
    const loyaltyDiscountPerItem = selectedTxn?.loyalty?.loyaltyDiscount
        ? selectedTxn.loyalty.loyaltyDiscount / totalItemsInTransaction
        : 0;
    const pointsPerItem = selectedTxn?.loyalty?.pointsEarned
        ? Math.floor(selectedTxn.loyalty.pointsEarned / totalItemsInTransaction)
        : 0;

    return (
        <div className="px-4 sm:px-6 lg:px-0">
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1 overflow-x-auto whitespace-nowrap pb-2">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Returns & Exchanges</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg sm:text-xl font-bold">Transaction Details</h1>
            </div>

            {/* Transaction Summary */}
            <div className="bg-card rounded-lg border p-4 sm:p-6 max-w-2xl mb-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm mb-6">
                    <div>
                        <span className="text-xs text-muted-foreground">Transaction #:</span>
                        <p className="font-medium text-sm break-all">{selectedTxn.transactionNumber}</p>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground">Date:</span>
                        <p className="text-sm">{formatDate(selectedTxn.timestamp)}</p>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground">Customer:</span>
                        <p className="text-sm truncate">{customerName}</p>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground">Payment:</span>
                        <p className="text-sm capitalize">{selectedTxn.payment?.paymentMethod}</p>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground">Items:</span>
                        <p className="text-sm">{selectedTxn.cartItems?.length || 0} items</p>
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground">Total:</span>
                        <p className="text-base font-bold text-primary">
                            ${selectedTxn.totals?.grandTotal?.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Cart Items with Checkboxes */}
                {selectedTxn.cartItems.map((item, index) => {
                    const itemId = item.id || `item-${index}`;
                    const isChecked = selectedItems.includes(itemId);

                    const unitPrice = item.unitPrice || 0;
                    const quantity = item.quantity || 1;
                    const discountPercent = item.discountPercent || 0;

                    const subtotal = unitPrice * quantity;
                    const percentDiscountAmount = subtotal * (discountPercent / 100);
                    const afterPercentDiscount = subtotal - percentDiscountAmount;
                    const afterLoyaltyDiscount = afterPercentDiscount - loyaltyDiscountPerItem;
                    const total = afterLoyaltyDiscount;

                    return (
                        <div
                            key={itemId}
                            className="border rounded-lg p-4 mb-4 bg-card/50 hover:shadow-md transition-shadow flex items-start gap-3"
                        >
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => handleItemCheck(itemId)}
                            />

                            <div className="flex-1">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Color: {item.color?.name || 'N/A'} | Size: {item.size || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-sm font-medium text-primary">
                                            ${unitPrice.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-medium">Qty: {quantity}</p>
                                    </div>
                                </div>

                                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                                  
                                    {discountPercent > 0 && (
                                        <div className="flex justify-between">
                                            <span>Discount ({discountPercent}%):</span>
                                            <span>-${percentDiscountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {loyaltyDiscountPerItem > 0 && (
                                        <div className="flex justify-between border-b pb-1">
                                            <span>Loyalty Discount:</span>
                                            <span>-${loyaltyDiscountPerItem.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold">
                                        <span>After All Discounts:</span>
                                        <span>${afterLoyaltyDiscount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t font-medium text-primary">
                                        <span>Item Total:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                
                {/* Return Reason */}
                <h3 className="font-semibold mb-3">Return Reason</h3>

                <select
                    value={returnReason?.predefined || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "Other") {
                            setReturnReason({ predefined: "Other", custom: "" });
                        } else {
                            setReturnReason({ predefined: value, custom: "" });
                        }
                    }}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm bg-card outline-none focus:ring-1 focus:ring-primary mb-2"
                >
                    <option value="">Select Return Reason</option>
                    <option value="Defective Product">Defective Product</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Changed Mind">Changed Mind</option>
                    <option value="Not As Described">Not As Described</option>
                    <option value="Other">Other</option>
                </select>

                {returnReason?.predefined === "Other" && (
                    <input
                        type="text"
                        value={returnReason?.custom || ""}
                        onChange={(e) =>
                            setReturnReason({ ...returnReason, custom: e.target.value })
                        }
                        placeholder="Type your reason"
                        className="w-full border rounded-lg px-3 py-2.5 text-sm bg-card outline-none focus:ring-1 focus:ring-primary mb-4"
                    />
                )}


              


                <div className="flex items-center gap-2 mt-4 mb-6">
                    <Checkbox id="agree-return" className="w-4 h-4" />
                    <label htmlFor="agree-return" className="text-sm">I agree to return</label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                        onClick={onBack}
                        className="w-full sm:flex-1 px-4 py-2.5 border rounded-lg text-sm hover:bg-muted transition"
                    >
                        Back
                    </button>

                    <button
                        onClick={() => {
                            const selectedItemsFull = returnItems.filter(item =>
                                selectedItems.includes(item.id) ||
                                selectedItems.includes(item.originalItem?.id)
                            );
                            handleCreateReturnExchange(selectedItemsFull);
                        }}
                        className="w-full sm:flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm"
                        disabled={selectedItems.length === 0}
                    >
                        Return
                    </button>

                    <button
                        onClick={() => {
                            const selectedFullItems = returnItems.filter(item => {
                                return (
                                    selectedItems.includes(item.id) ||
                                    selectedItems.includes(item._id) ||
                                    selectedItems.includes(item.originalItem?.id) ||
                                    selectedItems.includes(item.originalItem?._id)
                                );
                            });
                            onExchange(selectedFullItems);
                        }}
                        className="w-full sm:flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedItems.length === 0}
                    >
                        Exchange 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnView;
