import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useCreateTransaction } from "@/hooks/pos_hooks/useTransaction";

function generateTransactionNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const randomDigits = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    return `TXN-${year}${month}${day}-${hours}${minutes}${seconds}-${randomDigits}`;
}

const TransactionContext = createContext(undefined);

function calculateTotals(items) {
    let subtotal = 0;
    let totalDiscount = 0;
    const taxMap = new Map();

    items.forEach((item) => {
        const lineGross = item.unitPrice * item.quantity;
        const lineDiscount = lineGross * (item.discountPercent / 100);
        const lineAfterDiscount = lineGross - lineDiscount;
        const lineTax = lineAfterDiscount * (item.taxPercent / 100);

        subtotal += lineGross;
        totalDiscount += lineDiscount;

        const existing = taxMap.get(item.taxPercent) || 0;
        taxMap.set(item.taxPercent, existing + lineTax);
    });

    const taxBreakdown = Array.from(taxMap.entries()).map(([rate, amount]) => ({
        rate,
        amount,
    }));

    const totalTax = taxBreakdown.reduce((sum, t) => sum + t.amount, 0);
    const grandTotal = subtotal - totalDiscount + totalTax;

    return { subtotal, totalDiscount, taxBreakdown, totalTax, grandTotal };
}

export function TransactionProvider({ children }) {

    const { mutateAsync: createTransaction, isLoading: isSaving } = useCreateTransaction();


    const [cartItems, setCartItems] = useState([]);
    const [status, setStatus] = useState('active');
    const [transactionNumber, setTransactionNumber] = useState(generateTransactionNumber());
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    // Loyalty
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [redeemPoints, setRedeemPoints] = useState(false);

    // Values controlled by ShoppingCart
    const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [pointsRedeemed, setPointsRedeemed] = useState(0);

    const addToCart = useCallback((item) => {
        setCartItems((prev) => {
            const existing = prev.find(
                (i) =>
                    i.productId === item.productId &&
                    i.size === item.size &&
                    i.color?.name === item.color?.name
            );

            if (existing) {
                return prev.map((i) =>
                    i.id === existing.id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }

            return [...prev, item];
        });
    }, []);

    const updateCartItem = useCallback((id, updates) => {
        setCartItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
        );
    }, []);

    const removeCartItem = useCallback((id) => {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const resetTransaction = useCallback(() => {
        setCartItems([]);
        setStatus('active');
        setTransactionNumber(generateTransactionNumber());
        setPaymentDetails(null);
        setCurrentStep(0);
        setSelectedCustomer(null);
        setRedeemPoints(false);
        setLoyaltyDiscount(0);
        setFinalTotal(0);
        setPointsEarned(0);
        setPointsRedeemed(0);
    }, []);

    const totals = useMemo(() => calculateTotals(cartItems), [cartItems]);


    const fullTransactionPayload = {
        transactionNumber,
        status,
        customer: selectedCustomer
            ? {
                customerId: selectedCustomer._id,
                customerFirstName: selectedCustomer.firstName,
                customerLastName: selectedCustomer.lastName,
                customerEmail: selectedCustomer.email,
            }
            : {},
        cartItems,
        totals,
        payment: paymentDetails,
        loyalty: {
            pointsEarned,
            pointsRedeemed,
            loyaltyDiscount,
            redeemPoints,
        },
        timestamp: new Date().toISOString(),
    };


    console.log("Full transaction payload:", fullTransactionPayload);

    const saveTransaction = useCallback(async () => {
        try {
            if (cartItems.length === 0) {
                throw new Error("Cart is empty");
            }

            if (!paymentDetails) {
                throw new Error("Payment not completed");
            }

            const payload = {
                ...fullTransactionPayload,
                status: "completed",
            };

            const response = await createTransaction(payload);

            resetTransaction();

            return response;
        } catch (error) {
            console.error("Error saving transaction:", error);
            throw error;
        }
    }, [createTransaction, fullTransactionPayload, resetTransaction, cartItems, paymentDetails]);


    
    return (
        <TransactionContext.Provider
            value={{
                cartItems,
                addToCart,
                updateCartItem,
                removeCartItem,
                clearCart,
                totals,
                status,
                setStatus,
                transactionNumber,
                resetTransaction,
                paymentDetails,
                setPaymentDetails,
                currentStep,
                setCurrentStep,

                selectedCustomer,
                setSelectedCustomer,
                redeemPoints,
                setRedeemPoints,

                loyaltyDiscount,
                setLoyaltyDiscount,
                finalTotal,
                setFinalTotal,
                pointsEarned,
                setPointsEarned,
                pointsRedeemed,
                setPointsRedeemed,

                saveTransaction,     
                isSaving,   
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransaction() {
    const ctx = useContext(TransactionContext);
    if (!ctx) {
        throw new Error('useTransaction must be used within TransactionProvider');
    }
    return ctx;
}