import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from "react";
import { useCreateTransaction } from "@/hooks/pos_hooks/useTransaction";
import { useAuth } from "@/hooks/useAuth"
/* ===========================
   Helpers
=========================== */

function generateTransactionNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const randomDigits = String(Math.floor(Math.random() * 10000)).padStart(
        4,
        "0"
    );

    return `TXN-${year}${month}${day}-${hours}${minutes}${seconds}-${randomDigits}`;
}

function calculateTotals(items) {
    let subtotal = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
        const lineGross = item.unitPrice * item.quantity;
        const lineDiscount = lineGross * (item.discountPercent / 100);

        subtotal += lineGross;
        totalDiscount += lineDiscount;
    });

    const grandTotal = subtotal - totalDiscount;

    return { subtotal, totalDiscount, grandTotal };
}


/* ===========================
   Context
=========================== */

const TransactionContext = createContext(undefined);

export function TransactionProvider({ children }) {
    const { mutateAsync: createTransaction, isLoading: isSaving } =
        useCreateTransaction();

    const { user: currentUser, role } = useAuth();
  
    const [cartItems, setCartItems] = useState([]);
    const [status, setStatus] = useState("active");
    const [transactionNumber, setTransactionNumber] = useState(
        generateTransactionNumber()
    );
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);


    const [overallDiscountPercent, setOverallDiscountPercent] = useState(0);
    const [overallDiscountAmount, setOverallDiscountAmount] = useState(0);


    // Loyalty
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [redeemPoints, setRedeemPoints] = useState(false);
    const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [pointsRedeemed, setPointsRedeemed] = useState(0);

    const [heldTransactions, setHeldTransactions] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    /* ===========================
       Cart Actions
    =========================== */

    const addToCart = useCallback((item) => {
        setCartItems((prev) => {
            // Fix: Compare properly - color is a string, not an object
            const existing = prev.find(
                (i) =>
                    i.productId === item.productId &&
                    i.size === item.size &&
                    i.color === item.color // Compare strings directly
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
        setStatus("active");
        setTransactionNumber(generateTransactionNumber());
        setPaymentDetails(null);
        setCurrentStep(0);
        setSelectedCustomer(null);
        setRedeemPoints(false);
        setLoyaltyDiscount(0);
        setPointsEarned(0);
        setPointsRedeemed(0);
    }, []);

    /* ===========================
       Calculations
    =========================== */

    const totals = useMemo(() => {
        const baseTotals = calculateTotals(cartItems);

        // Calculate overall discount amount
        const overallDiscAmount = cartItems.reduce((total, item) => {
            if (!item.discountPercent || item.discountPercent === 0) {
                const lineTotal = item.unitPrice * item.quantity;
                return total + (lineTotal * (overallDiscountPercent / 100));
            }
            return total;
        }, 0);

        setOverallDiscountAmount(overallDiscAmount); // sync state

        // Apply loyalty discount and overall discount
        const finalGrandTotal = baseTotals.grandTotal - (loyaltyDiscount || 0) - overallDiscAmount;

        return {
            ...baseTotals,
            grandTotal: finalGrandTotal,
            grandTotalBeforeLoyalty: baseTotals.grandTotal,
            overallDiscountAmount: overallDiscAmount,
            overallDiscountPercent,
        };
    }, [cartItems, loyaltyDiscount, overallDiscountPercent]);



    const fullTransactionPayload = useMemo(
        () => ({
            transactionNumber,
            status,
            customer: selectedCustomer
                ? {
                    customerId: selectedCustomer._id,
                    customerFirstName: selectedCustomer.firstName,
                    customerLastName: selectedCustomer.lastName,
                    customerEmail: selectedCustomer.email,
                }
                : null,
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
            branch: currentUser.role === "admin"
                ? selectedBranch?._id
                : currentUser.branch_id
        }),
        [
            transactionNumber,
            status,
            selectedCustomer,
            cartItems,
            totals,
            paymentDetails,
            pointsEarned,
            pointsRedeemed,
            loyaltyDiscount,
            redeemPoints,
        ]
    );

 

    /* ===========================
       Save Transaction
    =========================== */

    const saveTransaction = useCallback(async (paymentDetailsParam = null) => {
        if (cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        // Use the passed payment details or fall back to state
        const finalPaymentDetails = paymentDetailsParam || paymentDetails;

        if (!finalPaymentDetails) {
            throw new Error("Payment not completed");
        }

        const payload = {
            ...fullTransactionPayload,
            payment: finalPaymentDetails, // Override with the passed payment details
            status: "completed",
        };

        const response = await createTransaction(payload);

        resetTransaction();
        return response;
    }, [
        cartItems,
        paymentDetails, // Keep this dependency
        fullTransactionPayload,
        createTransaction,
        resetTransaction,
    ]);


    const holdTransactionLocally = useCallback((reason = "Customer requested hold") => {
        if (cartItems.length === 0) throw new Error("Cart is empty");

        const parkCode = `PARK-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`;

        const newHeld = {
            parkCode,
            cartItems,
            totals,
            status: "held",
            customer: selectedCustomer || null,
            holdReason: reason,
            branch:
                currentUser.role === "admin"
                    ? selectedBranch?._id
                    : currentUser.branch_id,
            timestamp: new Date().toISOString(),
        };

        setHeldTransactions((prev) => [...prev, newHeld]);
        clearCart(); // clear current cart
        setCurrentStep(0);
        return parkCode;
    });

    // Retrieve a held transaction
    const retrieveHeldTransaction = useCallback((parkCode) => {
        const index = heldTransactions.findIndex((t) => t.parkCode === parkCode);
        if (index === -1) return null;

        const txn = heldTransactions[index];
        setCartItems(txn.cartItems);
        setCurrentStep(1);
        setStatus(txn.status);
        setSelectedCustomer(txn.customer || null);

        setHeldTransactions((prev) => prev.filter((t) => t.parkCode !== parkCode));
        return txn;
    }, [heldTransactions]);
    /* ===========================
       Provider
    =========================== */

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
                pointsEarned,
                setPointsEarned,
                pointsRedeemed,
                setPointsRedeemed,

                saveTransaction,
                isSaving,

                heldTransactions,
                holdTransactionLocally,
                retrieveHeldTransaction,

                selectedBranch,
                setSelectedBranch,

                overallDiscountPercent,
                setOverallDiscountPercent,
                overallDiscountAmount,

            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransaction() {
    const ctx = useContext(TransactionContext);
    if (!ctx) {
        throw new Error("useTransaction must be used within TransactionProvider");
    }
    return ctx;
}
