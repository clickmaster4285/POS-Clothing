import React from "react";
import { ArrowLeft, FileText, Send, QrCode } from "lucide-react";

const ReceiptView = ({ selectedTxn, onBack, formatDate, statusColor }) => {
    const customerName = selectedTxn.customer
        ? `${selectedTxn.customer.customerFirstName || ''} ${selectedTxn.customer.customerLastName || ''}`.trim()
        : 'Walk-in Customer';

    return (
        <div className="px-4 sm:px-6 lg:px-0">
            {/* Breadcrumbs */}
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1 overflow-x-auto whitespace-nowrap pb-2">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Receipt Management</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg sm:text-xl font-bold">Receipt Information</h1>
            </div>

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
                                ${selectedTxn.totals?.grandTotal?.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col xs:flex-row gap-3">
                        <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm hover:opacity-90 flex-1 sm:flex-none">
                            <FileText size={14} /> Export PDF
                        </button>
                        <button className="flex items-center justify-center gap-2 border px-4 py-2.5 rounded-lg text-sm hover:bg-muted flex-1 sm:flex-none">
                            <Send size={14} /> Resend
                        </button>
                    </div>
                </div>

                {/* Receipt Preview Card */}
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                    <h3 className="font-semibold mb-4">Receipt Preview</h3>
                    <div className="bg-muted/50 rounded-lg p-4 sm:p-6 text-center">
                        <p className="font-bold text-sm sm:text-base mb-2">TechStore Plus</p>
                        <p className="text-xs text-muted-foreground mb-4">Thank you for shopping with us!</p>
                        <div className="text-xs sm:text-sm text-left space-y-2 mb-4">
                            {selectedTxn.cartItems?.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-2 flex justify-between font-bold">
                                <span>Total</span>
                                <span>${selectedTxn.totals?.grandTotal?.toFixed(2)}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Payment: {selectedTxn.payment?.paymentMethod}
                            {selectedTxn.payment?.paymentMethod === 'cash' &&
                                ` - Change: $${selectedTxn.payment?.changeDue?.toFixed(2)}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Receipt Delivery Methods */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse xs:flex-row justify-end gap-3 mt-6">
                <button
                    onClick={onBack}
                    className="px-4 py-2.5 border rounded-lg text-sm hover:bg-muted w-full xs:w-auto"
                >
                    Back
                </button>
                <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 w-full xs:w-auto">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ReceiptView;