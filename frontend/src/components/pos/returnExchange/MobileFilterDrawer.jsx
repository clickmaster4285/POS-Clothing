import React from "react";
import { X } from "lucide-react";

const MobileFilterDrawer = ({ show, onClose }) => {
    return (
        <div className={`fixed inset-0 z-50 lg:hidden ${show ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-xl p-6 animate-in slide-in-from-bottom">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Filter Transactions</h3>
                    <button onClick={onClose} className="p-2">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm bg-card">
                            <option>All Status</option>
                            <option>completed</option>
                            <option>refunded</option>
                            <option>pending</option>
                            <option>exchanged</option>
                        </select>
                    </div>
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
};

export default MobileFilterDrawer;