import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useSettings } from "@/hooks/useSettings";
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
    setReturnReason,
    newItems,
    returnedItems,
    updatedTotals
}) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [showExchangeHistory, setShowExchangeHistory] = useState(false);

    const { data: settings } = useSettings();
 

    // Reset selection whenever returnItems change
    useEffect(() => {
        setSelectedItems([]);
    }, [returnItems]);

    const customerName = selectedTxn.customer
        ? `${selectedTxn.customer.customerFirstName || ''} ${selectedTxn.customer.customerLastName || ''}`.trim()
        : 'Walk-in Customer';

    const handleItemCheck = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Calculate loyalty discount per item from updatedTotals
    const totalItemsInTransaction = selectedTxn?.summary?.totalItemsPurchased ||
        selectedTxn?.cartItems?.length || 1;

    const loyaltyDiscountPerItem = selectedTxn?.loyalty?.loyaltyDiscount
        ? selectedTxn.loyalty.loyaltyDiscount / totalItemsInTransaction
        : 0;

    const getExchangedItemIds = (txn) => {
        if (!txn.returnExchangeIds || !txn.exchanges) return [];

        // Collect all item IDs from exchanges
        return txn.exchanges.flatMap(exchange => exchange.items?.map(i => i.id || i.productId) || []);
    };


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


            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Transaction Summary */}
                <div className="bg-card rounded-lg border p-4 sm:p-6 max-w-full mb-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm mb-6">
                        <div>
                            <span className="text-xs text-muted-foreground">Transaction #:</span>
                            <p className="font-medium text-sm break-all">{selectedTxn.transactionNumber}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Date:</span>
                            <p className="text-sm">{formatDate(selectedTxn.createdAt || selectedTxn.timestamp)}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Customer:</span>
                            <p className="text-sm truncate">{customerName}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Payment:</span>
                            <p className="text-sm capitalize">
                                {selectedTxn.originalPayment?.paymentMethod ||
                                    selectedTxn.payment?.paymentMethod || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Items:</span>
                            <p className="text-sm">
                                {selectedTxn.summary?.totalItemsPurchased ||
                                    selectedTxn.cartItems?.length || 0} items
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Total:</span>
                            <p className="text-base font-bold text-primary">
                                {settings?.currencySymbol }{(selectedTxn.updatedTotals?.originalGrandTotal ||
                                    selectedTxn.totals?.grandTotal || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>


                    {/* Updated Totals */}
                    {updatedTotals && (
                        <div className="mt-5">
                            <h3 className="text-sm font-semibold mb-2 text-primary">
                                Updated Totals
                            </h3>

                            <div className="bg-gray-50 border rounded-lg p-3 text-xs space-y-1">

                                <div className="flex justify-between">
                                    <span>Original:</span>
                                    <span>
                                        {settings?.currencySymbol}{updatedTotals.originalGrandTotal}
                                    </span>
                                </div>

                                <div className="flex justify-between text-red-600">
                                    <span>Returned:</span>
                                    <span>
                                        - {settings?.currencySymbol}{updatedTotals.returnedValue}
                                    </span>
                                </div>

                                {updatedTotals.exchangeValue > 0 && (
                                    <div className="flex justify-between text-blue-600">
                                        <span>Exchange:</span>
                                        <span>
                                            {settings?.currencySymbol}{updatedTotals.exchangeValue}
                                        </span>
                                    </div>
                                )}

                                {updatedTotals.additionalPaymentTotal > 0 && (
                                    <div className="flex justify-between text-primary">
                                        <span>Additional Paid:</span>
                                        <span>
                                            {settings?.currencySymbol}{updatedTotals.additionalPaymentTotal}
                                        </span>
                                    </div>
                                )}

                                <div className="border-t pt-1 mt-2 flex justify-between font-semibold text-sm">
                                    <span>Net:</span>
                                    <span>
                                        {settings?.currencySymbol}{updatedTotals.netAmount}
                                    </span>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Exchange Summary - Show if exchanges exist */}
                    {selectedTxn.exchanges?.length > 0 && (
                        <div className="mb-6 border rounded-lg p-4 bg-blue-50/50">
                            <button
                                onClick={() => setShowExchangeHistory(!showExchangeHistory)}
                                className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-2"
                            >
                                <RefreshCw size={16} />
                                {selectedTxn.exchanges.length} Exchange Transaction(s)
                                <span className="text-xs">{showExchangeHistory ? '▼' : '▶'}</span>
                            </button>

                            {showExchangeHistory && (
                                <div className="space-y-3 mt-2">
                                    {selectedTxn.exchanges.map((exchange, idx) => (
                                        <div key={exchange._id || idx} className="text-xs border-t pt-2">
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Exchange #{exchange.transactionNumber}</span>
                                                <span>{formatDate(exchange.createdAt)}</span>
                                            </div>
                                            <div className="mt-1">
                                                {exchange.items?.map((item, i) => (
                                                    <div key={i} className="flex justify-between">
                                                        <span>
                                                            {item.quantity < 0 ? '↩ Returned:' : '↪ New:'}
                                                            {item.name} x{Math.abs(item.quantity)}
                                                        </span>
                                                        <span className="font-medium">
                                                            {settings?.currencySymbol || '$'}{Math.abs(item.unitPrice * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between mt-1 font-medium">
                                                <span>Exchange Total:</span>
                                                <span>{settings?.currencySymbol}{exchange.totals?.grandTotal?.toFixed(2) || 0}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Exchange Items Summary */}
                                    {selectedTxn.exchangeItems?.length > 0 && (
                                        <div className="border-t mt-2 pt-2">
                                            <p className="font-medium mb-1">Items Received from Exchanges:</p>
                                            {selectedTxn.exchangeItems.map((item, i) => (
                                                <div key={i} className="flex justify-between text-xs">
                                                    <span>{item.name} x{item.quantity}</span>
                                                    <span>{settings?.currencySymbol}{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Return Summary - Show if returns exist */}
                    {selectedTxn.returns?.length > 0 && (
                        <div className="mb-6 border rounded-lg p-4 bg-amber-50/50">
                            <p className="text-sm font-semibold text-amber-700 mb-2">
                                {selectedTxn.returns.length} Return Transaction(s)
                            </p>
                            {selectedTxn.returns.map((ret, idx) => (
                                <div key={ret._id || idx} className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span>Return #{ret.transactionNumber}</span>
                                        <span>{formatDate(ret.createdAt)}</span>
                                    </div>
                                    {ret.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-muted-foreground">
                                            <span>↩ {item.name} x{item.quantity}</span>
                                            <span>{settings?.currencySymbol}{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-medium mt-1">
                                        <span>Refund Amount:</span>
                                        <span className="text-red-600">
                                            - {settings?.currencySymbol}{ret.totals?.grandTotal?.toFixed(2) || 0}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Updated Totals Summary */}
                    {selectedTxn.updatedTotals && (
                        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                            <p className="text-sm font-semibold mb-2">Financial Summary</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                    <span>Original Total:</span>
                                    <span>{settings?.currencySymbol}{selectedTxn.updatedTotals.originalGrandTotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                    <span>Returned:</span>
                                    <span>- {settings?.currencySymbol}{selectedTxn.updatedTotals.returnedValue?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Exchange Value:</span>
                                    <span>{settings?.currencySymbol}{selectedTxn.updatedTotals.exchangeValue?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Additional Paid:</span>
                                    <span>+ {settings?.currencySymbol}{selectedTxn.updatedTotals.additionalPaymentTotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                    <span>Refunded:</span>
                                    <span>- {settings?.currencySymbol}{selectedTxn.updatedTotals.refundTotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold border-t pt-1 mt-1 col-span-2">
                                    <span>Net Amount:</span>
                                    <span>{settings?.currencySymbol}{selectedTxn.updatedTotals.netAmount?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cart Items - Only show items with remaining quantity */}
                    <h3 className="font-semibold my-3">Items Eligible for Return/Exchange</h3>
                    {returnItems.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground border rounded-lg">
                            <p>No items available for return or exchange.</p>
                            <p className="text-xs mt-1">All items have been fully returned or exchanged.</p>
                        </div>
                    ) : (
                        returnItems.map((item, index) => {
                            const itemId = item.id || `item-${index}`;
                            const isChecked = selectedItems.includes(itemId);

                            const unitPrice = item.price || 0;
                            const quantity = item.qty || 1;
                            const discountPercent = item.originalItem?.discountPercent || 0;

                            const subtotal = unitPrice * quantity;
                            const discountAmount = subtotal * (discountPercent / 100);
                            const totalAfterDiscounts = subtotal - discountAmount - loyaltyDiscountPerItem;

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
                                                    Color: {item.originalItem?.color || 'N/A'} |
                                                    Size: {item.originalItem?.size || 'N/A'}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Status: <span className="capitalize">{item.status || 'purchased'}</span>
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <p className="text-sm font-medium text-primary">
                                                    {settings?.currencySymbol}{unitPrice.toFixed(2)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => onQtyChange(item.id, false)}
                                                        className="p-1 rounded hover:bg-muted"
                                                        disabled={quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm w-6 text-center">{quantity}</span>
                                                    <button
                                                        onClick={() => onQtyChange(item.id, true)}
                                                        className="p-1 rounded hover:bg-muted"
                                                        disabled={quantity >= item.maxReturnQty}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Max: {item.maxReturnQty}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                                            {discountPercent > 0 && (
                                                <div className="flex justify-between">
                                                    <span>Discount ({discountPercent}%):</span>
                                                    <span>-{settings?.currencySymbol || '$'}{discountAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {loyaltyDiscountPerItem > 0 && (
                                                <div className="flex justify-between border-b pb-1">
                                                    <span>Loyalty Discount:</span>
                                                    <span>-{settings?.currencySymbol || '$'}{loyaltyDiscountPerItem.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-bold">
                                                <span>Refund Amount:</span>
                                                <span className="text-primary">{settings?.currencySymbol || '$'}{totalAfterDiscounts.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Return Reason */}
                    <h3 className="font-semibold mb-3 mt-6">Return Reason</h3>
                    <select
                        value={returnReason?.predefined || ""}
                        onChange={(e) => onReturnReasonChange({ predefined: e.target.value, custom: "" })}
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
                            onChange={(e) => onReturnReasonChange({ ...returnReason, custom: e.target.value })}
                            placeholder="Type your reason"
                            className="w-full border rounded-lg px-3 py-2.5 text-sm bg-card outline-none focus:ring-1 focus:ring-primary mb-4"
                        />
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={onBack}
                            className="w-full sm:flex-1 px-4 py-2.5 border rounded-lg text-sm hover:bg-muted transition"
                        >
                            Back
                        </button>

                        <button
                            onClick={() => {
                                const selectedItemsFull = returnItems.filter(item =>
                                    selectedItems.includes(item.id)
                                );
                                handleCreateReturnExchange(selectedItemsFull);
                            }}
                            className="w-full sm:flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedItems.length === 0 || returnItems.length === 0}
                        >
                            Return ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})
                        </button>

                        <button
                            onClick={() => {
                                const selectedItemsFull = returnItems.filter(item =>
                                    selectedItems.includes(item.id)
                                );
                                onExchange(selectedItemsFull);
                            }}
                            className="w-full sm:flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedItems.length === 0 || returnItems.length === 0}
                        >
                            Exchange ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})
                        </button>
                    </div>
                </div>

                <div className="">

                    {/* ================= RETURNED ITEMS ================= */}
                    <Card className='p-4'>
                        <h3 className="font-semibold mb-3">Returned Items</h3>

                        {returnedItems.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground border rounded-lg">
                                <p>No returned items.</p>
                            </div>
                        ) : (
                            <div className="border rounded-lg divide-y">

                                {returnedItems.map((item, index) => {
                                    const itemId = item.id || `item-${index}`;
                                    const unitPrice = item.unitPrice || 0;
                                    const quantity = item.qty || 1;
                                    const discountPercent = item.originalItem?.discountPercent || 0;

                                    const subtotal = unitPrice * quantity;
                                    const discountAmount = subtotal * (discountPercent / 100);
                                    const totalAfterDiscounts =
                                        subtotal - discountAmount - (loyaltyDiscountPerItem || 0);

                                    return (
                                        <div
                                            key={itemId}
                                            className="p-4 hover:bg-muted/40 transition"
                                        >
                                            <div className="flex justify-between items-start gap-4">

                                                {/* LEFT */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm">
                                                        {item.name}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Color: {item.originalItem?.color || "N/A"} |
                                                        Size: {item?.size || "N/A"} |
                                                        Qty: {quantity}
                                                    </p>

                                                    {discountPercent > 0 && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            Discount: -{settings?.currencySymbol || '$'}{discountAmount.toFixed(2)}
                                                        </p>
                                                    )}

                                                    {loyaltyDiscountPerItem > 0 && (
                                                        <p className="text-xs text-green-600">
                                                            Loyalty: -{settings?.currencySymbol || '$'}
                                                            {loyaltyDiscountPerItem.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* RIGHT */}
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">
                                                        Unit: {settings?.currencySymbol || '$'}{unitPrice.toFixed(2)}
                                                    </p>
                                                    <p className="font-bold text-sm text-red-600">
                                                        -{settings?.currencySymbol || '$'}{totalAfterDiscounts.toFixed(2)}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}
                    </Card>


                    {/* ================= EXCHANGE ITEMS ================= */}
                    {newItems?.length > 0 && (
                        <div className="bg-card mt-4 p-4 shadow-md rounded-md">
                            <h3 className="font-semibold mb-3">
                                Items Received from Exchanges
                            </h3>

                            <div className="border rounded-lg divide-y">

                                {newItems.map((item, index) => {
                                    const itemId = item.productId || `ex-item-${index}`;
                                    const quantity = item.quantity || 1;
                                    const total = item.total || 0;

                                    return (
                                        <div
                                            key={itemId}
                                            className="p-4 hover:bg-muted/40 transition"
                                        >
                                            <div className="flex justify-between items-start gap-4">

                                                {/* LEFT */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm">
                                                        {item.name}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Color: {item.color || "N/A"} |
                                                        Size: {item.size || "N/A"} |
                                                        Qty: {quantity}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Exchanged From: {item.exchangedFrom || "N/A"}
                                                    </p>
                                                </div>

                                                {/* RIGHT */}
                                                <div className="text-right">
                                                    <p className="font-bold text-sm text-emerald-600">
                                                        {settings?.currencySymbol || '$'}{total.toFixed(2)}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    )}

                </div>


            </div>
        </div>
    );
};

export default ReturnView;