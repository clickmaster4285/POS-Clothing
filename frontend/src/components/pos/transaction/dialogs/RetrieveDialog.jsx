"use client"

import { useState, useMemo } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useTransaction } from "@/context/TransactionContext"
import { toast } from "@/hooks/use-toast"
import { useHeldTransactions, useCompleteHeldTransaction } from "@/hooks/pos_hooks/useTransaction"

export function RetrieveDialog({ open, onOpenChange }) {
    const { setCartItems, setCurrentStep, cartItems, setStatus, setSelectedCustomer } = useTransaction()
    const { data, isLoading, isError } = useHeldTransactions()
    const heldTransactions = data?.heldTransactions || []
    const { mutateAsync: completeTxn, isLoading: completing } = useCompleteHeldTransaction()

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
            await completeTxn({ id: txn._id, payment })
            toast({ title: "Transaction completed", description: `Park code: ${txn.parkCode}` })
            onOpenChange(false)
            // Reset state for this transaction
            setPaymentData(prev => {
                const copy = { ...prev }
                delete copy[txn._id]
                return copy
            })
        } catch (err) {
            console.error(err)
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
