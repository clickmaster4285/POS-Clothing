import React from "react";
import { Eye, Edit } from "lucide-react";
import TransactionCard from "./TransactionCard";
import TransactionTable from "./TransactionTable";

const TransactionList = ({
    transactions,
    onViewReceipt,
    onViewReturn,
    formatDate,
    statusColor,
      
}) => {
    return (
        <>
            {/* Mobile Transaction Cards */}
            <div className="lg:hidden">
                {transactions.map((txn) => (
                    <TransactionCard
                        key={txn._id}
                        txn={txn}
                        onViewReceipt={onViewReceipt}
                        onViewReturn={onViewReturn}
                        formatDate={formatDate}
                        statusColor={statusColor}
                     
                    />
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-card rounded-lg border overflow-hidden">
                <TransactionTable
                    transactions={transactions}
                    onViewReceipt={onViewReceipt}
                    onViewReturn={onViewReturn}
                    formatDate={formatDate}
                    statusColor={statusColor}
                 
                />
            </div>

         
        </>
    );
};

export default TransactionList;