import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/pos_hooks/useTransaction";
import TransactionList from "./TransactionList";
import ReceiptView from "./ReceiptView";
import ReturnView from "./ReturnView";
import ExchangeView from "./ExchangeView";
import MobileFilterDrawer from "./MobileFilterDrawer";
import Loading from "@/pages/Loading";
import EmptyState from "./EmptyState";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";

import {
    useReturnExchanges,
    useCreateReturnExchange
} from "@/hooks/pos_hooks/useReturnExchange";

const ReturnsExchangesPage = () => {
    const [view, setView] = useState("list");
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [returnReason, setReturnReason] = useState({
        predefined: "",
        custom: ""
    });
    const [returnItems, setReturnItems] = useState([]);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReturnItems, setSelectedReturnItems] = useState([]);

    const { data: returnExchangesData, isLoading: isLoadingReturns } = useReturnExchanges();

    console.log("returnExchangesData", returnExchangesData)

    const createReturnExchangeMutation = useCreateReturnExchange();
    
    const { data: transactionData, isLoading } = useTransactions();

    const transactions = transactionData?.transactions || [];

    useEffect(() => {
        if (transactions.length > 0 && !selectedTxn) {
            setSelectedTxn(transactions[0]);
        }
    }, [transactions]);

    useEffect(() => {
        if (selectedTxn?.cartItems) {
            const items = selectedTxn.cartItems.map((item, index) => ({
                id: item._id || item.id || `item-${index}`,
                name: item.name,
                sku: item.sku || `SKU-${item.productId?.slice(-6) || index}`,
                price: item.unitPrice || 0,
                qty: item.quantity || 1,
                originalItem: {
                    ...item,
                    productId: item.productId || item._id,
                    discountPercent: item.discountPercent || 0,
                    unitPrice: item.unitPrice || 0,
                    size: item.size,
                    color: typeof item.color === 'object' ? item.color.name : item.color
                }
            }));
            setReturnItems(items);
        }
    }, [selectedTxn]);

    const handleExchange = (items) => {
        setSelectedReturnItems(items);
        setView("exchange");
    };

    const handleViewReturn = (txn) => {
        setSelectedTxn(txn);
        setView("return");
    };

    const handleViewReceipt = (txn) => {
        setSelectedTxn(txn);
        setView("receipt");
    };

    const handleQtyChange = (itemId, increment) => {
        setReturnItems(prev =>
            prev.map(item => {
                if (item.id === itemId) {
                    const newQty = increment ? item.qty + 1 : Math.max(1, item.qty - 1);
                    return { ...item, qty: newQty };
                }
                return item;
            })
        );
    };

    const handleCreateReturnExchange = async (items) => {
        if (!selectedTxn) {
            toast.error("No transaction selected");
            return;
        }

        if (items.length === 0) {
            toast.error("Please select items to return");
            return;
        }

        const finalReason =
            returnReason.predefined === "Other" ? returnReason.custom : returnReason.predefined;

        if (!finalReason) {
            toast.error("Please select a return reason");
            return;
        }

        const returnTotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

        const payload = {
            type: "return",
            mode: "normal",
            originalTransactionId: selectedTxn._id,
            customer: {
                customerId: selectedTxn.customer?.customerId || selectedTxn.customer?._id,
                customerFirstName: selectedTxn.customer?.customerFirstName || "Walk-in",
                customerLastName: selectedTxn.customer?.customerLastName || "Customer",
                customerEmail: selectedTxn.customer?.customerEmail || "",
                customerPhone: selectedTxn.customer?.customerPhone || ""
            },
            items: items.map(item => ({
                productId: item.originalItem?.productId || item.id,
                name: item.name,
                quantity: item.qty,
                size: item.originalItem?.size || null,
                color: item.originalItem?.color || null,
                unitPrice: item.price,
                originalUnitPrice: item.originalItem?.unitPrice,
                discountPercent: item.originalItem?.discountPercent || 0,
                returnReason: finalReason,
            })),
            totals: {
                subtotal: returnTotal,
                totalDiscount: items.reduce((acc, item) => {
                    const discount = item.originalItem?.discountPercent || 0;
                    return acc + (item.price * item.qty * discount / 100);
                }, 0),
                grandTotal: returnTotal,
            },
            payment: {
                method: selectedTxn.payment?.paymentMethod || "cash",
                refundAmount: returnTotal,
                originalPaymentMethod: selectedTxn.payment?.paymentMethod
            },
            notes: `Return processed - Reason: ${finalReason}`
        };

        try {
            await createReturnExchangeMutation.mutateAsync(payload);
            toast.success("Return processed successfully!");
            setView("list");
            setReturnReason({ predefined: "", custom: "" });
            setSelectedItems([]);
        } catch (err) {
            console.error("Failed to create return/exchange:", err);
            toast.error(err.response?.data?.error || "Failed to process return");
        }
    };

    const handleExchangeComplete = async (exchangeData) => {
        if (!selectedTxn) return;

        const { returnItems, exchangeItem, exchangeQuantity, returnTotal, exchangeTotal, priceDifference, payment } = exchangeData;

        const payload = {
            type: "exchange",
            mode: priceDifference > 0 ? "exchange_with_payment" : priceDifference < 0 ? "exchange_with_refund" : "exchange_equal",
            originalTransactionId: selectedTxn._id,
            customer: {
                customerId: selectedTxn.customer?.customerId || selectedTxn.customer?._id,
                customerFirstName: selectedTxn.customer?.customerFirstName || "Walk-in",
                customerLastName: selectedTxn.customer?.customerLastName || "Customer",
                customerEmail: selectedTxn.customer?.customerEmail || "",
                customerPhone: selectedTxn.customer?.customerPhone || ""
            },
            items: [
                // Return items (negative)
                ...returnItems.map(item => ({
                    productId: item.originalItem?.productId || item.id,
                    name: item.name,
                    quantity: -item.qty, // Negative for returned items
                    size: item.originalItem?.size,
                    color: item.originalItem?.color,
                    unitPrice: item.price,
                    originalUnitPrice: item.originalItem?.unitPrice,
                    discountPercent: item.originalItem?.discountPercent || 0,
                    returnReason: item.returnReason || "Exchange",
                    isReturnItem: true
                })),
                // Exchange items (positive)
                {
                    productId: exchangeItem._id,
                    name: exchangeItem.productName,
                    quantity: exchangeQuantity,
                    size: exchangeItem.variantSelected.size,
                    color: exchangeItem.variantSelected.color || exchangeItem.variantSelected.stockByAttribute?.[0]?.color,
                    unitPrice: exchangeItem.variantSelected.retailPrice || exchangeItem.variantSelected.price?.retailPrice,
                    variantSku: exchangeItem.variantSelected.variantSku,
                    isExchangeItem: true
                }
            ],
            totals: {
                subtotal: exchangeTotal,
                totalDiscount: 0,
                grandTotal: exchangeTotal,
                returnTotal: returnTotal,
                exchangeTotal: exchangeTotal,
                priceDifference: Math.abs(priceDifference)
            },
            payment: {
                method: payment?.method || "exchange",
                additionalPayment: priceDifference > 0 ? payment : null,
                refundAmount: priceDifference < 0 ? Math.abs(priceDifference) : 0,
                originalPaymentMethod: selectedTxn.payment?.paymentMethod
            },
            notes: `Exchange processed - ${priceDifference > 0 ? 'Customer paid extra' : priceDifference < 0 ? 'Customer received refund' : 'Equal exchange'}`
        };

        try {
            await createReturnExchangeMutation.mutateAsync(payload);
            toast.success("Exchange completed successfully!");
            setView("list");
        } catch (err) {
            console.error("Failed to create exchange:", err);
            toast.error(err.response?.data?.error || "Failed to process exchange");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const statusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed": return "bg-green-100 text-green-700 border-green-200";
            case "refunded": return "bg-red-100 text-red-700 border-red-200";
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "exchanged": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const filteredTransactions = transactions.filter(txn => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            txn.transactionNumber?.toLowerCase().includes(query) ||
            txn.customer?.customerFirstName?.toLowerCase().includes(query) ||
            txn.customer?.customerLastName?.toLowerCase().includes(query) ||
            txn.customer?.customerEmail?.toLowerCase().includes(query) ||
            formatDate(txn.timestamp).toLowerCase().includes(query)
        );
    });

    if (isLoading || isLoadingReturns) return <Loading />;

    if (view === "receipt" && selectedTxn) {
        return (
            <ReceiptView
                selectedTxn={selectedTxn}
                onBack={() => setView("list")}
                formatDate={formatDate}
                statusColor={statusColor}
            />
        );
    }

    if (view === "exchange" && selectedTxn) {
        return (
            <ExchangeView
                selectedTxn={selectedTxn}
                returnItems={selectedReturnItems}
                onBack={() => setView("return")}
                onComplete={handleExchangeComplete}
            />
        );
    }

    if (view === "return" && selectedTxn) {
        return (
            <ReturnView
                selectedTxn={selectedTxn}
                returnItems={returnItems}
                returnReason={returnReason}
                onReturnReasonChange={setReturnReason}
                onQtyChange={handleQtyChange}
                onBack={() => setView("list")}
                onExchange={handleExchange}
                formatDate={formatDate}
                statusColor={statusColor}
                handleCreateReturnExchange={handleCreateReturnExchange}
                setReturnReason={setReturnReason}
            />
        );
    }

    // Main List View
    return (
        <div className="px-4 sm:px-6 lg:px-0">
            <MobileFilterDrawer
                show={showMobileFilter}
                onClose={() => setShowMobileFilter(false)}
            />

            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1 overflow-x-auto whitespace-nowrap pb-2">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Returns & Exchanges</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Return Exchange Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View, manage, and process returns/exchanges
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowMobileFilter(true)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
                    >
                        <Filter size={16} />
                        Filter
                    </button>

                    <div className="hidden lg:block relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            placeholder="Search by transaction, customer or date..."
                            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-80 bg-card outline-none focus:ring-1 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="lg:hidden relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    placeholder="Search transactions..."
                    className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm bg-card outline-none focus:ring-1 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <h3 className="font-semibold text-base sm:text-lg">Transaction History</h3>
                <p className="text-sm text-muted-foreground">
                    {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {filteredTransactions.length === 0 ? (
                <EmptyState searchQuery={searchQuery} />
            ) : (
                <TransactionList
                    transactions={filteredTransactions}
                    onViewReceipt={handleViewReceipt}
                    onViewReturn={handleViewReturn}
                    formatDate={formatDate}
                    statusColor={statusColor}
                />
            )}
        </div>
    );
};

export default ReturnsExchangesPage;