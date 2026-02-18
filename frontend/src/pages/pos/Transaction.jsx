import { TransactionProvider, useTransaction } from '@/context/TransactionContext';
import { Stepper } from '@/components/pos/transaction/Stepper';
import { ProductEntry } from '@/components/pos/transaction/ProductEntry';
import { ShoppingCart } from '@/components/pos/transaction/ShoppingCart';
import { TransactionTotals } from '@/components/pos/transaction/TransactionTotals';
import { QuickActions } from '@/components/pos/transaction/QuickActions';

import { CartQuickActions } from '@/components/pos/transaction/CartQuickActions';

import { Actions } from '@/components/pos/transaction/Actions';
import { useAuth } from "@/hooks/useAuth"
import {
    useBranches,
} from "@/hooks/useBranches";
import { useState } from 'react';

function POSContent() {
    const { currentStep, setCurrentStep, transactionNumber, selectedBranch, setSelectedBranch, addToCart } = useTransaction();
   

    const { data: branches, isLoading } = useBranches();
   

    const { user: currentUser, role } = useAuth();
   

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <ProductEntry />;
            case 1: return <ShoppingCart />;
            case 2: return <TransactionTotals />;
            case 3: return <Actions />;
            default: return <ProductEntry />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
            {/* Header - Mobile Responsive */}
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground gap-1 pb-4 pt-4 sm:pb-5 overflow-x-auto whitespace-nowrap">
                <span>Home</span><span>›</span>
                <span>Point of Sale</span><span>›</span>
                <span className="font-medium">POS Transaction</span><span>›</span>
                <span className="text-primary font-medium truncate">{transactionNumber}</span>
            </div>

            <header className=" bg-white shadow-sm rounded-md border-b mb-4 sm:mb-6">
                <div className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <Stepper currentStep={currentStep} onStepClick={setCurrentStep} />
                </div>
            </header>

            {/* Main Content - Mobile First Grid */}
            <main className="max-w-full mx-auto pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Step Content - Takes full width on mobile, 2/3 on desktop */}
                <div className="lg:col-span-2 order-1">
                    {currentUser.role === "admin" && branches?.data?.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Branch
                            </label>
                            <div className="relative">
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


                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        {renderStep()}
                    </div>
                </div>

                {/* Quick Info / Actions Sidebar - New row on mobile, side column on desktop */}
                <aside className="lg:col-span-1 order-2 flex flex-col gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg shadow p-4 sm:p-4">
                        <h3 className="text-sm font-semibold mb-3 text-gray-700 sm:hidden">Quick Actions</h3>
                        <QuickActions />
                        <CartQuickActions
                            onAddToCart={() => setCurrentStep(0)}
                            className="justify-between"
                        />
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