import { TransactionProvider, useTransaction } from '@/context/TransactionContext';
import { Stepper } from '@/components/pos/transaction/Stepper';
import { ProductEntry } from '@/components/pos/transaction/ProductEntry';
import { ShoppingCart } from '@/components/pos/transaction/ShoppingCart';
import { TransactionTotals } from '@/components/pos/transaction/TransactionTotals';
import { QuickActions } from '@/components/pos/transaction/QuickActions';
import { Actions } from '@/components/pos/transaction/Actions';

function POSContent() {
    const { currentStep, setCurrentStep, transactionNumber } = useTransaction();

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

            <header className="sticky top-0 z-50 bg-white shadow-sm rounded-md border-b mb-4 sm:mb-6">
                <div className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <Stepper currentStep={currentStep} onStepClick={setCurrentStep} />
                </div>
            </header>

            {/* Main Content - Mobile First Grid */}
            <main className="max-w-full mx-auto pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Step Content - Takes full width on mobile, 2/3 on desktop */}
                <div className="lg:col-span-2 order-1">
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        {renderStep()}
                    </div>
                </div>

                {/* Quick Info / Actions Sidebar - New row on mobile, side column on desktop */}
                <aside className="lg:col-span-1 order-2 flex flex-col gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg shadow p-4 sm:p-4">
                        <h3 className="text-sm font-semibold mb-3 text-gray-700 sm:hidden">Quick Actions</h3>
                        <QuickActions />
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