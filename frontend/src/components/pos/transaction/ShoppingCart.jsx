import { Trash2, Minus, Plus, ArrowLeft, ArrowRight, User, Award, Tag } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTransaction } from '@/context/TransactionContext';
import { useCustomers } from "@/hooks/pos_hooks/useCustomer";
import {
    usePromotions,
    useCreatePromotion,
    useUpdatePromotion,
    useDeletePromotion,
} from "@/hooks/pos_hooks/useDiscountPromotion";
import { CustomerSelectionCard } from './CustomerSelectionCard';

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
        overallDiscountPercent,
        setOverallDiscountPercent,
        overallDiscountAmount
    } = useTransaction();

    const { data: customers = [], isLoading } = useCustomers();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');


 

    const {
        data: response,
    } = usePromotions();
    // Extract promotions array from response
    const promotions = response?.success && Array.isArray(response.data)
        ? response.data
        : [];


    


    // Calculate discount only for items without existing discount
    // const overallDiscountAmount = useMemo(() => {
    //     if (!cartItems || cartItems.length === 0) return 0;

    //     return cartItems.reduce((total, item) => {
    //         // Only apply to items without any applied discount
    //         if (!item.discountPercent || item.discountPercent === 0) {
    //             const unitPrice = Number(item.unitPrice) || 0;
    //             const quantity = Number(item.quantity) || 1;
    //             const lineTotal = unitPrice * quantity;
    //             return total + (lineTotal * (overallDiscountPercent / 100));
    //         }
    //         return total;
    //     }, 0);
    // }, [cartItems, overallDiscountPercent]);





    // Function to check if a promotion applies to a cart item
    const doesPromotionApplyToItem = (promotion, item) => {
        // Check if promotion is active
        if (promotion.status !== 'active') return false;

        // Check date validity
        const now = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);

        if (now < startDate || now > endDate) return false;

        // Check if promotion has expiration and is expired
        if (promotion.hasExpiration && promotion.expirationDate) {
            const expirationDate = new Date(promotion.expirationDate);
            if (now > expirationDate) return false;
        }

        // Check qualifying categories
        if (promotion.qualifyingCategories && promotion.qualifyingCategories.length > 0) {
            const matchesCategory = promotion.qualifyingCategories.some(
                cat => cat._id === item.categoryId
            );
            if (matchesCategory) return true;
        }

        // Check qualifying products
        if (promotion.qualifyingProducts && promotion.qualifyingProducts.length > 0) {
            const matchesProduct = promotion.qualifyingProducts.some(
                prod => prod._id === item.productId
            );
            if (matchesProduct) return true;
        }

        return false;
    };

    // Function to calculate discount amount for an item based on promotion
    const calculateItemDiscount = (item, promotion) => {
        const unitPrice = Number(item.unitPrice) || 0;
        const quantity = Number(item.quantity) || 1;
        const gross = unitPrice * quantity;

        if (promotion.amountType === "Percentage") {
            const discountPercent = Number(promotion.amountValue) || 0;
            return gross * (discountPercent / 100);
        } else if (promotion.amountType === "Fixed") {
            // Fixed amount per item or per order? Assuming per item for now
            return Number(promotion.amountValue) || 0;
        }

        return 0;
    };

    // Auto-apply eligible promotions to cart items
    useEffect(() => {
        if (!promotions || promotions.length === 0) return;

        // Get all auto-apply promotions
        const autoApplyPromotions = promotions.filter(p => p.autoApply === true);

        // Create a copy of cart items to update
        const updatedItems = [...cartItems];
        let itemsChanged = false;

        // For each auto-apply promotion, apply to eligible items
        autoApplyPromotions.forEach(promotion => {
            updatedItems.forEach((item, index) => {
                // Check if this promotion applies to this item
                if (doesPromotionApplyToItem(promotion, item)) {
                    // Calculate the discount based on promotion
                    const discountAmount = calculateItemDiscount(item, promotion);

                    // Convert to percentage for display (if it's a percentage promotion)
                    if (promotion.amountType === "Percentage") {
                        // Store the original promotion percent in discountPercent field
                        // But we need to be careful not to override existing manual discounts
                        // You might want to store promotion info separately
                        if (item.discountPercent !== promotion.amountValue) {
                            itemsChanged = true;
                            updateCartItem(item.id, {
                                discountPercent: promotion.amountValue,
                                appliedPromotion: promotion._id // You might want to track which promotion was applied
                            });
                        }
                    } else if (promotion.amountType === "Fixed") {
                        // For fixed amount, you might need to calculate the equivalent percentage
                        // based on the item price, or handle fixed discounts separately
                        const unitPrice = Number(item.unitPrice) || 0;
                        const quantity = Number(item.quantity) || 1;
                        const gross = unitPrice * quantity;
                        const equivalentPercent = (promotion.amountValue / gross) * 100;

                        if (Math.abs(item.discountPercent - equivalentPercent) > 0.01) {
                            itemsChanged = true;
                            updateCartItem(item.id, {
                                discountPercent: equivalentPercent,
                                appliedPromotion: promotion._id
                            });
                        }
                    }
                }
            });
        });

        // Note: This might cause infinite loops if not handled carefully
        // Consider adding a flag to prevent re-triggering

    }, [promotions, cartItems]); // Be careful with dependencies to avoid loops

    // Handle coupon code application
    const handleApplyCoupon = () => {
        setCouponError('');

        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        // Find promotion with matching coupon code
        const promotion = promotions.find(p =>
            p.couponCode && p.couponCode.toLowerCase() === couponCode.toLowerCase()
        );

        if (!promotion) {
            setCouponError('Invalid coupon code');
            return;
        }

        // Check if promotion is active and valid
        if (promotion.status !== 'active') {
            setCouponError('This promotion is not active');
            return;
        }

        // Check date validity
        const now = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);

        if (now < startDate) {
            setCouponError('This promotion has not started yet');
            return;
        }

        if (now > endDate) {
            setCouponError('This promotion has expired');
            return;
        }

        // Check if promotion has expiration and is expired
        if (promotion.hasExpiration && promotion.expirationDate) {
            const expirationDate = new Date(promotion.expirationDate);
            if (now > expirationDate) {
                setCouponError('This coupon has expired');
                return;
            }
        }

        // Apply the promotion to eligible items
        let itemsUpdated = false;

        cartItems.forEach(item => {
            if (doesPromotionApplyToItem(promotion, item)) {
                if (promotion.amountType === "Percentage") {
                    // Check if further discounts are allowed
                    if (promotion.allowFurtherDiscounts || item.discountPercent === 0) {
                        updateCartItem(item.id, {
                            discountPercent: promotion.amountValue,
                            appliedCouponPromotion: promotion._id
                        });
                        itemsUpdated = true;
                    }
                } else if (promotion.amountType === "Fixed") {
                    // Handle fixed discounts similarly
                    const unitPrice = Number(item.unitPrice) || 0;
                    const quantity = Number(item.quantity) || 1;
                    const gross = unitPrice * quantity;
                    const equivalentPercent = (promotion.amountValue / gross) * 100;

                    if (promotion.allowFurtherDiscounts || item.discountPercent === 0) {
                        updateCartItem(item.id, {
                            discountPercent: equivalentPercent,
                            appliedCouponPromotion: promotion._id
                        });
                        itemsUpdated = true;
                    }
                }
            }
        });

        if (itemsUpdated) {
            setAppliedCoupon(promotion);
            setCouponCode('');
        } else {
            setCouponError('No eligible items found for this coupon');
        }
    };

    // Handle removing applied coupon
    const handleRemoveCoupon = () => {
        if (appliedCoupon) {
            // Remove coupon discounts from items
            cartItems.forEach(item => {
                if (item.appliedCouponPromotion === appliedCoupon._id) {
                    updateCartItem(item.id, {
                        discountPercent: 0,
                        appliedCouponPromotion: null
                    });
                }
            });
            setAppliedCoupon(null);
        }
    };

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

        // Include overallDiscountAmount here
        const finalTotalCalc = subtotal - totalDiscount - loyaltyDisc - overallDiscountAmount + totalTax;

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
    }, [cartItems, totals, selectedCustomer, redeemPoints, overallDiscountAmount]);


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
                <Card className="h-[55vh] flex flex-col">
                    <CardContent className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center text-center">
                            <svg
                                className="w-16 h-16 mb-4 text-muted-foreground/30"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <p className="text-muted-foreground text-lg">Your cart is empty</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">Add items to get started</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
           

        
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 border-t pt-4'>
                <div className=" border-r pr-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <label className="text-sm font-medium">Have a coupon code?</label>
                    </div>

                    {appliedCoupon ? (
                        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                            <div>
                                <span className="text-sm font-medium text-green-700">Applied: {appliedCoupon.couponCode}</span>
                                <p className="text-xs text-green-600">{appliedCoupon.name} - {appliedCoupon.discountDescription}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="text-red-600 hover:text-red-700">
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="flex-1"
                            />
                            <Button onClick={handleApplyCoupon} variant="outline">
                                Apply
                            </Button>
                        </div>
                    )}

                    {couponError && (
                        <p className="text-xs text-red-500 mt-2">{couponError}</p>
                    )}
                </div>

                <CustomerSelectionCard
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    redeemPoints={redeemPoints}
                    setRedeemPoints={setRedeemPoints}
                    effectiveLoyaltyDiscount={effectiveLoyaltyDiscount}
                    handleRedeemPoints={handleRedeemPoints}
                />



            
              
                

            </div>


        

            {/* Cart Table */}
           <Card>
    <CardContent className="p-0">
        {/* Scrollable table container */}
        <div className="max-h-[320px] overflow-y-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
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
                                            style={{ backgroundColor: item.colore || item.color.toLowerCase() || '#ccc' }}
                                        />
                                        {item.color || 'N/A'}
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
                                <TableCell className="text-right">{formatCurrency(lineTotal)}</TableCell>
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
        </div>
        
        {/* Optional: Show item count when scrolling */}
        {/* {cartItems.length > 6 && (
            <div className="text-xs text-muted-foreground text-center py-2 border-t">
                Showing {cartItems.length} items (scroll to see more)
            </div>
        )} */}
    </CardContent>
</Card>

        

            {/* Order Summary */}
           
                <div className="space-y-2 text-sm">
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

                    <div className="flex items-center justify-between text-sm text-blue-600">
                        <label className="flex-1">Overall Discount % (optional)</label>
                        <Input
                            type="number"
                            value={overallDiscountPercent}
                            min={0}
                            max={100}
                            step={0.01}
                            onChange={(e) => setOverallDiscountPercent(Number(e.target.value) || 0)}
                            className="w-20 text-right"
                        />
                    </div>

                    {overallDiscountAmount > 0 && (
                        <div className="flex justify-between  px-2 rounded -mx-2">
                            <span>Overall Discount ({overallDiscountPercent}%)</span>
                            <span>-{formatCurrency(overallDiscountAmount)}</span>
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
                </div>
          
         
        </div>
    );
}