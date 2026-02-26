import { useState } from "react";
import { Check, X, AlertTriangle, Scale, ShieldAlert, Recycle, Ticket, Plus, Minus } from "lucide-react";



const SpecialItems = () => {
    const [activeTab, setActiveTab] = useState("weighted");
    const [lotteryMode, setLotteryMode] = useState("quick-pick");

    // Weighted items state
    const [weightedForm, setWeightedForm] = useState({
        pluCode: "",
        itemName: "",
        pricePerUnit: "",
        weightUnit: "lbs",
        weight: "0.00",
        tare: "0.00",
    });

    // Age restricted state
    const [ageForm, setAgeForm] = useState({
        itemName: "Premium Whiskey 750ml",
        idType: "Driver's License",
        idNumber: "",
        dob: "",
        expirationDate: "",
        verified: false,
    });

    // Bottle deposit state
    const [bottleForm, setBottleForm] = useState({
        californiaEnabled: true,
        materialType: "",
        unitQty: 1,
        depositPerItem: "$0.05",
    });

    // Lottery state
    const [lotteryForm, setLotteryForm] = useState({
        ticketType: "Draw Game",
        gameType: "Powerball",
        quantity: 1,
        numberSelection: [],
        manualNumbers: "",
        pricePerTicket: "$2.00",
    });

    const netWeight = Math.max(0, parseFloat(weightedForm.weight || "0") - parseFloat(weightedForm.tare || "0")).toFixed(3);
    const totalPrice = (parseFloat(netWeight) * parseFloat(weightedForm.pricePerUnit || "0")).toFixed(2);
    const lotteryTotal = (lotteryForm.quantity * 2).toFixed(2);

    const tabs = [
        { key: "weighted", label: "Weighted Items", icon: <Scale size={16} /> },
        { key: "age-restricted", label: "Age Restricted Items", icon: <ShieldAlert size={16} /> },
        { key: "bottle-deposit", label: "Bottle Deposits / CRV", icon: <Recycle size={16} /> },
        { key: "lottery", label: "Lottery Items", icon: <Ticket size={16} /> },
    ];

    return (
        <div>
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Special Items</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold">Special Items</h1>
                    <p className="text-sm text-muted-foreground">Handle special items and unique item workflows</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                    {activeTab === "age-restricted" ? "Age ID Required" : "Scale Connected"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Weighted Items */}
            {activeTab === "weighted" && (
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-card rounded-lg border p-6">
                        <h3 className="font-semibold mb-4">Weighted Items</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">PLU Code</label>
                                <input type="text" placeholder="Enter PLU code" value={weightedForm.pluCode}
                                    onChange={(e) => setWeightedForm({ ...weightedForm, pluCode: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Item Name</label>
                                <div className="flex gap-2">
                                    <input type="text" value={weightedForm.itemName}
                                        onChange={(e) => setWeightedForm({ ...weightedForm, itemName: e.target.value })}
                                        placeholder="e.g., Banana" className="flex-1 border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                                    <button className="px-3 py-2 border rounded-lg text-sm hover:bg-muted">Lookup</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Price Per Unit</label>
                                <input type="text" value={weightedForm.pricePerUnit}
                                    onChange={(e) => setWeightedForm({ ...weightedForm, pricePerUnit: e.target.value })}
                                    placeholder="0.00" className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Weight Unit</label>
                                <div className="flex gap-2">
                                    {["lbs", "kg", "oz"].map((unit) => (
                                        <button key={unit}
                                            onClick={() => setWeightedForm({ ...weightedForm, weightUnit: unit })}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${weightedForm.weightUnit === unit ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                                                }`}
                                        >{unit}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Gross Weight</label>
                                <input type="text" value={weightedForm.weight}
                                    onChange={(e) => setWeightedForm({ ...weightedForm, weight: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Tare Weight</label>
                                <div className="flex gap-2 items-center">
                                    <input type="text" value={weightedForm.tare}
                                        onChange={(e) => setWeightedForm({ ...weightedForm, tare: e.target.value })}
                                        className="w-40 border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                                    <span className="text-sm text-muted-foreground">{weightedForm.weightUnit}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                <span>Net Weight: <strong>{netWeight} {weightedForm.weightUnit}</strong></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-card rounded-lg border p-6 text-center mb-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Check size={16} className="text-success" />
                                <span className="text-sm text-muted-foreground">Certified Weight</span>
                            </div>
                            <p className="text-5xl font-bold">{netWeight}</p>
                        </div>
                        <div className="bg-primary rounded-xl p-6 text-center">
                            <p className="text-primary-foreground/70 text-sm">TOTAL PRICE</p>
                            <p className="text-4xl font-bold text-primary-foreground">${totalPrice}</p>
                            <p className="text-primary-foreground/70 text-xs mt-1">= {netWeight} × ${weightedForm.pricePerUnit || "0.00"}</p>
                        </div>
                        <button className="w-full mt-4 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                            Add to Transaction
                        </button>
                    </div>
                </div>
            )}

            {/* Age Restricted Items */}
            {activeTab === "age-restricted" && (
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-card rounded-lg border p-6">
                        <h3 className="font-semibold mb-4">Age-Restricted Items</h3>
                        <div className="bg-accent p-4 rounded-lg mb-4">
                            <p className="text-xs text-muted-foreground">AGE-RESTRICTED ITEM</p>
                            <p className="text-lg font-bold">{ageForm.itemName}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">ID Type</label>
                                <select value={ageForm.idType} onChange={(e) => setAgeForm({ ...ageForm, idType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary">
                                    <option>Driver's License</option><option>Passport</option><option>State ID</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">ID Number</label>
                                <input type="text" value={ageForm.idNumber} onChange={(e) => setAgeForm({ ...ageForm, idNumber: e.target.value })}
                                    placeholder="Enter ID Number" className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Date of Birth</label>
                                <input type="date" value={ageForm.dob} onChange={(e) => setAgeForm({ ...ageForm, dob: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Expiration Date</label>
                                <input type="date" value={ageForm.expirationDate} onChange={(e) => setAgeForm({ ...ageForm, expirationDate: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="accent-primary" />
                                <span className="text-sm">ID is valid & verified, customer is 21+ and verified & valid for compliance purposes.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="accent-primary" />
                                <span className="text-sm">Capture ID Photo</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-card rounded-lg border p-6 text-center">
                            {!ageForm.verified ? (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                                        <X size={32} className="text-destructive" />
                                    </div>
                                    <p className="font-bold text-destructive">Not Verified</p>
                                    <p className="text-xs text-muted-foreground">Complete verification to proceed</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                                        <Check size={32} className="text-success" />
                                    </div>
                                    <p className="font-bold text-success">Verified</p>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => setAgeForm({ ...ageForm, verified: true })}
                            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
                        >
                            Verify Age
                        </button>
                        <button className="w-full px-4 py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-accent">
                            View ID Scanner
                        </button>
                        <div className="bg-warning/10 p-3 rounded-lg text-xs text-warning">
                            <p className="font-medium mb-1">⚠ Compliance Notice</p>
                            <p>The transaction will not proceed without proper ID verification & valid ID for compliance purposes.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-muted">Deny Sale</button>
                            <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">Start our Sale</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottle Deposits */}
            {activeTab === "bottle-deposit" && (
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-card rounded-lg border p-6">
                        <h3 className="font-semibold mb-4">Bottle Deposits / CRV</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <input type="checkbox" checked={bottleForm.californiaEnabled}
                                onChange={(e) => setBottleForm({ ...bottleForm, californiaEnabled: e.target.checked })} className="accent-primary" />
                            <span className="text-sm font-medium">CALIFORNIA CRV</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-6">Applied auto to applicable products based on provider guidelines.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Material Type</label>
                                <select value={bottleForm.materialType} onChange={(e) => setBottleForm({ ...bottleForm, materialType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary">
                                    <option value="">Select material type</option>
                                    <option>Aluminum</option><option>Plastic</option><option>Glass</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Unit/Qty</label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setBottleForm({ ...bottleForm, unitQty: Math.max(1, bottleForm.unitQty - 1) })}
                                        className="p-2 border rounded hover:bg-muted"><Minus size={14} /></button>
                                    <span className="w-12 text-center text-sm font-medium">{bottleForm.unitQty}</span>
                                    <button onClick={() => setBottleForm({ ...bottleForm, unitQty: bottleForm.unitQty + 1 })}
                                        className="p-2 border rounded hover:bg-muted"><Plus size={14} /></button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Deposit Per Item</label>
                                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary">
                                    <option>$0.05</option><option>$0.10</option>
                                </select>
                            </div>
                        </div>

                        <h3 className="font-semibold mt-6 mb-3">Items</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2"><span className="text-sm">Aluminum</span><span className="text-xs text-muted-foreground">Plastic</span></div>
                                <span className="text-sm font-medium">1 Container</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-primary rounded-xl p-6 text-center mb-4">
                            <p className="text-primary-foreground/70 text-sm">TOTAL DEPOSIT</p>
                            <p className="text-4xl font-bold text-primary-foreground">${(bottleForm.unitQty * 0.05).toFixed(2)}</p>
                            <p className="text-primary-foreground/70 text-xs mt-1">{bottleForm.unitQty} × {bottleForm.depositPerItem} each</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-muted">Description</button>
                            <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">Add to Transaction</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lottery Items */}
            {activeTab === "lottery" && (
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-card rounded-lg border p-6">
                        <h3 className="font-semibold mb-4">Lottery Items</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Ticket Type</label>
                                <div className="flex gap-2">
                                    {["Draw Game", "Scratch-Off"].map((t) => (
                                        <button key={t}
                                            onClick={() => setLotteryForm({ ...lotteryForm, ticketType: t })}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${lotteryForm.ticketType === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                                                }`}
                                        >{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Game Type</label>
                                <select value={lotteryForm.gameType} onChange={(e) => setLotteryForm({ ...lotteryForm, gameType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary">
                                    <option>Powerball</option><option>Mega Millions</option><option>Super Lotto</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Number Selection</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setLotteryMode("quick-pick")}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${lotteryMode === "quick-pick" ? "bg-primary text-primary-foreground" : "bg-muted"
                                            }`}
                                    >Quick Pick</button>
                                    <button
                                        onClick={() => setLotteryMode("manual-entry")}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${lotteryMode === "manual-entry" ? "bg-primary text-primary-foreground" : "bg-muted"
                                            }`}
                                    >Manual Entry</button>
                                </div>
                            </div>
                            {lotteryMode === "manual-entry" && (
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Enter Numbers</label>
                                    <input type="text" placeholder="e.g., 5, 12, 23, 34, 45"
                                        className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                                    <p className="text-xs text-muted-foreground mt-1">Enter numbers separated by commas</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Quantity</label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setLotteryForm({ ...lotteryForm, quantity: Math.max(1, lotteryForm.quantity - 1) })}
                                        className="p-2 border rounded hover:bg-muted"><Minus size={14} /></button>
                                    <span className="w-12 text-center text-sm font-medium">{lotteryForm.quantity}</span>
                                    <button onClick={() => setLotteryForm({ ...lotteryForm, quantity: lotteryForm.quantity + 1 })}
                                        className="p-2 border rounded hover:bg-muted"><Plus size={14} /></button>
                                </div>
                            </div>
                            <div className="bg-warning/10 p-3 rounded-lg text-xs">
                                <p className="font-medium text-warning mb-1">⚠ AGE VERIFICATION REQUIRED</p>
                                <p className="text-muted-foreground">Customers must be 18 years or older to purchase lottery tickets. Verify customer age before completing sale.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-card rounded-lg border p-6 text-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                <Ticket size={24} className="text-primary" />
                            </div>
                            <p className="font-bold">{lotteryForm.gameType}</p>
                            {lotteryMode === "quick-pick" && <p className="text-sm text-muted-foreground">QUICK PICK</p>}
                            {lotteryMode === "manual-entry" && <p className="text-sm text-muted-foreground">MANUAL ENTRY</p>}
                            <div className="mt-3 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Price per ticket</span><span>{lotteryForm.pricePerTicket}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span>{lotteryForm.quantity}</span></div>
                            </div>
                        </div>
                        <div className="bg-primary rounded-xl p-6 text-center mb-4">
                            <p className="text-primary-foreground/70 text-sm">TOTAL AMOUNT</p>
                            <p className="text-4xl font-bold text-primary-foreground">${lotteryTotal}</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-muted">Back</button>
                            <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">
                                {lotteryMode === "quick-pick" ? "Go & Confirm Sale" : "Save & Confirm Sale"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpecialItems;
