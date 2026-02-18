"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useTransaction } from "@/context/TransactionContext"
import { useCreateTransaction } from "@/hooks/pos_hooks/useTransaction"
import CreateCustomer from "@/components/pos/customers/createCustomer"
import { useAuth } from "@/hooks/useAuth"
import { useCustomers } from "@/hooks/pos_hooks/useCustomer"

const holdReasons = [
    "Customer stepping out",
    "Waiting for approval",
    "Price verification needed",
    "Customer browsing more",
    "Other",
]

export function HoldDialog({ open, onOpenChange }) {
    const {
        cartItems,
        totals,
        clearCart,
        setCurrentStep,
        selectedCustomer,
        setSelectedCustomer,
        loyalty,
        selectedBranch
    } = useTransaction()

    const { data: customers } = useCustomers() || { data: [] }
    const [reason, setReason] = useState("")
    const [customReason, setCustomReason] = useState("")
    const [parkCode, setParkCode] = useState("")
    const [confirmed, setConfirmed] = useState(false)
    const [showCustomerModal, setShowCustomerModal] = useState(false)

    const { user: currentUser } = useAuth()
    const { mutateAsync: createTransaction, isLoading } = useCreateTransaction()

    const handleHold = async () => {
        if (!selectedCustomer) {
            toast({
                title: "Customer Required",
                description: "Please select or create a customer before holding transaction.",
                variant: "destructive"
            })
            return
        }

        const finalReason = reason === "Other" ? customReason : reason
        if (!finalReason) {
            toast({ title: "Please select a reason", variant: "destructive" })
            return
        }

        const code = `PARK-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`

        const payload = {
            transactionNumber: `TXN-${Date.now()}`,
            status: "held",
            customer: selectedCustomer
                ? {
                    customerId: selectedCustomer._id,
                    customerFirstName: selectedCustomer.firstName,
                    customerLastName: selectedCustomer.lastName,
                    customerEmail: selectedCustomer.email,
                }
                : null,

            cartItems: cartItems.map((item) => ({ ...item, id: item.id || `${item.productId}-${Date.now()}` })),
            totals,
            loyalty,
            parkCode: code,
            holdReason: finalReason,
            timestamp: new Date().toISOString(),
            branch: currentUser.role === "admin"
                ? selectedBranch?._id
                : currentUser.branch_id,
        }

        try {
            await createTransaction(payload)
            setParkCode(code)
            setConfirmed(true)
            toast({ title: "Transaction held successfully", description: `Park Code: ${code}` })
        } catch (err) {
            console.error(err)
            toast({ title: "Failed to hold transaction", variant: "destructive" })
        }
    }

    const handleClose = () => {
        if (confirmed) {
            clearCart()
            setCurrentStep(0)
        }
        setReason("")
        setCustomReason("")
        setParkCode("")
        setConfirmed(false)
        onOpenChange(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent>
                    {!confirmed ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Hold/Park Transaction</DialogTitle>
                                <DialogDescription>
                                    This will save the current transaction so you can retrieve it later.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Customer Selection Dropdown */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Customer</label>
                                    <Select
                                        value={selectedCustomer?._id || ""}
                                        onValueChange={(value) => {
                                            if (value === "add_new") {
                                                setShowCustomerModal(true)
                                            } else {
                                                const cust = customers.find(c => c._id === value)
                                                if (cust) setSelectedCustomer(cust)
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select customer..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(customers || []).map((c) => (
                                                <SelectItem key={c._id} value={c._id}>
                                                    {c.firstName} {c.lastName} ({c.phonePrimary})
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="add_new" className="text-primary font-bold">
                                                + Add New Customer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Reason Selection */}
                                <div>
                                    <label className="text-sm font-medium block mb-2">Reason</label>
                                    <Select value={reason} onValueChange={setReason}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a reason..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {holdReasons.map((r) => (
                                                <SelectItem key={r} value={r}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {reason === "Other" && (
                                    <Input
                                        placeholder="Enter reason..."
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                    />
                                )}

                                <div className="text-sm text-muted-foreground">
                                    Items: {cartItems.length} · Total: ${totals.grandTotal?.toFixed(2) || 0}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                                <Button
                                    className="bg-amber-500 hover:bg-amber-600 text-white"
                                    onClick={handleHold}
                                    disabled={!selectedCustomer || isLoading}
                                >
                                    Hold Transaction
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-pos-success">
                                    <CheckCircle2 className="w-5 h-5" /> Transaction Held
                                </DialogTitle>
                                <DialogDescription>Your transaction has been parked successfully.</DialogDescription>
                            </DialogHeader>
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground mb-2">Park Code</p>
                                <p className="text-3xl font-mono font-bold text-primary">{parkCode}</p>
                                <p className="text-xs text-muted-foreground mt-2">Use this code to retrieve the transaction</p>
                            </div>
                            <DialogFooter>
                                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleClose}>
                                    Done
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Customer Creation Modal */}
            {showCustomerModal && (
                <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
                

                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-2xl z-50">
                        <div className="h-full max-h-[90vh] overflow-y-auto p-6">
                            <CreateCustomer
                                isModal
                                onCustomerAdded={(customer) => {
                                    setSelectedCustomer(customer)
                                    setShowCustomerModal(false)
                                    toast({
                                        title: "Customer Selected",
                                        description: `${customer.firstName} added to transaction`,
                                    })
                                }}
                                onClose={() => setShowCustomerModal(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default HoldDialog
