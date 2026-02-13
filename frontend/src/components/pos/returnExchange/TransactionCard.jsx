import React from "react";
import { Eye, Edit } from "lucide-react";

const TransactionCard = ({
    txn,
    onViewReceipt,
    onViewReturn,
    formatDate,
    statusColor
}) => {
    const customerName = txn.customer
        ? `${txn.customer.customerFirstName || ''} ${txn.customer.customerLastName || ''}`.trim()
        : 'Walk-in Customer';

    return (
        <div className="bg-card border rounded-lg p-4 mb-3">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <p className="font-mono text-xs text-muted-foreground">Transaction no #</p>
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
                        ${txn.totals?.grandTotal?.toFixed(2) || '0.00'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onViewReceipt(txn)}
                        className="p-2 bg-primary/10 text-primary rounded-lg"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onViewReturn(txn)}
                        className="p-2 bg-primary text-card rounded-lg"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;