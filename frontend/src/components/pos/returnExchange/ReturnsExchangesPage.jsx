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
import { useSettings } from "@/hooks/useSettings";
import {
    useTransactionFullDetails,
    useCreateReturnExchange
} from "@/hooks/pos_hooks/useReturnExchange";
import { Card } from "@/components/ui/card";

const ReturnsExchangesPage = () => {

    const { data: settings } = useSettings();



    const [view, setView] = useState("list");
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [returnReason, setReturnReason] = useState({ predefined: "", custom: "" });
    const [returnItems, setReturnItems] = useState([]);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReturnItems, setSelectedReturnItems] = useState([]);

    const createReturnExchangeMutation = useCreateReturnExchange();
    const { data: transactionData, isLoading } = useTransactions();
    const transactions = transactionData?.transactions || [];

  

    const { data: transactionFullDetails, isLoading: isLoadingReturns } = useTransactionFullDetails(
        selectedTxn?._id,
        {
            enabled: !!selectedTxn?._id
        }
    );
    
   
    // Filters
    const [filterByDate, setFilterByDate] = useState("all"); // all, today, yesterday, last7days
    const [filterByPayment, setFilterByPayment] = useState("all"); // all, cash, card
    const [filterByStatus, setFilterByStatus] = useState("all"); // all, completed, returned, pending
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    useEffect(() => {
        if (!transactionFullDetails) return;

        const txn = transactionFullDetails;

        // Collect all exchanged item IDs
        const exchangedItemIds = txn.exchanges?.flatMap(ex =>
            ex.items?.map(i => i.id || i.productId) || []
        ) || [];


        
        // Build cart items with remaining quantity (exclude fully returned or exchanged items)
        const items = txn.soldItems
            .map((item, index) => {
                const remainingQty =
                    (item.purchasedQty || 0) -
                    (item.returnedQty || 0) -
                    (exchangedItemIds.includes(item.productId) ? 1 : 0); // subtract exchanged qty

                if (remainingQty <= 0) return null; // skip fully returned or exchanged
               
                return {
                    id: item.id || item.productId || `item-${index}`,
                    name: item.name,
                    productId: item.productId,
                    variantId: item.variantId,
                    price: item.unitPrice || 0,
                    qty: remainingQty,
                    maxReturnQty: remainingQty,
                    originalItem: {
                        productId: item.productId,
                        variantId: item.variantId || null,
                        unitPrice: item.unitPrice || 0,
                        discountPercent: item.discountPercent || 0,
                        size: item.size || null,
                        color: item.color?.name || item.color || null
                    },
                    status:
                        remainingQty < (item.purchasedQty || 0) ? 'partially_returned' : 'purchased'
                };
            })
            .filter(Boolean);

        setReturnItems(items);

    }, [transactionFullDetails]);



    const handleViewReturn = (txn) => {
        setSelectedTxn(txn);
        setView("return");
    };

    const handleViewReceipt = (txn) => {
        setSelectedTxn(txn);
        setView("receipt");
    };

    const handleExchange = (items) => {
        setSelectedReturnItems(items);
        setView("exchange");
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
        const finalReason = returnReason.predefined === "Other" ? returnReason.custom : returnReason.predefined;
        if (!finalReason) {
            toast.error("Please select a return reason");
            return;
        }

        const returnTotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
       
       
        const payload = {
            type: "return",
            mode: "normal",
            originalTransactionId: selectedTxn._id,
            branch: selectedTxn.branch, 
            customer: {
                customerId: selectedTxn.customer?.customerId || selectedTxn.customer?._id,
                customerFirstName: selectedTxn.customer?.customerFirstName || "Walk-in",
                customerLastName: selectedTxn.customer?.customerLastName || "Customer",
                customerEmail: selectedTxn.customer?.customerEmail || "",
                customerPhone: selectedTxn.customer?.customerPhone || ""
            },
            items: items.map(item => ({

                productId: item.originalItem?.productId || item.id,
                variantId: item.originalItem?.variantId || item.variantId,
                name: item.name,
                quantity: item.qty,
                size: item.originalItem?.size || null,
                color: item.originalItem?.color || null,
                unitPrice: item.price,
                originalUnitPrice: item.originalItem?.unitPrice,
                discountPercent: item.originalItem?.discountPercent || 0,
                returnReason: finalReason
            })),
            totals: {
                subtotal: returnTotal,
                totalDiscount: items.reduce((acc, item) => {
                    const discount = item.originalItem?.discountPercent || 0;
                    return acc + (item.price * item.qty * discount) / 100;
                }, 0),
                grandTotal: returnTotal
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
            setReturnItems([]);
        } catch (err) {
            console.error("Failed to create return/exchange:", err);
            toast.error(err.response?.data?.error || "Failed to process return");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const statusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed": return "bg-green-100 text-green-700 border-green-200";
            case "returned": return "bg-red-100 text-red-700 border-red-200";
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "exchanged": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const filteredTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.timestamp);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // --- Date Filter ---
        let dateMatch = true;
        switch (filterByDate) {
            case "today":
                dateMatch = txnDate.toDateString() === today.toDateString();
                break;
            case "yesterday":
                dateMatch = txnDate.toDateString() === yesterday.toDateString();
                break;
            case "last7days":
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                dateMatch = txnDate >= sevenDaysAgo && txnDate <= today;
                break;
            default:
                dateMatch = true;
        }

        // --- Payment Method Filter ---
        let paymentMatch = true;
        if (filterByPayment === "cash") paymentMatch = txn.payment?.paymentMethod?.toLowerCase() === "cash";
        else if (filterByPayment === "card") paymentMatch = txn.payment?.paymentMethod?.toLowerCase() === "card";

        // --- Status Filter ---
        // --- Status Filter ---
        let statusMatch = true;
        if (filterByStatus !== "all") {
            const displayStatus = (txn.returnExchangeIds?.length > 0) ? "returned" : (txn.status?.toLowerCase() || "pending");
            statusMatch = displayStatus === filterByStatus.toLowerCase();
        }

        // --- Search Filter ---
        let searchMatch = true;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            searchMatch =
                txn.transactionNumber?.toLowerCase().includes(query) ||
                txn.customer?.customerFirstName?.toLowerCase().includes(query) ||
                txn.customer?.customerLastName?.toLowerCase().includes(query) ||
                txn.customer?.customerEmail?.toLowerCase().includes(query) ||
                formatDate(txn.timestamp).toLowerCase().includes(query);
        }

        return dateMatch && paymentMatch && statusMatch && searchMatch;
    });


    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    //-----------------exchage items funt-----------------
    const getNewExchangedItems = (transactionFullDetails) => {
        if (!transactionFullDetails) return [];

        const exchanges = transactionFullDetails.exchanges || [];
        const exchangeItems = transactionFullDetails.exchangeItems || [];

        // Map each exchange transaction to its new item(s)
        const newItems = exchanges.map((ex) => {
            // Find the new item(s) received for this exchange transaction
            const newItem = exchangeItems.find(
                (item) => item.exchangeTransactionId === ex._id
            ) || ex.items?.[0]; // fallback if exchangeItems missing

            if (!newItem) return null;

            const unitPrice = newItem.unitPrice || 0;
            const quantity = newItem.quantity || 0;
            const totalPrice = unitPrice * quantity;

            // Add the grand total from the exchange transaction into the item object
            const exchangeGrandTotal = ex.totals?.grandTotal || totalPrice;

            return {
                name: newItem.name,
                productId: newItem.productId,
                quantity: quantity,
                size: newItem.size || null,
                color: newItem.color || null,

                exchangeDate: newItem.exchangeDate || ex.createdAt,
                exchangedFrom: ex.items?.map(i => i.name).join(", ") || "N/A",
                total: exchangeGrandTotal
            };
        }).filter(Boolean);

        return newItems; // now each item contains its exchangeGrandTotal
    };
    const newItems = getNewExchangedItems(transactionFullDetails);

    //--------------return items funt--------------------
    const getReturnedItems = (transactionFullDetails) => {
        if (!transactionFullDetails) return [];

        const returns = transactionFullDetails.returns || [];

        const returnedItems = returns.flatMap((ret) => {
            const refundTotal = ret.totals?.grandTotal || 0;

            return (ret.items || []).map((item) => ({
                returnTransactionId: ret._id,
                returnTransactionNumber: ret.transactionNumber,
                name: item.name,
                productId: item.productId,
                quantity: item.quantity,
                size: item.size || null,
                color: item.color || null,
                unitPrice: item.unitPrice || 0,
                total: (item.unitPrice || 0) * (item.quantity || 0),
                refundAmount: refundTotal,
                reason: ret.reason,
                status: ret.status,
                returnDate: ret.createdAt
            }));
        });

        return returnedItems;
    };
    const returnedItems = getReturnedItems(transactionFullDetails);
    //------------updated totals funt --------------------

    const getUpdatedTransactionTotals = (transactionFullDetails) => {
        if (!transactionFullDetails?.updatedTotals) return null;

        const totals = transactionFullDetails.updatedTotals;

        return {
            subtotal: totals.subtotal || 0,
            originalGrandTotal: totals.originalGrandTotal || 0,
            returnedValue: totals.returnedValue || 0,
            refundTotal: totals.refundTotal || 0,
            exchangeValue: totals.exchangeValue || 0,
            additionalPaymentTotal: totals.additionalPaymentTotal || 0,
            grandTotal: totals.grandTotal || 0,
            netAmount: totals.netAmount || 0
        };
    };

    const updatedTotals = getUpdatedTransactionTotals(transactionFullDetails);



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

                onComplete={async (data) => {
                    try {
                        // Get the return item from selectedReturnItems
                        const returnItem = selectedReturnItems[0];

                        const payload = {
                            type: "exchange",
                            mode: "normal",
                            originalTransactionId: selectedTxn._id,
                            branch: data.branch || selectedTxn.branch,
                            customer: {
                                customerId: selectedTxn.customer?.customerId || selectedTxn.customer?._id,
                                customerFirstName: selectedTxn.customer?.customerFirstName || "Walk-in",
                                customerLastName: selectedTxn.customer?.customerLastName || "Customer",
                                customerEmail: selectedTxn.customer?.customerEmail || "",
                                customerPhone: selectedTxn.customer?.customerPhone || ""
                            },
                            // ✅ COMBINE BOTH ITEMS INTO ONE ARRAY
                            items: [
                                // Original item being returned (negative quantity or special flag)
                                {
                                    productId: returnItem.originalItem?.productId || returnItem.productId,
                                    variantId: returnItem.originalItem?.variantId || returnItem.variantId,
                                    name: returnItem.name,
                                    quantity: -returnItem.qty, // Negative for returned items
                                    size: returnItem.originalItem?.size,
                                    color: returnItem.originalItem?.color,
                                    unitPrice: returnItem.price,
                                    isOriginalItem: true,
                                    returnReason: returnItem.returnReason
                                },
                                // New item being exchanged
                                {
                                    productId: data.exchangeItem._id,
                                    variantId: data.exchangeItem.variantSelected._id,
                                    name: data.exchangeItem.productName,
                                    quantity: data.exchangeQuantity,
                                    size: data.exchangeItem.variantSelected.size,
                                    color: data.exchangeItem.variantSelected.color,
                                    unitPrice: data.exchangeItem.variantSelected.retailPrice || 0,
                                    isNewItem: true
                                }
                            ],
                            // Keep these for stock update logic if needed
                            originalItem: {
                                productId: returnItem.originalItem?.productId || returnItem.productId,
                                variantId: returnItem.originalItem?.variantId || returnItem.variantId,
                                name: returnItem.name,
                                quantity: returnItem.qty,
                                size: returnItem.originalItem?.size,
                                color: returnItem.originalItem?.color,
                                unitPrice: returnItem.price,
                                returnReason: returnItem.returnReason
                            },
                            newItem: {
                                productId: data.exchangeItem._id,
                                variantId: data.exchangeItem.variantSelected._id,
                                name: data.exchangeItem.productName,
                                quantity: data.exchangeQuantity,
                                size: data.exchangeItem.variantSelected.size,
                                color: data.exchangeItem.variantSelected.color,
                                unitPrice: data.exchangeItem.variantSelected.retailPrice || 0
                            },
                            totals: {
                                subtotal: data.exchangeTotal,
                                grandTotal: data.exchangeTotal
                            },
                            payment: data.payment,
                            notes: "Exchange processed via POS"
                        };

                       

                        await createReturnExchangeMutation.mutateAsync(payload);
                        toast.success("Exchange saved successfully!");
                        setSelectedReturnItems([]);
                        setView("list");
                    } catch (err) {
                        console.error("Failed to save exchange:", err);
                        toast.error(err.response?.data?.error || "Failed to process exchange");
                    }
                }}
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
                newItems={newItems}
                updatedTotals={updatedTotals}
                returnedItems={returnedItems}

            />
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-0">
          
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
                 
                    <div className="hidden lg:block relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            placeholder="Search by transaction, customer or date..."
                            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-80 bg-card outline-none focus:ring-1 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="hidden lg:flex gap-2 items-center">
                        {/* Date Filter */}
                        <select
                            
                            value={filterByDate}
                            onChange={(e) => { setFilterByDate(e.target.value); setCurrentPage(1); }}
                            className="border rounded-lg px-3 py-2 text-sm bg-card"
                        >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last7days">Last 7 Days</option>
                        </select>

                        {/* Payment Method Filter */}
                        <select
                            value={filterByPayment}
                            onChange={(e) => { setFilterByPayment(e.target.value); setCurrentPage(1); }}
                            className="border rounded-lg px-3 py-2 text-sm bg-card"
                        >
                            <option value="all">All Payment Methods</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterByStatus}
                            onChange={(e) => { setFilterByStatus(e.target.value); setCurrentPage(1); }}
                            className="border rounded-lg px-3 py-2 text-sm bg-card"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="returned">Returned</option>
                          
                        </select>
                    </div>

                </div>
            </div>
            {/* Mobile Search + Filter Button */}
            <div className="lg:hidden flex flex-col gap-2 mb-4">
                <div className="flex gap-2">
                    {/* Filter Button */}
                    <button
                        onClick={() => setShowMobileFilter(true)}
                        className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm bg-card"
                    >
                        <Filter size={16} /> Filter
                    </button>

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            placeholder="Search transactions..."
                            className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm bg-card outline-none focus:ring-1 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <MobileFilterDrawer show={showMobileFilter} onClose={() => setShowMobileFilter(false)}>
                <div className="flex flex-col gap-4 p-4">
                    {/* Date Filter */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Date</label>
                        <select
                            value={filterByDate}
                            onChange={(e) => { setFilterByDate(e.target.value); setCurrentPage(1); }}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last7days">Last 7 Days</option>
                        </select>
                    </div>

                    {/* Payment Method Filter */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Payment Method</label>
                        <select
                            value={filterByPayment}
                            onChange={(e) => { setFilterByPayment(e.target.value); setCurrentPage(1); }}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">All Payment Methods</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Status</label>
                        <select
                            value={filterByStatus}
                            onChange={(e) => { setFilterByStatus(e.target.value); setCurrentPage(1); }}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>
                </div>
            </MobileFilterDrawer>

            {/* Mobile Filter Drawer */}
       
            <Card className="p-4">
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
                         transactions={paginatedTransactions}
                        onViewReceipt={handleViewReceipt}
                        onViewReturn={handleViewReturn}
                        formatDate={formatDate}
                            statusColor={statusColor}
                            settings={settings}
                    />
                )}

            </Card>

            <div className="flex justify-end gap-2 mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ReturnsExchangesPage;
