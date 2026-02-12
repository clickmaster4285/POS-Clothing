import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Search, ChevronDown, ArrowLeft, FileText, Send, Printer, QrCode, Check, X, Plus, Minus } from "lucide-react";
import { transactions, exchangeItems } from "@/data/dummyData";



const ReturnsExchanges = () => {
    const [view, setView] = useState < View > ("list");
    const [selectedTxn, setSelectedTxn] = useState(transactions[0]);
    const [returnReason, setReturnReason] = useState("");
    const [returnItems, setReturnItems] = useState([
        { id: "RI-1", name: "USB-C Cable 6ft", sku: "SKU-42 1900", price: "$9.99", qty: 1 },
        { id: "RI-2", name: "HDMI Cable 6ft", sku: "SKU-42 1901", price: "$12.99", qty: 1 },
    ]);

    const handleViewReturn = (txn) => {
        setSelectedTxn(txn);
        setView("return");
    };

    const statusColor = (status) => {
        switch (status) {
            case "Completed": return "pos-badge-success";
            case "Refunded": return "pos-badge-danger";
            case "Pending": return "pos-badge-warning";
            case "Exchanged": return "pos-badge-info";
            default: return "";
        }
    };

    if (view === "receipt") {
        return (
            <div>
                <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                    <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                    <span className="text-primary font-medium">Receipt Management</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setView("list")} className="p-2 rounded-lg hover:bg-muted"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-bold">Receipt Information</h1>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card rounded-lg border p-6">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div><span className="text-muted-foreground">Transaction Number:</span><p className="font-medium">{selectedTxn.receiptNumber}</p></div>
                            <div><span className="text-muted-foreground">Status:</span><p><span className={`pos-badge ${statusColor(selectedTxn.status)}`}>{selectedTxn.status}</span></p></div>
                            <div><span className="text-muted-foreground">Date:</span><p>{selectedTxn.date}</p></div>
                            <div><span className="text-muted-foreground">Customer:</span><p>{selectedTxn.customer}</p></div>
                            <div><span className="text-muted-foreground">Payment:</span><p>{selectedTxn.payment}</p></div>
                            <div><span className="text-muted-foreground">Total:</span><p className="font-bold">{selectedTxn.totalTransaction}</p></div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:opacity-90">
                                <FileText size={14} /> Export PDF
                            </button>
                            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-muted">
                                <Send size={14} /> Resend
                            </button>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-6">
                        <h3 className="font-semibold mb-4">Receipt Preview</h3>
                        <div className="bg-muted/50 rounded-lg p-6 text-center">
                            <p className="font-bold mb-2">TechStore Plus</p>
                            <p className="text-xs text-muted-foreground mb-4">Thank you for shopping with us!</p>
                            <div className="text-sm text-left space-y-2 mb-4">
                                <div className="flex justify-between"><span>Item 1</span><span>$24.99</span></div>
                                <div className="flex justify-between"><span>Item 2</span><span>$15.00</span></div>
                                <div className="flex justify-between"><span>Item 3</span><span>$9.99</span></div>
                                <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>{selectedTxn.totalTransaction}</span></div>
                            </div>
                            <p className="text-xs text-muted-foreground">Payment: {selectedTxn.payment}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-card rounded-lg border p-4">
                        <h4 className="text-sm font-semibold mb-2">Email Receipt</h4>
                        <div className="flex items-center gap-2">
                            <span className="pos-badge pos-badge-success">Sent</span>
                            <span className="text-xs text-muted-foreground">{selectedTxn.customer}</span>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <h4 className="text-sm font-semibold mb-2">SMS Receipt</h4>
                        <button className="text-sm text-primary hover:underline">Send SMS</button>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <h4 className="text-sm font-semibold mb-2">Digital Receipt QR</h4>
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center mx-auto">
                            <QrCode size={32} className="text-muted-foreground" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setView("list")} className="px-4 py-2 border rounded-lg text-sm hover:bg-muted">Back To Receipt Information</button>
                    <button onClick={() => setView("receipt-edit")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">Save Changes</button>
                </div>
            </div>
        );
    }

    if (view === "exchange") {
        return (
            <div>
                <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                    <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                    <span className="text-primary font-medium">Exchange Items</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setView("return")} className="p-2 rounded-lg hover:bg-muted"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-bold">Exchange Items</h1>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card rounded-lg border p-6">
                        <h3 className="font-semibold mb-4">Select Original Item</h3>
                        <div className="bg-accent p-3 rounded-lg mb-4">
                            <p className="text-sm font-medium">SCANNED/SEARCHED</p>
                            <p className="font-mono text-primary">FX-90785</p>
                        </div>
                        {returnItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                                <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                                </div>
                                <span className="font-medium text-primary">{item.price}</span>
                            </div>
                        ))}
                        <h3 className="font-semibold mb-3 mt-6">Select Exchange Reason</h3>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary mb-4">
                            <option>Change Item</option><option>Wrong Size</option><option>Defective</option>
                        </select>
                        <h3 className="font-semibold mb-3">Select Replacement</h3>
                        {exchangeItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                                <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.barcode}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">{item.price}</span>
                                    <button className="px-3 py-1 border rounded text-xs hover:bg-muted">Select</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="bg-card rounded-lg border p-6 mb-4">
                            <h3 className="font-semibold mb-3">Price Adjustment</h3>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-muted-foreground">Original Item Price</span><span>$24.99</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Replacement Item Price</span><span>$39.99</span></div>
                            </div>
                            <div className="border-t mt-3 pt-3 flex justify-between">
                                <span className="text-sm text-muted-foreground">Sub Total</span>
                                <span className="font-medium">$14.91</span>
                            </div>
                        </div>
                        <div className="bg-primary rounded-xl p-6 text-center">
                            <p className="text-primary-foreground/70 text-sm">ADDITIONAL AMOUNT REQUIRED</p>
                            <p className="text-4xl font-bold text-primary-foreground mt-2">$12.00</p>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setView("return")} className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-muted">Back</button>
                            <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">Complete Exchange</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === "return") {
        return (
            <div>
                <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                    <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                    <span className="text-primary font-medium">Returns & Exchanges</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setView("list")} className="p-2 rounded-lg hover:bg-muted"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-bold">Transaction Details</h1>
                </div>
                <div className="bg-card rounded-lg border p-6 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div><span className="text-muted-foreground">Transaction #:</span><p className="font-medium">{selectedTxn.receiptNumber}</p></div>
                        <div><span className="text-muted-foreground">Date:</span><p>{selectedTxn.date}</p></div>
                        <div><span className="text-muted-foreground">Customer:</span><p>{selectedTxn.customer}</p></div>
                        <div><span className="text-muted-foreground">Payment:</span><p>{selectedTxn.payment}</p></div>
                        <div><span className="text-muted-foreground">Items:</span><p>{selectedTxn.items} items</p></div>
                        <div><span className="text-muted-foreground">Total:</span><p className="font-bold">{selectedTxn.totalTransaction}</p></div>
                    </div>
                    <div className="bg-accent p-3 rounded-lg mb-4">
                        <p className="font-mono text-primary text-sm">RX-910283</p>
                    </div>

                    <h3 className="font-semibold mb-3">Return Reason</h3>
                    <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary mb-4"
                    >
                        <option value="">Select Return Reason</option>
                        <option>Defective Product</option>
                        <option>Wrong Item</option>
                        <option>Changed Mind</option>
                        <option>Not As Described</option>
                    </select>

                    <h3 className="font-semibold mb-3">Return Items</h3>
                    {returnItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-accent/30">
                            <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.sku}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-primary">{item.price}</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground">Quantity:</span>
                                    <div className="flex items-center border rounded">
                                        <button className="p-1 hover:bg-muted"><Minus size={12} /></button>
                                        <span className="px-2 text-sm">{item.qty}</span>
                                        <button className="p-1 hover:bg-muted"><Plus size={12} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center gap-2 mt-4 mb-6">
                        <input type="checkbox" className="accent-primary" />
                        <span className="text-sm">I agree to return</span>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setView("list")} className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-muted">Back</button>
                        <button onClick={() => setView("exchange")} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">Exchange</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Returns & Exchanges</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold">Receipt Management</h1>
                    <p className="text-sm text-muted-foreground">View, manage, and resend customer receipts</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input placeholder="Search by transaction, date or customer ID..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-80 bg-card outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold mb-3">Transaction History</h3>
                <p className="text-sm text-muted-foreground mb-4">View customer transaction records and status</p>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
                <table className="pos-table">
                    <thead>
                        <tr>
                            <th>RECEIPT #</th>
                            <th>DATE</th>
                            <th>CUSTOMER</th>
                            <th>ITEMS</th>
                            <th>TOTAL TRANSACTION</th>
                            <th>PAYMENT</th>
                            <th>STATUS</th>
                            <th>RECEIPT SENT</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="hover:bg-muted/30">
                                <td className="font-mono text-sm">{txn.receiptNumber}</td>
                                <td>{txn.date}</td>
                                <td>{txn.customer}</td>
                                <td>{txn.items} items</td>
                                <td className="font-medium">{txn.totalTransaction}</td>
                                <td>{txn.payment}</td>
                                <td><span className={`pos-badge ${statusColor(txn.status)}`}>{txn.status}</span></td>
                                <td>
                                    {txn.receiptSent
                                        ? <span className="pos-badge pos-badge-success">Sent</span>
                                        : <span className="pos-badge pos-badge-warning">Pending</span>}
                                </td>
                                <td>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setSelectedTxn(txn); setView("receipt"); }} className="p-1.5 rounded hover:bg-muted" title="View Receipt">
                                            <Eye size={14} />
                                        </button>
                                        <button onClick={() => handleViewReturn(txn)} className="p-1.5 rounded hover:bg-muted" title="Return/Exchange">
                                            <Edit size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReturnsExchanges;
