import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useProducts } from "@/hooks/inv_hooks/useProducts";
import PaymentModal from "./PaymentModal";
import { toast } from "sonner";

const ExchangeView = ({ selectedTxn, returnItems, onBack, onComplete }) => {
    const { data: productsData, isLoading } = useProducts();

 
    const [selectedExchange, setSelectedExchange] = useState(null);
    const [exchangeQuantity, setExchangeQuantity] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const returnTotal = returnItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const getVariantPrice = (variant) => {
        if (variant.retailPrice) return variant.retailPrice;
        if (variant.price?.retailPrice) return variant.price.retailPrice;
        return 0;
    };

    const exchangeTotal = selectedExchange
        ? getVariantPrice(selectedExchange.variantSelected) * exchangeQuantity
        : 0;

    const priceDifference = exchangeTotal - returnTotal;
    const isExtraPayment = priceDifference > 0;
    const isRefundDue = priceDifference < 0;

    const handleSelectExchange = (product, variant) => {
        setSelectedExchange({
            ...product,
            variantSelected: variant
        });
        setExchangeQuantity(1);
        setPaymentComplete(false);
    };

    const handleProceedToPayment = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentComplete = (paymentDetails) => {
        setPaymentComplete(true);
        setShowPaymentModal(false);

        onComplete({
            returnItems,
            exchangeItem: selectedExchange,
            exchangeQuantity,
            returnTotal,
            exchangeTotal,
            priceDifference,
            payment: paymentDetails
        });

        toast.success("Exchange payment completed");
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <p>Loading products...</p>
        </div>
    );

    return (
        <div className="px-4 sm:px-6 lg:px-0">
            {showPaymentModal && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    onComplete={handlePaymentComplete}
                    amount={priceDifference}
                    returnTotal={returnTotal}
                    exchangeTotal={exchangeTotal}
                    selectedTxn={selectedTxn}
                />
            )}

            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1 overflow-x-auto whitespace-nowrap pb-2">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Exchange Items</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg sm:text-xl font-bold">Select Exchange Products</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column: Return Items */}
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                    <h3 className="font-semibold mb-4">Items Being Returned</h3>
                    <div className="space-y-3">
                        {returnItems.map(item => (
                            <div key={item.id} className="border rounded-lg p-3 bg-muted/30">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Size: {item.originalItem?.size || "N/A"} |
                                            Color: {item.originalItem?.color || "N/A"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Quantity: {item.qty} × ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-bold text-primary">
                                        ${(item.price * item.qty).toFixed(2)}
                                    </p>
                                </div>
                                {item.returnReason && (
                                    <div className="mt-2 text-xs bg-yellow-50 p-2 rounded">
                                        <span className="font-medium">Reason:</span> {item.returnReason}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between font-semibold">
                                <span>Total Return Value:</span>
                                <span className="text-primary">${returnTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Available Products for Exchange */}
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                    <h3 className="font-semibold mb-4">Select Exchange Product</h3>

                    {productsData?.data?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No products available.</p>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                            {productsData.data.map(product => (
                                <div key={product._id} className="border rounded-lg overflow-hidden">
                                    <div className="bg-muted/30 p-3 font-medium">
                                        {product.productName}
                                    </div>

                                    <div className="divide-y">
                                        {product.variants?.filter(v => {
                                            const hasStock = v.stockByAttribute?.some(s => s.quantity > 0);
                                            return hasStock;
                                        }).map(variant => {
                                            const price = getVariantPrice(variant);
                                            const isSelected = selectedExchange?._id === product._id &&
                                                selectedExchange?.variantSelected?.variantSku === variant.variantSku;

                                            const availableColors = variant.stockByAttribute
                                                ?.filter(s => s.quantity > 0)
                                                .map(s => s.color)
                                                .join(', ') || 'N/A';

                                            return (
                                                <div
                                                    key={variant.variantSku}
                                                    className={`p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${isSelected ? 'bg-primary/5 border-l-4 border-primary' : ''
                                                        }`}
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium">
                                                                Size: {variant.size}
                                                            </p>
                                                            <span className="text-xs bg-muted px-2 py-1 rounded">
                                                                SKU: {variant.variantSku.slice(-8)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Available Colors: {availableColors}
                                                        </p>
                                                        <p className="text-sm font-semibold text-primary mt-1">
                                                            Price: ${price.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => handleSelectExchange(product, variant)}
                                                        disabled={isSelected}
                                                        className={`px-3 py-1.5 text-xs rounded transition whitespace-nowrap ${isSelected
                                                                ? 'bg-green-100 text-green-700 border border-green-300 cursor-default'
                                                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                            }`}
                                                    >
                                                        {isSelected ? 'Selected' : 'Select'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Exchange Summary */}
            {selectedExchange && (
                <div className="mt-6 border rounded-lg p-4 sm:p-6 bg-card">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold">Selected for Exchange:</h4>
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                    {selectedExchange.productName} - Size {selectedExchange.variantSelected.size}
                                </span>
                                <button
                                    onClick={() => setSelectedExchange(null)}
                                    className="p-1 hover:bg-muted rounded-full"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">Quantity:</span>
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={() => setExchangeQuantity(prev => Math.max(1, prev - 1))}
                                            className="px-3 py-1 hover:bg-muted transition"
                                            disabled={exchangeQuantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 border-x text-sm font-medium">
                                            {exchangeQuantity}
                                        </span>
                                        <button
                                            onClick={() => setExchangeQuantity(prev => prev + 1)}
                                            className="px-3 py-1 hover:bg-muted transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <span className="text-muted-foreground">Unit Price: </span>
                                    <span className="font-medium">
                                        ${getVariantPrice(selectedExchange.variantSelected).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-80 bg-muted/30 rounded-lg p-4">
                            <h5 className="font-semibold mb-2">Exchange Summary</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Return Total:</span>
                                    <span className="font-medium">${returnTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Exchange Total ({exchangeQuantity} item{exchangeQuantity > 1 ? 's' : ''}):</span>
                                    <span className="font-medium">${exchangeTotal.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-bold">
                                        <span>Difference:</span>
                                        <span className={
                                            isExtraPayment ? 'text-red-600' :
                                                isRefundDue ? 'text-green-600' :
                                                    'text-muted-foreground'
                                        }>
                                            {isExtraPayment ? '+' : isRefundDue ? '-' : ''}${Math.abs(priceDifference).toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {isExtraPayment && 'Customer needs to pay extra amount'}
                                        {isRefundDue && 'Customer will receive refund'}
                                        {!isExtraPayment && !isRefundDue && 'No additional payment required'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setSelectedExchange(null)}
                            className="px-4 py-2 border rounded-lg hover:bg-muted transition"
                        >
                            Cancel
                        </button>

                        {isExtraPayment && !paymentComplete ? (
                            <button
                                onClick={handleProceedToPayment}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
                            >
                                Proceed to Payment (${priceDifference.toFixed(2)})
                            </button>
                        ) : (
                            <button
                                onClick={() => onComplete({
                                    returnItems,
                                    exchangeItem: selectedExchange,
                                    exchangeQuantity,
                                    returnTotal,
                                    exchangeTotal,
                                    priceDifference,
                                    payment: isRefundDue ? {
                                        method: "refund",
                                        amount: Math.abs(priceDifference),
                                        refundAmount: Math.abs(priceDifference)
                                    } : {
                                        method: "exchange",
                                        amount: 0
                                    }
                                })}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition font-medium"
                                disabled={isExtraPayment && !paymentComplete}
                            >
                                {isRefundDue ? 'Process Exchange with Refund' : 'Complete Exchange'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExchangeView;