import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye, Search, ChevronDown, ArrowLeft, FileText, Send,
    Printer, QrCode, Check, X, Plus, Minus, Filter, Download
} from "lucide-react";
import {
    useTransactions
} from "@/hooks/pos_hooks/useTransaction";
import ReceiptPrinter from "./ReceiptPrinter"; // Add this import
import { Card } from "@/components/ui/card";
import { useSettings } from "@/hooks/useSettings";

const ReciptManagementPage = () => {
    const [view, setView] = useState("list");
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showReceiptPrinter, setShowReceiptPrinter] = useState(false); // Add this

    // Filter state
    const [filterByDate, setFilterByDate] = useState("all"); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 
    // Payment method filter state
    const [filterByPayment, setFilterByPayment] = useState("all"); // "all", "cash", "card"

    const { data: settings } = useSettings();
  
 
    const { data: transactionData, isLoading } = useTransactions();

    // Get transactions array from the data and filter only completed transactions
    const allTransactions = transactionData?.transactions || [];
    const transactions = allTransactions.filter(txn =>
        txn.status?.toLowerCase() === "completed"
    );

  

    // Initialize selectedTxn with first transaction once data is loaded
    useState(() => {
        if (transactions.length > 0 && !selectedTxn) {
            setSelectedTxn(transactions[0]);
        }
    }, [transactions]);

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

    // Filter transactions based on search query
    const filteredTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.timestamp);

        // --- Date Filter ---
        const today = new Date();
        let dateMatch = true;
        if (filterByDate === "today") {
            dateMatch = txnDate.toDateString() === today.toDateString();
        } else if (filterByDate === "last7days") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            dateMatch = txnDate >= sevenDaysAgo && txnDate <= today;
        } else if (filterByDate === "last30days") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            dateMatch = txnDate >= thirtyDaysAgo && txnDate <= today;
        }

        // --- Payment Method Filter ---
        let paymentMatch = true;
        if (filterByPayment === "cash") {
            paymentMatch = txn.payment?.paymentMethod?.toLowerCase() === "cash";
        } else if (filterByPayment === "card") {
            paymentMatch = txn.payment?.paymentMethod?.toLowerCase() === "card";
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

        return dateMatch && paymentMatch && searchMatch;
    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle print receipt
    const handlePrintReceipt = (txn) => {
        setSelectedTxn(txn);
        setShowReceiptPrinter(true);
    };

    // Mobile filter drawer
    const MobileFilterDrawer = () => (
        <div className={`fixed inset-0 z-50 lg:hidden ${showMobileFilter ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-xl p-6 animate-in slide-in-from-bottom">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Filter Transactions</h3>
                    <button onClick={() => setShowMobileFilter(false)} className="p-2">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Date Range</label>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm bg-card">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>This month</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    // Mobile transaction card view
    const TransactionCard = ({ txn }) => {
        const customerName = txn.customer
            ? `${txn.customer.customerFirstName || ''} ${txn.customer.customerLastName || ''}`.trim()
            : 'Walk-in Customer';

        return (
            <div className="bg-card border rounded-lg p-4 mb-3 lg:hidden">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <p className="font-mono text-xs text-muted-foreground">RECEIPT #</p>
                        <p className="font-medium text-sm break-all">{txn.transactionNumber || 'N/A'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor(txn.status)}`}>
                        {txn.status || 'Pending'}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm">{formatDate(txn.timestamp)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="text-sm truncate">{customerName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="text-sm">{txn.cartItems?.length || 0} items</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Payment</p>
                        <p className="text-sm capitalize">{txn.payment?.paymentMethod || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-base font-bold text-primary">
                            {settings?.currencySymbol || '$'}{txn.totals?.grandTotal?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <button
                        onClick={() => { setSelectedTxn(txn); setView("receipt"); }}
                        className="p-2 bg-primary/10 text-primary rounded-lg"
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading transactions...</p>
                </div>
            </div>
        );
    }

    // Receipt View
    if (view === "receipt" && selectedTxn) {
        const customerName = selectedTxn.customer
            ? `${selectedTxn.customer.customerFirstName || ''} ${selectedTxn.customer.customerLastName || ''}`.trim()
            : 'Walk-in Customer';

        return (
            <div className="px-4 sm:px-6 lg:px-0">
                <MobileFilterDrawer />

                {/* Breadcrumbs */}
                <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1 overflow-x-auto whitespace-nowrap pb-2">
                    <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                    <span className="text-primary font-medium">Receipt Management</span>
                </div>
                

               

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setView("list")} className="p-2 rounded-lg hover:bg-muted">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg sm:text-xl font-bold">Receipt Information</h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Transaction Details Card */}
                    <div className="bg-card rounded-lg border p-4 sm:p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-sm mb-6">
                            <div>
                                <span className="text-xs text-muted-foreground">Transaction #:</span>
                                <p className="font-medium text-sm break-all">{selectedTxn.transactionNumber}</p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Status:</span>
                                <p className="mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor(selectedTxn.status)}`}>
                                        {selectedTxn.status}
                                    </span>
                                </p>
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
                                <span className="text-xs text-muted-foreground">Total:</span>
                                <p className="text-base font-bold text-primary">
                                    {settings?.currencySymbol || '$'}{selectedTxn.totals?.grandTotal?.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3 text-sm">Items</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {selectedTxn.cartItems?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded-lg text-sm">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                             Size: {item.size || 'N/A'} | Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-medium">{settings?.currencySymbol || '$'}{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons - Updated to use ReceiptPrinter */}
                        <div className="flex flex-col xs:flex-row gap-3">
                            {/* <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm hover:opacity-90 flex-1 sm:flex-none">
                                <FileText size={14} /> Export PDF
                            </button>
                            <button className="flex items-center justify-center gap-2 border px-4 py-2.5 rounded-lg text-sm hover:bg-muted flex-1 sm:flex-none">
                                <Send size={14} /> Resend
                            </button> */}
                            <button
                                onClick={() => setShowReceiptPrinter(true)}
                                className="flex items-center justify-center gap-2 border px-4 py-2.5 rounded-lg text-sm hover:bg-muted flex-1 sm:flex-none"
                            >
                                <Printer size={14} /> Print
                            </button>
                        </div>
                    </div>

                    {/* Receipt Preview Card */}
                    <div className="bg-card rounded-lg border p-4 sm:p-6">
                        <h3 className="font-semibold mb-4">Receipt Preview</h3>
                        <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
                            <div className="text-center mb-4">
                                <p className="font-bold text-sm sm:text-base mb-1">{settings?.companyName || "STORE"}</p>
                                <p className="text-xs text-muted-foreground">{settings?.address}</p>
                                <p className="text-xs text-muted-foreground">Tel: {settings?.phone}</p>
                            </div>

                            <div className="border-t border-b py-2 mb-3 text-xs">
                                <div className="flex justify-between">
                                    <span>Receipt #: {selectedTxn.transactionNumber?.slice(-8)}</span>
                                    <span>{formatDate(selectedTxn.timestamp)}</span>
                                </div>
                            </div>

                            <div className="text-xs sm:text-sm space-y-2 mb-4">
                                {/* Header with 4 columns */}
                                <div className="flex justify-between font-medium border-b pb-1">
                                    <span className="w-[40%]">Item</span>
                                    <span className="w-[15%] text-center">Qty</span>
                                    <span className="w-[20%] text-center">Disc%</span>
                                    <span className="w-[25%] text-right">Price</span>
                                </div>

                                {/* Items */}
                                {selectedTxn.cartItems?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                        <span className="w-[40%] truncate">{item.name}</span>
                                        <span className="w-[15%] text-center">{item.quantity}</span>
                                        <span className="w-[20%] text-center">{item.discountPercent || 0}%</span>
                                        <span className="w-[25%] text-right">{settings?.currencySymbol || '$'}{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}

                                {/* Totals Section */}
                                <div className="border-t pt-2 mt-2 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{settings?.currencySymbol || '$'}{selectedTxn.totals?.subtotal?.toFixed(2)}</span>
                                    </div>
                                    {selectedTxn.totals?.totalDiscount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-{settings?.currencySymbol || '$'}{selectedTxn.totals?.totalDiscount?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>{settings?.currencySymbol || '$'}{selectedTxn.totals?.totalTax?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-1 border-t">
                                        <span>Total</span>
                                        <span>{settings?.currencySymbol || '$'}{selectedTxn.totals?.grandTotal?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-2">
                                    Payment: {selectedTxn.payment?.paymentMethod?.toUpperCase()}{" "}
                                    {selectedTxn.payment?.paymentMethod === 'cash' &&
                                        `Change: ${settings?.currencySymbol || '$'}${selectedTxn.payment?.changeDue?.toFixed(2)}`}
                                </p>
                                {selectedTxn.loyalty?.pointsEarned > 0 && (
                                    <p className="text-xs text-primary">
                                        Points Earned: {selectedTxn.loyalty.pointsEarned}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">Thank you for shopping with us!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Receipt Delivery Methods */}
                {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-card rounded-lg border p-4">
                        <h4 className="text-sm font-semibold mb-2">Email Receipt</h4>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Ready to send</span>
                            <span className="text-xs text-muted-foreground truncate">
                                {selectedTxn.customer?.customerEmail || 'No email provided'}
                            </span>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <h4 className="text-sm font-semibold mb-2">SMS Receipt</h4>
                        <button className="text-sm text-primary hover:underline">Send SMS</button>
                    </div>
                    <div className="bg-card rounded-lg border p-4 sm:col-span-2 lg:col-span-1">
                        <h4 className="text-sm font-semibold mb-2">Digital Receipt QR</h4>
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center mx-auto">
                            <QrCode size={32} className="text-muted-foreground" />
                        </div>
                    </div>
                </div> */}

                {/* Back Button */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setView("list")}
                        className="px-6 py-2.5 border rounded-lg text-sm hover:bg-muted"
                    >
                        Back to Receipts
                    </button>
                </div>

                {/* Receipt Printer Modal */}
                <ReceiptPrinter
                    transaction={selectedTxn}
                    open={showReceiptPrinter}
                    onClose={() => setShowReceiptPrinter(false)}
                />
            </div>
        );
    }

    // Main List View
    return (
        <div className="px-4 sm:px-6 lg:px-0">
            <MobileFilterDrawer />

            {/* Breadcrumbs */}
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1 overflow-x-auto whitespace-nowrap pb-2">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Receipt Management</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Receipt Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View and manage completed transaction receipts
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex gap-2 items-center">
                        <select
                            value={filterByDate}
                            onChange={(e) => { setFilterByDate(e.target.value); setCurrentPage(1); }}
                            className="border rounded-lg px-3 py-2 text-sm bg-card"
                        >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="last7days">Last 7 Days</option>
                            <option value="last30days">Last 30 Days</option>
                        </select>
                    </div>
                    <div className="flex gap-2 items-center">
                        <select
                            value={filterByPayment}
                            onChange={(e) => { setFilterByPayment(e.target.value); setCurrentPage(1); }}
                            className="border rounded-lg px-3 py-2 text-sm bg-card"
                        >
                            <option value="all">All Payment Methods</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                        </select>
                    </div>


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

            {/* Mobile Search Bar */}
            <div className="lg:hidden relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    placeholder="Search receipts..."
                    className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm bg-card outline-none focus:ring-1 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
<Card className="p-6">
            {/* Transaction Count */}
            <div className="mb-4">
                <h3 className="font-semibold text-base sm:text-lg">Completed Transactions</h3>
                <p className="text-sm text-muted-foreground">
                    {filteredTransactions.length} receipt{filteredTransactions.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="bg-card rounded-lg border p-12 text-center">
                    <div className="flex justify-center mb-4">
                        <FileText size={48} className="text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No receipts found</h3>
                    <p className="text-muted-foreground text-sm">
                        {searchQuery
                            ? 'Try adjusting your search query'
                            : 'No completed transactions available'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile Transaction Cards */}
                    <div className="lg:hidden">
                                {paginatedTransactions.map((txn) => (
                            <TransactionCard key={txn._id} txn={txn} />
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block bg-card rounded-lg border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">RECEIPT #</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">DATE</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">CUSTOMER</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ITEMS</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">TOTAL</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PAYMENT</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">LOYALTY</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {paginatedTransactions.map((txn) => {
                                        const customerName = txn.customer
                                            ? `${txn.customer.customerFirstName || ''} ${txn.customer.customerLastName || ''}`.trim()
                                            : 'Walk-in Customer';

                                        return (
                                            <tr key={txn._id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-mono text-sm">{txn.transactionNumber || 'N/A'}</td>
                                                <td className="px-4 py-3 text-sm">{formatDate(txn.timestamp)}</td>
                                                <td className="px-4 py-3 text-sm max-w-[150px] truncate" title={customerName}>
                                                    {customerName}
                                                </td>
                                                <td className="px-4 py-3 text-sm">{txn.cartItems?.length || 0}</td>
                                                <td className="px-4 py-3 text-sm font-medium">
                                                    {settings?.currencySymbol || '$'}{txn.totals?.grandTotal?.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm capitalize">
                                                    {txn.payment?.paymentMethod || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {txn.loyalty?.pointsEarned ? (
                                                        <span className="text-xs">
                                                            +{txn.loyalty.pointsEarned} pts
                                                            {txn.loyalty.pointsRedeemed > 0 &&
                                                                ` / -${txn.loyalty.pointsRedeemed} pts`}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => { setSelectedTxn(txn); setView("receipt"); }}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={14} />
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handlePrintReceipt(txn)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs hover:bg-muted/80 transition-colors"
                                                            title="Print Receipt"
                                                        >
                                                            <Printer size={14} />
                                                            Print
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            </Card>

            <div className="flex justify-between items-center mt-4 text-sm">
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* Receipt Printer Modal */}
            <ReceiptPrinter
                transaction={selectedTxn}
                open={showReceiptPrinter}
                onClose={() => setShowReceiptPrinter(false)}
            />
        </div>
    );
};

export default ReciptManagementPage;