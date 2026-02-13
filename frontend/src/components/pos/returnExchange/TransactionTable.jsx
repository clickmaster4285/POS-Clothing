import React from "react";
import { Eye, Edit } from "lucide-react";

const TransactionTable = ({
    transactions,
    onViewReceipt,
    onViewReturn,
    formatDate,
    statusColor
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction no #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">DATE</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">CUSTOMER</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ITEMS</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">TOTAL</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PAYMENT</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">STATUS</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">LOYALTY</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ACTIONS</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {transactions.map((txn) => {
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
                                    ${txn.totals?.grandTotal?.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-sm capitalize">
                                    {txn.payment?.paymentMethod || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor(txn.status)}`}>
                                        {txn.status || 'Pending'}
                                    </span>
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
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onViewReceipt(txn)}
                                            className="p-1.5 rounded hover:bg-muted"
                                            title="View Receipt"
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            onClick={() => onViewReturn(txn)}
                                            className="p-1.5 rounded hover:bg-muted"
                                            title="Return/Exchange"
                                        >
                                            <Edit size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;