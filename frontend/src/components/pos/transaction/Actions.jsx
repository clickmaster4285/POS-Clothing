import { useState, useEffect } from "react"; // Make sure useEffect is imported
import {
    CreditCard,
    PauseCircle,
} from "lucide-react";

import { useTransaction } from "@/context/TransactionContext";
import { HoldDialog } from "@/components/pos/transaction/dialogs/HoldDialog";
import { RetrieveDialog } from "@/components/pos/transaction/dialogs/RetrieveDialog";
import { VoidTransactionDialog } from "@/components/pos/transaction/dialogs/VoidTransactionDialog";
import { VoidItemDialog } from "@/components/pos/transaction/dialogs/VoidItemDialog";
import { PaymentDialog } from "@/components/pos/transaction/dialogs/PaymentDialog";
import { CustomerLookupDialog } from "@/components/pos/transaction/dialogs/CustomerLookupDialog";
import ReceiptPrinter from "@/components/pos/reciptManagement/ReceiptPrinter";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";

export function Actions() {
    const {
        cartItems,
        saveTransaction,
        setPaymentDetails,
        transactionNumber,
        selectedCustomer,
        totals,
        pointsEarned,
        pointsRedeemed,
    } = useTransaction();

    const { data: settings, isLoading, refetch } = useSettings();
    const [showHold, setShowHold] = useState(false);
    const [showRetrieve, setShowRetrieve] = useState(false);
    const [showVoidTxn, setShowVoidTxn] = useState(false);
    const [showVoidItem, setShowVoidItem] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showCustomerLookup, setShowCustomerLookup] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [completedTransaction, setCompletedTransaction] = useState(null);

    // Use useEffect to open receipt ONLY when completedTransaction has data
    useEffect(() => {
        if (completedTransaction) {
          
            setShowReceipt(true);
        }
    }, [completedTransaction]);


    const generateReceiptHTML = (transaction) => {
        const customerName = transaction.customer
            ? `${transaction.customer.customerFirstName || ''} ${transaction.customer.customerLastName || ''}`.trim()
            : "Walk-in Customer";

        return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Receipt - ${transaction.transactionNumber || "N/A"}</title>
<style>
  /* Remove browser print margins */
  @page { margin: 0; }
  body {
    font-family: 'Courier New', monospace;
    font-size: 8px;
    line-height: 1.15;
    margin: 0;
    padding: 0;
    width: 50mm; /* Thermal printer width */
  }
  .receipt {
    width: 50mm;
    padding: 3px 5px;
    margin: 0;
  }
  .center { text-align: center; }
  .left { text-align: left; }
  .right { text-align: right; }
  hr { border: none; border-top: 1px dashed #000; margin: 2px 0; }
  table { width: 100%; border-collapse: collapse; word-wrap: break-word; }
  th, td { padding: 1px 0; font-size: 8px; }
  th { text-align: left; }
  td.qty { text-align: center; width: 12%; }
  td.amount { text-align: right; width: 25%; }
  td.name { width: 63%; word-wrap: break-word; }
  .totals p {
    display: flex;
    justify-content: space-between;
    margin: 1px 0;
    font-weight: bold;
  }
  .footer { text-align: center; font-size: 7px; margin-top: 2px; line-height: 1.1; }
</style>
</head>
<body>
<div class="receipt">
  <h2 class="center">${settings?.companyName || "STORE"}</h2>
  <p class="center">123 Fashion Avenue, NY CITY</p>
  <p class="center">Tel: (212) 555-0123</p>
  <hr />
  <p>Receipt #: ${transaction.transactionNumber}</p>
  <p>Customer: ${customerName}</p>
  <hr />
  <table>
    <thead>
      <tr>
        <th class="name">Item</th>
        <th class="qty">Qty</th>
        <th class="amount">Price</th>
      </tr>
    </thead>
    <tbody>
      ${transaction.cartItems?.map(item => `
      <tr>
        <td class="name">${item.name}</td>
        <td class="qty">${item.quantity}</td>
        <td class="amount">$${(item.unitPrice * item.quantity).toFixed(2)}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>
  <hr />
  <div class="totals">
    <p><span>Subtotal</span><span>$${transaction.totals?.subtotal?.toFixed(2)}</span></p>
    ${transaction.totals?.totalDiscount > 0 ? `<p><span>Discount</span><span>-$${transaction.totals.totalDiscount.toFixed(2)}</span></p>` : ''}
    <p><span>Total</span><span>$${transaction.totals?.grandTotal?.toFixed(2)}</span></p>
    <p><span>Payment</span><span>${transaction.payment?.paymentMethod?.toUpperCase()}</span></p>
    ${transaction.payment?.paymentMethod === 'cash' && transaction.payment?.changeDue ? `<p><span>Change</span><span>$${transaction.payment.changeDue.toFixed(2)}</span></p>` : ''}
    ${transaction.loyalty?.pointsEarned > 0 ? `<p><span>Points Earned</span><span>${transaction.loyalty.pointsEarned}</span></p>` : ''}
  </div>
  <hr />
  <div class="footer">
    <p>Thank You For Shopping With Us!</p>
    <p>www.fashionstore.com</p>
  </div>
</div>
</body>
</html>
`;
    };





    // In handlePaymentSuccess function - replace the printing section
    const handlePaymentSuccess = async (paymentData) => {
        try {
            setPaymentDetails(paymentData);

            // Save transaction
            const savedTransaction = await saveTransaction(paymentData);
            const transactionData = savedTransaction?.transaction || savedTransaction;

            const receiptData = {
                transactionNumber: transactionData?.transactionNumber || transactionNumber,
                timestamp: transactionData?.timestamp || new Date().toISOString(),
                customer: transactionData?.customer || (selectedCustomer ? {
                    customerFirstName: selectedCustomer.firstName,
                    customerLastName: selectedCustomer.lastName,
                    customerEmail: selectedCustomer.email,
                    customerId: selectedCustomer._id
                } : null),
                cartItems: transactionData?.cartItems || cartItems.map(item => ({
                    ...item,
                    unitPrice: Number(item.unitPrice) || 0
                })),
                totals: transactionData?.totals || {
                    subtotal: Number(totals?.subtotal) || 0,
                    totalDiscount: Number(totals?.totalDiscount) || 0,
                    grandTotal: Number(totals?.grandTotal) || 0
                },
                payment: transactionData?.payment || {
                    amountTendered: Number(paymentData.amountTendered) || 0,
                    changeDue: Number(paymentData.changeDue) || 0,
                    paymentMethod: paymentData.paymentMethod || 'cash',
                    amountPaid: Number(paymentData.amountPaid) || 0
                },
                loyalty: transactionData?.loyalty || {
                    pointsEarned: Number(pointsEarned) || 0,
                    pointsRedeemed: Number(pointsRedeemed) || 0,
                }
            };

            // Close payment dialog first
            setShowPayment(false);

            // Show success message
            toast({ title: "Transaction Completed" });

            // Small delay to ensure dialog is fully closed before printing
            setTimeout(() => {
                // Generate HTML and print
                const printHTML = generateReceiptHTML(receiptData);
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                    printWindow.document.write(printHTML);
                    printWindow.document.close();

                    // Don't call focus() immediately - let the print dialog handle it
                    // Remove printWindow.focus() line

                    // Use requestAnimationFrame to ensure print dialog doesn't steal focus
                    requestAnimationFrame(() => {
                        printWindow.print();
                    });
                }
            }, 300); // 300ms delay

        } catch (err) {
            console.error("Transaction save failed:", err);
            toast({
                title: "Failed to save transaction",
                description: err.message,
                variant: "destructive",
            });
        }
    };


    const handleCloseReceipt = () => {
        setShowReceipt(false);
        // Clear completed transaction after a small delay to avoid UI flicker
        setTimeout(() => {
            setCompletedTransaction(null);
        }, 300);
    };

    const actions = [
        {
            label: "Proceed to Payment",
            icon: CreditCard,
            color: "bg-primary text-white",
            onClick: () => {
                if (cartItems.length === 0) {
                    toast({
                        title: "Cart is empty",
                        description: "Add products before proceeding to payment",
                        variant: "destructive",
                    });
                    return;
                }
                setShowPayment(true);
            },
        },
        {
            label: "Hold Transaction",
            icon: PauseCircle,
            color: "bg-amber-500 text-white",
            onClick: () => {
                if (cartItems.length === 0) {
                    toast({ title: "Cart is empty", variant: "destructive" });
                    return;
                }
                setShowHold(true);
            },
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Actions</h2>

            <div className="grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={action.onClick}
                        className={cn(
                            "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow hover:shadow-lg transition-all hover:scale-105 w-full text-center",
                            action.color
                        )}
                    >
                        <action.icon className="w-8 h-8" />
                        <span className="text-sm font-semibold">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Dialogs */}
            <HoldDialog open={showHold} onOpenChange={setShowHold} />
            <RetrieveDialog open={showRetrieve} onOpenChange={setShowRetrieve} />
            <VoidTransactionDialog open={showVoidTxn} onOpenChange={setShowVoidTxn} />
            <VoidItemDialog open={showVoidItem} onOpenChange={setShowVoidItem} />
            <PaymentDialog
                open={showPayment}
                onOpenChange={setShowPayment}
                onSuccess={handlePaymentSuccess}
            />
            <CustomerLookupDialog
                open={showCustomerLookup}
                onOpenChange={setShowCustomerLookup}
            />

            {/* Receipt Printer - Only render when there's data AND we want to show it */}
            {completedTransaction && (
                <ReceiptPrinter
                    transaction={completedTransaction}
                    open={showReceipt}
                    onClose={handleCloseReceipt}
                />
            )}
        </div>
    );
}