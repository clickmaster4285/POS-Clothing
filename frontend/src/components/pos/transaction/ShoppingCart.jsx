import { Trash2, Minus, Plus, ArrowLeft, ArrowRight, User, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTransaction } from '@/context/TransactionContext';
import { useCustomers } from "@/hooks/pos_hooks/useCustomer";

export function ShoppingCart() {
    const {
        cartItems,
        updateCartItem,
        removeCartItem,
        totals,
        setCurrentStep,
        selectedCustomer,
        setSelectedCustomer,
        redeemPoints,
        setRedeemPoints,
        loyaltyDiscount,
        setLoyaltyDiscount,
        finalTotal,
        setFinalTotal,
        pointsRedeemed,
        setPointsRedeemed,
        pointsEarned,
        setPointsEarned,
    } = useTransaction();

    const { data: customers = [], isLoading } = useCustomers();

    // Local states for calculations
    const [effectiveLoyaltyDiscount, setEffectiveLoyaltyDiscount] = useState(0);
    const [effectiveFinalTotal, setEffectiveFinalTotal] = useState(0);
    const [effectivePointsEarned, setEffectivePointsEarned] = useState(0);
    const [effectivePointsRedeemed, setEffectivePointsRedeemed] = useState(0);
    const [effectiveNewBalance, setEffectiveNewBalance] = useState(0);

    // Recalculate totals when cart or customer changes
    useEffect(() => {
        const subtotal = Number(totals?.subtotal) || 0;
        const totalDiscount = Number(totals?.totalDiscount) || 0;
        const totalTax = Number(totals?.totalTax) || 0;

        let loyaltyDisc = 0;
        let pointsRedeemedCalc = 0;

        if (redeemPoints && selectedCustomer) {
            const availablePoints = Number(selectedCustomer.loyaltyPoints) || 0;
            const maxPossibleDiscount = Math.floor(availablePoints / 100);
            const maxDiscountPercentage = subtotal * 0.2;
            loyaltyDisc = Math.min(maxPossibleDiscount, maxDiscountPercentage);
            pointsRedeemedCalc = loyaltyDisc * 100;
        }

        const finalTotalCalc = subtotal - totalDiscount - loyaltyDisc + totalTax;
        const pointsEarnedCalc = Math.floor(finalTotalCalc / 1000) * 100;

        const currentPoints = selectedCustomer ? Number(selectedCustomer.loyaltyPoints) || 0 : 0;
        let newBalance = currentPoints + pointsEarnedCalc;
        if (redeemPoints) {
            newBalance = Math.max(0, currentPoints - pointsRedeemedCalc + pointsEarnedCalc);
        }

        setEffectiveLoyaltyDiscount(loyaltyDisc);
        setEffectiveFinalTotal(finalTotalCalc);
        setEffectivePointsEarned(pointsEarnedCalc);
        setEffectivePointsRedeemed(pointsRedeemedCalc);
        setEffectiveNewBalance(newBalance);
    }, [cartItems, totals, selectedCustomer, redeemPoints]);

    // Sync calculated values with context
    useEffect(() => {
        if (setLoyaltyDiscount && effectiveLoyaltyDiscount !== Number(loyaltyDiscount)) {
            setLoyaltyDiscount(effectiveLoyaltyDiscount);
        }
        if (setFinalTotal && effectiveFinalTotal !== Number(finalTotal)) {
            setFinalTotal(effectiveFinalTotal);
        }
        if (setPointsEarned && effectivePointsEarned !== Number(pointsEarned)) {
            setPointsEarned(effectivePointsEarned);
        }
        if (setPointsRedeemed && effectivePointsRedeemed !== Number(pointsRedeemed)) {
            setPointsRedeemed(effectivePointsRedeemed);
        }
    }, [effectiveLoyaltyDiscount, effectiveFinalTotal, effectivePointsEarned, effectivePointsRedeemed]);

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        const customer = customers.find(c => c._id === customerId);
        setSelectedCustomer(customer || null);
        setRedeemPoints(false);

        if (setPointsRedeemed) setPointsRedeemed(0);
        if (setLoyaltyDiscount) setLoyaltyDiscount(0);
    };

    const handleRedeemPoints = (checked) => {
        setRedeemPoints(checked);
    };

    const formatCurrency = (value) => {
        const num = Number(value);
        return (isNaN(num) ? 0 : num).toFixed(2);
    };

    const formatPoints = (value) => {
        const num = Number(value);
        return (isNaN(num) ? 0 : Math.floor(num)).toString();
    };

    if (cartItems.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <Card>
                    <CardContent className="py-16 text-center">
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <Button className="mt-4" onClick={() => setCurrentStep(0)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Add Products
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Shopping Cart</h2>

            {/* Customer Selection Card */}
            <Card className="overflow-hidden">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Select Customer (Optional)</label>
                    </div>

                    <select
                        value={selectedCustomer?._id || ''}
                        onChange={handleCustomerChange}
                        className="w-full md:w-72 border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Guest Checkout</option>
                        {customers.map(customer => (
                            <option key={customer._id} value={customer._id}>
                                {`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unnamed Customer'}
                            </option>
                        ))}
                    </select>

                    {selectedCustomer && (
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

                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div>
                                    <span className="font-medium">Card #:</span> <span className="font-mono">{selectedCustomer.loyaltyCardNumber || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Program:</span> <span>{selectedCustomer.loyaltyProgram || 'Standard'}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Redeemed:</span> <span>{formatPoints(selectedCustomer.redeemedPoints)} pts</span>
                                </div>
                                <div>
                                    <span className="font-medium">Member since:</span> <span>{selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            {Number(selectedCustomer.loyaltyPoints) >= 100 && (
                                <div className="mt-3 pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="redeem-points" checked={redeemPoints} onCheckedChange={handleRedeemPoints} />
                                            <label htmlFor="redeem-points" className="text-sm cursor-pointer font-medium">Redeem points for discount</label>
                                        </div>
                                        {redeemPoints && effectiveLoyaltyDiscount > 0 && (
                                            <span className="text-sm font-bold text-primary">-{formatCurrency(effectiveLoyaltyDiscount)}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {Number(selectedCustomer.loyaltyPoints) < 100 && (
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

            {/* Cart Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Disc %</TableHead>
                                <TableHead className="text-right">Line Total</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cartItems.map(item => {
                                const unitPrice = Number(item.unitPrice) || 0;
                                const quantity = Number(item.quantity) || 1;
                                const discountPercent = Number(item.discountPercent) || 0;

                                const gross = unitPrice * quantity;
                                const disc = gross * (discountPercent / 100);
                                const lineTotal = gross - disc;

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name || 'Product'}</TableCell>
                                        <TableCell>{item.size || 'N/A'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: item.color?.code || item.color?.name?.toLowerCase() || '#ccc' }}
                                                />
                                                {item.color?.name || 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="inline-flex items-center border rounded-md overflow-hidden">
                                                <button
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                    onClick={() =>
                                                        updateCartItem(item.id, { quantity: Math.max(1, quantity - 1) })
                                                    }
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-2 min-w-[20px] text-center">{quantity}</span>
                                                <button
                                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                    onClick={() =>
                                                        updateCartItem(item.id, { quantity: quantity + 1 })
                                                    }
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(unitPrice)}</TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                type="number"
                                                value={discountPercent}
                                                min={0}
                                                max={100}
                                                step="0.01"
                                                onChange={(e) =>
                                                    updateCartItem(item.id, { discountPercent: Number(e.target.value) || 0 })
                                                }
                                                className="w-20 text-right ml-auto"
                                            />
                                        </TableCell>
                                        <TableCell>{formatCurrency(lineTotal)}</TableCell>
                                        <TableCell>
                                            <Button size="icon" variant="ghost" onClick={() => removeCartItem(item.id)} className="text-destructive hover:text-destructive/90">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(totals?.subtotal)}</span>
                    </div>

                    {Number(totals?.totalDiscount) > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Item Discounts</span>
                            <span>-{formatCurrency(totals.totalDiscount)}</span>
                        </div>
                    )}

                    {redeemPoints && effectiveLoyaltyDiscount > 0 && (
                        <div className="flex justify-between text-primary font-semibold bg-primary/5 py-1 px-2 rounded -mx-2">
                            <span>Loyalty Discount</span>
                            <span>-{formatCurrency(effectiveLoyaltyDiscount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-dashed">
                        <span>FINAL TOTAL</span>
                        <span className="text-primary">{formatCurrency(effectiveFinalTotal)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Product Entry
                </Button>
                <Button size="lg" onClick={() => setCurrentStep(2)} className="bg-primary hover:bg-primary/90">
                    Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
