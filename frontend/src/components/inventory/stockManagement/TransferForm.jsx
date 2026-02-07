"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, CheckCircle, ArrowRight, XCircle, MoreVertical } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TransferForm({
    transferForm,
    setTransferForm,
    products = [],
    productsLoading = false,
    branches = [],
    branchesLoading = false,
    transfers = [],
    transferSummary,
    handleAddTransfer,
    resetTransferForm,
    handleTransferStatus,
    getStatusColor
}) {
    const selectedProductForTransfer = products.find(p => p._id === transferForm.product)
    const selectedProductVariantsTransfer = selectedProductForTransfer?.variants || []

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2">
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Truck className="h-5 w-5 text-primary" />
                            Transfer Form
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* From Branch */}
                            <div className="space-y-2">
                                <Label>From Branch *</Label>
                                {branchesLoading ? (
                                    <p className="text-sm text-muted-foreground">Loading branches...</p>
                                ) : branches.length === 0 ? (
                                    <p className="text-sm text-destructive">No branches available</p>
                                ) : (
                                    <Select
                                        value={transferForm.fromBranch}
                                        onValueChange={(value) => {
                                            setTransferForm(prev => ({
                                                ...prev,
                                                fromBranch: value,
                                                toBranch: prev.toBranch === value ? "" : prev.toBranch
                                            }))
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select source branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch._id} value={branch._id}>
                                                    {branch.branch_name || branch.name || "Unnamed Branch"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* To Branch */}
                            <div className="space-y-2">
                                <Label>To Branch *</Label>
                                {branchesLoading ? (
                                    <p className="text-sm text-muted-foreground">Loading branches...</p>
                                ) : branches.length === 0 ? (
                                    <p className="text-sm text-destructive">No branches available</p>
                                ) : (
                                    <Select
                                        value={transferForm.toBranch}
                                        onValueChange={(value) => setTransferForm(prev => ({ ...prev, toBranch: value }))}
                                        disabled={!transferForm.fromBranch}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select destination branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches
                                                .filter((b) => b._id !== transferForm.fromBranch)
                                                .map((branch) => (
                                                    <SelectItem key={branch._id} value={branch._id}>
                                                        {branch.branch_name || branch.name || "Unnamed Branch"}
                                                    </SelectItem>
                                                ))}
                                            {branches.filter(b => b._id !== transferForm.fromBranch).length === 0 && transferForm.fromBranch && (
                                                <SelectItem value="none" disabled>No other branches available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Product *</Label>
                                {productsLoading ? (
                                    <div className="text-sm text-muted-foreground">Loading products...</div>
                                ) : (
                                    <Select
                                        value={transferForm.product}
                                        onValueChange={v => setTransferForm({ ...transferForm, product: v, variant: "" })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => (
                                                <SelectItem key={p._id} value={p._id}>
                                                    {p.productName} ({p.sku || "no-sku"})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Variant *</Label>
                                <Select
                                    value={transferForm.variant}
                                    onValueChange={v => setTransferForm({ ...transferForm, variant: v })}
                                    disabled={!transferForm.product || selectedProductVariantsTransfer.length === 0}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select variant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedProductVariantsTransfer.map(v => (
                                            <SelectItem key={v._id} value={v._id}>
                                                {v.size || "-"} / {v.color || "-"} {v.variantSku ? `(${v.variantSku})` : ""}
                                            </SelectItem>
                                        ))}
                                        {selectedProductVariantsTransfer.length === 0 && transferForm.product && (
                                            <SelectItem value="none" disabled>No variants available</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transferQty">Quantity *</Label>
                            <Input
                                id="transferQty"
                                type="number"
                                min="1"
                                value={transferForm.quantity}
                                onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                                placeholder="Enter quantity to transfer"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={transferForm.notes}
                                onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                                placeholder="Additional notes for this transfer"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={resetTransferForm} className="bg-transparent">
                                Clear Form
                            </Button>
                            <Button onClick={handleAddTransfer} disabled={!transferSummary.isValid}>
                                Create Transfer
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Transfers History */}
                <Card className="border-border/50 mt-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Transfers History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transfer #</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transfers.map((transfer) => (
                                    <TableRow key={transfer.id}>
                                        <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                                        <TableCell>{new Date(transfer.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{transfer.fromBranch.branch_name}</TableCell>
                                        <TableCell>{transfer.toBranch.branch_name}</TableCell>
                                        <TableCell>{transfer.items.length} items</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(transfer.status)}>
                                                {transfer.status.replace("-", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {transfer.status !== "completed" && transfer.status !== "cancelled" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {transfer.status === "pending" && (
                                                            <DropdownMenuItem onClick={() => handleTransferStatus(transfer.id, "in-transit")}>
                                                                <Truck className="mr-2 h-4 w-4" />
                                                                Mark In Transit
                                                            </DropdownMenuItem>
                                                        )}
                                                        {transfer.status === "in-transit" && (
                                                            <DropdownMenuItem onClick={() => handleTransferStatus(transfer.id, "completed")}>
                                                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                                Mark Received
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => handleTransferStatus(transfer.id, "cancelled")} className="text-destructive">
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Cancel Transfer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Section */}
            <div className="space-y-4">
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border border-border p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Product</p>
                            <p className="text-xl font-semibold mt-1">{transferSummary.product}</p>
                        </div>

                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="text-xs text-blue-600 uppercase tracking-wider">Transfer Route</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="font-semibold text-blue-700">{transferSummary.from}</span>
                                <ArrowRight className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold text-blue-700">{transferSummary.to}</span>
                            </div>
                        </div>

                        {transferForm.quantity && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <p className="text-xs text-amber-600 uppercase tracking-wider">Quantity</p>
                                <p className="text-3xl font-bold text-amber-700 mt-1">{transferForm.quantity}</p>
                                <p className="text-xs text-amber-600 mt-1">units to transfer</p>
                            </div>
                        )}

                        <div className={`rounded-lg border p-4 ${transferSummary.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Form Status</p>
                            <div className="flex items-center gap-2 mt-2">
                                {transferSummary.isValid ? (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Ready to Submit
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                                        {transferForm.fromBranch === transferForm.toBranch && transferForm.fromBranch
                                            ? "Same branch selected"
                                            : "Missing required fields"}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}