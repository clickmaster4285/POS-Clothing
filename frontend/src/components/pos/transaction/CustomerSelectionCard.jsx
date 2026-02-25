import { useState, useEffect } from 'react';
import { User, Award, Plus, Coins, Tag } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import CustomerModal from './dialogs/CustomerModal';

export function CustomerSelectionCard({
    customers,
    setCustomers,
    selectedCustomer,
    setSelectedCustomer,
    redeemPoints,
    setRedeemPoints,
    effectiveLoyaltyDiscount,
    handleRedeemPoints
}) {
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

    // Default "Walk-in" customer
    useEffect(() => {
        if (!selectedCustomer) {
            setSelectedCustomer({ _id: '', firstName: 'Walk-in', lastName: 'Customer', loyaltyPoints: 0 });
        }
    }, [selectedCustomer, setSelectedCustomer]);

    const formatPoints = (value) => {
        const num = Number(value);
        return isNaN(num) ? '0' : Math.floor(num).toString();
    };

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        const customer = customers.find(c => c._id === customerId);
        if (customer) {
            setSelectedCustomer(customer);
        } else {
            // Reset to Walk-in
            setSelectedCustomer({ _id: '', firstName: 'Walk-in', lastName: 'Customer', loyaltyPoints: 0 });
        }
        setRedeemPoints(false);
    };

    const handleNewCustomerAdded = (newCustomer) => {
        setCustomers(prev => [...prev, newCustomer]);
        setSelectedCustomer(newCustomer);
        setShowAddCustomerModal(false);
    };

    const hasMinimumPoints = selectedCustomer?._id && Number(selectedCustomer.loyaltyPoints) >= 100;

    return (
        <>
            <div className="space-y-3">
                {/* Header - Matching coupon section style */}
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Select Customer (Optional)</label>
                </div>

                {/* Main Content - All in one row */}
                <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
                    {/* Customer Selector */}
                    <div className="flex items-center gap-1 min-w-[200px] flex-1">
                        <select
                            value={selectedCustomer?._id || ''}
                            onChange={handleCustomerChange}
                            className="flex-1 border rounded-md px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary truncate"
                        >
                            <option value="">Walk-in Customer</option>
                            {customers.map(customer => (
                                <option key={customer._id} value={customer._id}>
                                    {`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unnamed Customer'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Add Customer Button */}
                    <button
                        onClick={() => setShowAddCustomerModal(true)}
                        className="shrink-0 p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        title="Add new customer"
                    >
                        <Plus size={16} />
                    </button>

                    {/* Loyalty Info - Only for registered customers */}
                    {selectedCustomer?._id && (
                        <div className="flex items-center gap-2 shrink-0 bg-muted/30 px-2 py-1 rounded-md">
                            {/* Points */}
                            <div className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-medium whitespace-nowrap">
                                    {formatPoints(selectedCustomer.loyaltyPoints)} pts
                                </span>
                            </div>

                            {/* Redeem Option or Points Needed */}
                            {hasMinimumPoints ? (
                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center gap-1">
                                        <Checkbox
                                            id="redeem-points"
                                            checked={redeemPoints}
                                            onCheckedChange={handleRedeemPoints}
                                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <label
                                            htmlFor="redeem-points"
                                            className="text-xs cursor-pointer font-medium whitespace-nowrap"
                                        >
                                            Redeem
                                        </label>
                                    </div>
                                    {redeemPoints && effectiveLoyaltyDiscount > 0 && (
                                        <span className="text-xs font-bold text-primary whitespace-nowrap">
                                            -{effectiveLoyaltyDiscount.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                selectedCustomer.loyaltyPoints > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Coins className="w-3.5 h-3.5" />
                                        <span className="whitespace-nowrap">Need 100</span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showAddCustomerModal && (
                <CustomerModal
                    isModal={true}
                    onCustomerAdded={handleNewCustomerAdded}
                    onClose={() => setShowAddCustomerModal(false)}
                />
            )}
        </>
    );
}