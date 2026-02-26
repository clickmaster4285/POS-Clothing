// pages/pos/transaction.tsx
import { TransactionProvider, useTransaction } from '@/context/TransactionContext';
import { Stepper } from '@/components/pos/transaction/Stepper';
import { ProductEntry } from '@/components/pos/transaction/ProductEntry';
import { ShoppingCart } from '@/components/pos/transaction/ShoppingCart';
import { TransactionTotals } from '@/components/pos/transaction/TransactionTotals';
import { QuickActions } from '@/components/pos/transaction/QuickActions';
import { Actions } from '@/components/pos/transaction/Actions';
import { Receipt } from '@/components/pos/transaction/Receipt';
import { useAuth } from "@/hooks/useAuth"
import { useBranches } from "@/hooks/useBranches";
import { useState, useEffect } from 'react';

function POSContent() {
    const {
        currentStep,
        setCurrentStep,
        transactionNumber,
        selectedBranch,
        setSelectedBranch,
        cartItems,
        totals
    } = useTransaction();

    const { data: branches, isLoading } = useBranches();
    const { user: currentUser } = useAuth();

    // Check if cart has items
    const hasCartItems = cartItems?.length > 0;

 

    return (
        <div className=" bg-gray-50 px-4 sm:px-6 lg:px-8">
            {/* Header - Mobile Responsive */}
          

            {/* Main Content - New Layout */}
            <main className="max-w-full mx-auto pb-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-4">
                {/* Left Column - 8/12 (66.67%) - All Main Content */}
                <div className="lg:col-span-8 space-y-2 sm:space-y-3">
                    {/* Branch Selection (Admin only) */}

                    
                    {currentUser?.role === "admin" && branches?.data?.length > 0 && (
                        <div className="bg-card p-4 rounded-md shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Branch
                            </label>
                            <div className="relative max-w-md">
                                <select
                                    className="appearance-none w-full border border-gray-300 bg-white rounded-lg shadow-sm px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    value={selectedBranch?._id || ""}
                                    onChange={(e) => {
                                        const branch = branches.data.find(b => b._id === e.target.value);
                                        setSelectedBranch(branch);
                                    }}
                                >
                                    <option value="">-- Select Branch --</option>
                                    {branches.data.map(branch => (
                                        <option key={branch._id} value={branch._id}>
                                            {branch.branch_name} ({branch.address.city})
                                        </option>
                                    ))}
                                </select>
                                {/* Down arrow icon */}
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Entry */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <ProductEntry />
                   
                        <ShoppingCart />
                      
                    </div>

                    {/* Transaction Totals */}
                    {/* <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <TransactionTotals />
                    </div> */}
                </div>

                {/* Right Column - 4/12 (33.33%) - Quick Actions and Receipt */}
                <aside className="lg:col-span-4 space-y-4 sm:space-y-3">
                    {/* Quick Actions - At the top of right column */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <QuickActions />
                    </div>

                    {/* Receipt - Below Quick Actions */}
                    <div className=" sticky top-4">
                        <Receipt />
                        {hasCartItems && (
                            <div className='mt-3'>
                                <Actions />
                            </div>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
}

const TransactionPage = () => (
    <TransactionProvider>
        <POSContent />
    </TransactionProvider>
);

export default TransactionPage;