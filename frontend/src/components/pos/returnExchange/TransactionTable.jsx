import React from "react";
import { Eye, Edit } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
const TransactionTable = ({
    transactions,
    onViewReceipt,
    onViewReturn,
    formatDate,
    statusColor,
   
}) => {

    const { data: settings } = useSettings();
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
                                    {settings?.currencySymbol }{txn.totals?.grandTotal?.toFixed(2)}
                                </td>

                                <td className="px-4 py-3 text-sm capitalize">
                                    {txn.payment?.paymentMethod || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {(() => {
                                        const displayStatus = (txn.returnExchangeIds?.length > 0) ? "returned" : (txn.status || "pending");
                                        return (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor(displayStatus)}`}>
                                                {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)} {/* Capitalize first letter */}
                                            </span>
                                        );
                                    })()}
                                </td>
                             
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        {/* <button
                                            onClick={() => onViewReceipt(txn)}
                                            className="p-1.5 rounded hover:bg-muted"
                                            title="View Receipt"
                                        >
                                            <Eye size={14} />
                                        </button> */}
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