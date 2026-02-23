import React from "react";
import { X } from "lucide-react";

const MobileFilterDrawer = ({ show, onClose, children }) => {
    return (
        <div className={`fixed inset-0 z-50 lg:hidden ${show ? 'block' : 'hidden'}`}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-xl p-6 animate-in slide-in-from-bottom">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Filter Transactions</h3>
                    <button onClick={onClose} className="p-2">
                        <X size={20} />
                    </button>
                </div>

                {/* Render passed children */}
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MobileFilterDrawer;