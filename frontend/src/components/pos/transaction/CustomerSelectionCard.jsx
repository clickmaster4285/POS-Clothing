import { useState, useEffect } from 'react';
import { User, Award, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

    return (
        <>
            <Card className="overflow-hidden">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Select Customer (Optional)</label>
                    </div>

                    <div className="flex gap-2 items-center">
                        <select
                            value={selectedCustomer?._id || ''}
                            onChange={handleCustomerChange}
                            className="w-full md:w-72 border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Walk-in Customer</option>
                            {customers.map(customer => (
                                <option key={customer._id} value={customer._id}>
                                    {`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unnamed Customer'}
                                </option>
                            ))}
                        </select>

                     
                      <button
                            onClick={() => setShowAddCustomerModal(true)}
                            className="px-2 py-2 bg-primary text-white rounded-md flex items-center gap-1 text-sm"
                        >
                            <Plus size={14} /> Add Customer
                        </button>

                        {showAddCustomerModal && (
                            <CustomerModal
                                isModal={true}
                                onCustomerAdded={handleNewCustomerAdded}
                                onClose={() => setShowAddCustomerModal(false)}
                            />
                        )}

                    </div>

                 {selectedCustomer && selectedCustomer._id && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-md border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">Loyalty Points</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-primary">{formatPoints(selectedCustomer.loyaltyPoints)}</span>
                                    <span className="text-xs text-muted-foreground ml-1">points</span>
                                </div>
                            </div>

                            {Number(selectedCustomer.loyaltyPoints) >= 100 ? (
                                <div className="mt-3 pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="redeem-points"
                                                checked={redeemPoints}
                                                onCheckedChange={handleRedeemPoints}
                                            />
                                            <label htmlFor="redeem-points" className="text-sm cursor-pointer font-medium">
                                                Redeem points for discount
                                            </label>
                                        </div>
                                        {redeemPoints && effectiveLoyaltyDiscount > 0 && (
                                            <span className="text-sm font-bold text-primary">-{effectiveLoyaltyDiscount.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 pt-2 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        ⚠️ Need at least 100 points to redeem. You have {formatPoints(selectedCustomer.loyaltyPoints)} points.
                                    </p>
                                </div>
                            )}
                        </div>
                    )} 
                </CardContent>
            </Card>

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
