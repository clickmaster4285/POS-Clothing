"use client"

import { useState, useMemo } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useTransaction } from "@/context/TransactionContext"
import { toast } from "@/hooks/use-toast"
import { useHeldTransactions, useCompleteHeldTransaction } from "@/hooks/pos_hooks/useTransaction"
import { useSettings } from "@/hooks/useSettings" // Add this import

export function RetrieveDialog({ open, onOpenChange }) {
    const { setCartItems, setCurrentStep, cartItems, setStatus, setSelectedCustomer } = useTransaction()
    const { data, isLoading, isError } = useHeldTransactions()
    const heldTransactions = data?.heldTransactions || []
    const { mutateAsync: completeTxn, isLoading: completing } = useCompleteHeldTransaction()
    const { data: settings } = useSettings() // Get settings for receipt

    // Per-transaction state
    const [paymentData, setPaymentData] = useState({}) // { [txnId]: { paymentMethod, amountTendered } }
    const [search, setSearch] = useState("")

    // Filter transactions by customer name or email
    const filteredTransactions = useMemo(() => {
        if (!search) return heldTransactions
        const lower = search.toLowerCase()
        return heldTransactions.filter(txn => {
            const customer = txn.customer || {}
            const fullName = `${customer.customerFirstName || ""} ${customer.customerLastName || ""}`.toLowerCase()
            const email = (customer.customerEmail || "").toLowerCase()
            return fullName.includes(lower) || email.includes(lower)
        })
    }, [search, heldTransactions])

    const handleRetrieve = (txn) => {
        if (cartItems.length > 0) {
            toast({ title: "Cart not empty", description: "Complete or void current transaction", variant: "destructive" })
            return
        }
        setCartItems(txn.cartItems)
        setCurrentStep(1)
        setStatus(txn.status || "held")
        setSelectedCustomer(txn.customer || null)
        toast({ title: "Transaction retrieved", description: `Park code: ${txn.parkCode}` })
    }

    // Separate function to generate receipt HTML for retrieved transactions
    const generateRetrieveReceiptHTML = (transaction) => {
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
        <td class="discount">${item.discountPercent || 0}%</td>
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
    <p>www.example.com</p>
  </div>
</div>
</body>
</html>
`;
    };

    // Function to print receipt
    const printReceipt = (transactionData) => {
        const printIframe = document.createElement('iframe');
        printIframe.style.position = 'absolute';
        printIframe.style.width = '0';
        printIframe.style.height = '0';
        printIframe.style.border = 'none';
        document.body.appendChild(printIframe);

        const printHTML = generateRetrieveReceiptHTML(transactionData);

        printIframe.contentDocument.write(printHTML);
        printIframe.contentDocument.close();

        window.focus();
        printIframe.contentWindow.print();

        printIframe.contentWindow.onafterprint = () => {
            document.body.removeChild(printIframe);
        };
    };

    const handleCompletePayment = async (txn) => {
        const txnPayment = paymentData[txn._id] || {}
        const tendered = parseFloat(txnPayment.amountTendered)
        const paymentMethod = txnPayment.paymentMethod || "cash"

        if (!tendered || tendered < txn.totals.grandTotal) {
            toast({ title: "Invalid amount", description: "Amount tendered must be >= grand total", variant: "destructive" })
            return
        }

        const payment = {
            paymentMethod,
            amountTendered: tendered,
            changeDue: tendered - txn.totals.grandTotal,
        }

        try {
            console.log("Completing transaction:", txn._id, payment)
            const completedTransaction = await completeTxn({ id: txn._id, payment })
            console.log("Completed transaction response:", completedTransaction)

            // Get the transaction data (handle different response structures)
            const transactionData = completedTransaction?.transaction || completedTransaction
            console.log("Transaction data to send:", transactionData)

            // Print receipt directly from here
            printReceipt(transactionData)

            toast({ title: "Transaction completed", description: `Park code: ${txn.parkCode}` })
            onOpenChange(false)

            // Reset state for this transaction
            setPaymentData(prev => {
                const copy = { ...prev }
                delete copy[txn._id]
                return copy
            })
        } catch (err) {
            console.error("Error completing transaction:", err)
            toast({ title: "Failed to complete transaction", variant: "destructive" })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Retrieve Held Transaction</DialogTitle>
                    <DialogDescription>Select a parked transaction to continue and complete payment.</DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Search by customer name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-3"
                />

                {isLoading ? (
                    <p className="text-center py-6">Loading...</p>
                ) : isError ? (
                    <p className="text-center py-6 text-destructive">Failed to fetch held transactions</p>
                ) : filteredTransactions.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">No held transactions found</p>
                ) : (
                    <div className="space-y-4 max-h-80 overflow-auto">
                        {filteredTransactions.map((txn) => {
                            const txnPayment = paymentData[txn._id] || { amountTendered: "", paymentMethod: "cash" }
                            const tendered = parseFloat(txnPayment.amountTendered)
                            const changeDue = !isNaN(tendered) ? tendered - txn.totals.grandTotal : 0
                            const customer = txn.customer || {}

                            return (
                                <div key={txn._id} className="p-3 border rounded-lg bg-card flex flex-col gap-2">
                                    <div onClick={() => handleRetrieve(txn)} className="cursor-pointer">
                                        <p className="font-mono font-semibold text-sm">{txn.parkCode || txn.transactionNumber}</p>
                                        <p className="text-xs text-muted-foreground">{txn.holdReason || ""}</p>
                                        <p className="text-xs text-muted-foreground">{txn.cartItems?.length || 0} items</p>
                                        <p className="font-semibold text-sm">${txn.totals?.grandTotal?.toFixed(2) || 0}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Customer: {customer.customerFirstName} {customer.customerLastName} ({customer.customerEmail})
                                        </p>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <Select
                                            value={txnPayment.paymentMethod}
                                            onValueChange={(val) =>
                                                setPaymentData(prev => ({
                                                    ...prev,
                                                    [txn._id]: { ...prev[txn._id], paymentMethod: val }
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Payment Method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="card">Card</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="number"
                                            placeholder="Amount Tendered"
                                            value={txnPayment.amountTendered}
                                            onChange={(e) =>
                                                setPaymentData(prev => ({
                                                    ...prev,
                                                    [txn._id]: { ...prev[txn._id], amountTendered: e.target.value }
                                                }))
                                            }
                                        />

                                        <Button
                                            className="bg-green-500 text-white hover:bg-green-600"
                                            onClick={() => handleCompletePayment(txn)}
                                            disabled={completing}
                                        >
                                            Complete Payment
                                        </Button>
                                    </div>

                                    <div className="text-sm font-semibold pt-2">
                                        Change Due: ${changeDue > 0 ? changeDue.toFixed(2) : "0.00"}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RetrieveDialog