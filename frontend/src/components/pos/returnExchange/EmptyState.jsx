import React from "react";
import { FileText } from "lucide-react";

const EmptyState = ({ searchQuery }) => {
    return (
        <div className="bg-card rounded-lg border p-12 text-center">
            <div className="flex justify-center mb-4">
                <FileText size={48} className="text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium mb-2">No transactions found</h3>
            <p className="text-muted-foreground text-sm">
                {searchQuery ? 'Try adjusting your search query' : 'No transaction data available'}
            </p>
        </div>
    );
};

export default EmptyState;