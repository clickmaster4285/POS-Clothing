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
import { Button } from "@/components/ui/button";

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

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const getFullLogoUrl = (logoPath) => {
        if (!logoPath) return '';
        if (logoPath.startsWith('http')) return logoPath;
        const baseUrl = API_BASE_URL;

        return `${baseUrl}${logoPath}`;
    };


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
  @page { margin: 0; }
  body {
    font-family: 'Courier New', monospace;
    font-size: 8px;
    line-height: 1.2;
    margin: 0;
    padding: 0;
    width: 50mm;
    background-color: #fff;
    color: #000;
  }
  .receipt {
    width: 50mm;
    padding: 5px 8px;
    margin: 0 auto;
  }
  .center { text-align: center; }
  .left { text-align: left; }
  .right { text-align: right; }
  hr {
    border: none;
    border-top: 1px dashed #000;
    margin: 4px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    word-wrap: break-word;
    margin-top: 2px;
  }
  th, td {
    padding: 2px 0;
    font-size: 8px;
  }
  th { text-align: left; }
  td.qty { text-align: center; width: 12%; }
  td.discount { text-align: center; width: 22%; }
  td.amount { text-align: right; width: 25%; }
  td.name { width: 50%; word-wrap: break-word; }
  .totals p {
    display: flex;
    justify-content: space-between;
    margin: 2px 0;
    font-weight: bold;
  }
  .totals .cash {
    display: flex;
    justify-content: space-between;
    margin: 2px 0;
    font-weight: bold;
  }
  .footer {
    text-align: center;
    font-size: 7px;
    margin-top: 5px;
    line-height: 1.2;
  }
  h2 {
    margin: 2px 0;
    font-size: 10px;
    letter-spacing: 0.5px;
  }
  p { margin: 1px 0; }
</style>
</head>
<body>
<div class="receipt">

  ${settings?.logo ? `
    <div style="display: flex; justify-content: center; margin-bottom: 8px;">
      <img src="${getFullLogoUrl(settings.logo)}" alt="${settings?.companyName || 'Store'}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 1px solid #e5e7eb;" />
    </div>
  ` : ''}

  <h2 class="center">${settings?.companyName || "STORE"}</h2>
  <p class="center">${settings?.address || ''}</p>
  <p class="center">Tel: ${settings?.phone || "(212) 555-0123"}</p>
  <hr />
  <p><strong>Receipt #:</strong> ${transaction.transactionNumber}</p>
  <p><strong>Customer:</strong> ${customerName}</p>
  <hr />
  <table>
    <thead>
      <tr>
        <th class="name">Item</th>
        <th class="qty">Qty</th>
        <th class="discount">Discount</th>
        <th class="amount">Price</th>
      </tr>
    </thead>
    <tbody>
      ${transaction.cartItems?.map(item => `
      <tr>
        <td class="name">${item.name}</td>
        <td class="qty">${item.quantity}</td>
        <td class="discount">${item.discountPercent}%</td>
        <td class="amount">${settings?.currencySymbol || '$'}${(item.unitPrice * item.quantity).toFixed(2)}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>
  <hr />
  <div class="totals">
    <p><span>Subtotal</span><span>${settings?.currencySymbol || '$'}${transaction.totals?.subtotal?.toFixed(2)}</span></p>
    ${transaction.totals?.totalDiscount > 0 ? `<p><span>Discount</span><span>${settings?.currencySymbol || '$'}${transaction.totals.totalDiscount.toFixed(2)}</span></p>` : ''}
    <p><span>Total</span><span>${settings?.currencySymbol || '$'}${transaction.totals?.grandTotal?.toFixed(2)}</span></p>
    <p><span>Payment</span><span>${transaction.payment?.paymentMethod?.toUpperCase()}</span></p>

${transaction.payment?.paymentMethod === 'cash' && transaction.payment?.changeDue ? `
  <p><span>Amount Paid:</span><span>${settings?.currencySymbol || '$'}${transaction.payment.amountTendered.toFixed(2)}</span></p>
  <p><span>Change:</span><span>${settings?.currencySymbol || '$'}${transaction.payment.changeDue.toFixed(2)}</span></p>
` : ''}

    ${transaction.loyalty?.pointsEarned > 0 ? `<p><span>Points Earned</span><span>${transaction.loyalty.pointsEarned}</span></p>` : ''}
  </div>
  <hr />
  <div class="footer">
    <p>Thank You For Shopping With Us!</p>
 
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

            // FIX: Use an iframe for printing instead of a new window
            const printIframe = document.createElement('iframe');
            printIframe.style.position = 'absolute';
            printIframe.style.width = '0';
            printIframe.style.height = '0';
            printIframe.style.border = 'none';
            document.body.appendChild(printIframe);

            const printHTML = generateReceiptHTML(receiptData);

            printIframe.contentDocument.write(printHTML);
            printIframe.contentDocument.close();

            // Focus back on the main window before printing
            window.focus();

            setTimeout(() => {
                // Print from the iframe - this won't steal focus from the main window
                printIframe.contentWindow.print();

                // Remove the iframe after printing
                printIframe.contentWindow.onafterprint = () => {
                    document.body.removeChild(printIframe);
                };
            }, 500);

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
    ];

    return (
        <div className="space-y-6 my-4">
           

            <div className="flex gap-2 align-right justify-end">
                {actions.map((action) => (
                    <Button
                        key={action.label}
                        onClick={action.onClick}
                        
                    >
                       
                        <span className="text-sm font-semibold ">{action.label}</span>
                    </Button>
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