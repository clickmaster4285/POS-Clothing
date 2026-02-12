import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Edit, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { promotions } from "@/data/dummyData";



const DiscountsPromotions = () => {
    const [activeTab, setActiveTab] = useState("discounts");
    const [showValidateModal, setShowValidateModal] = useState(false);
    const [validateStep, setValidateStep] = useState(0);
    const [discountForm, setDiscountForm] = useState({
        discountType: "Item",
        discountCode: "",
        description: "",
        amount: "",
        applicableItems: "All POS",
        discountReason: "Sale",
        managerApproval: true,
        itemsApplyFurther: true,
        manualOverride: false,
        expirationDate: "",
    });

    const handleApplyDiscount = () => {
        setShowValidateModal(true);
        setValidateStep(0);
    };

    const advanceValidation = () => {
        if (validateStep < 4) setValidateStep(validateStep + 1);
        else setShowValidateModal(false);
    };

    return (
        <div>
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Discounts & Promotions</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold">Discounts & Promotions</h1>
                    <p className="text-sm text-muted-foreground">Manage discounts and active promotions</p>
                </div>
                <button className="flex items-center gap-2 bg-success text-success-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                    <Check size={16} /> Transaction Active
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mb-6 bg-muted rounded-lg p-1 w-fit">
                <button
                    onClick={() => setActiveTab("discounts")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "discounts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Apply Discounts
                </button>
                <button
                    onClick={() => setActiveTab("promotions")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "promotions" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Promotions
                </button>
            </div>

            {activeTab === "discounts" && (
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-card rounded-lg border p-6">
                        <h3 className="font-semibold mb-4">Discount Form</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Discount Type</label>
                                <select value={discountForm.discountType} onChange={(e) => setDiscountForm({ ...discountForm, discountType: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary">
                                    <option>Item</option><option>Order</option><option>Category</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Discount Code / Coupon</label>
                                <input type="text" value={discountForm.discountCode} onChange={(e) => setDiscountForm({ ...discountForm, discountCode: e.target.value })}
                                    placeholder="Enter discount code..." className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Discount Description</label>
                                <input type="text" placeholder="Seasonal Discount | Season" className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Discount Amount</label>
                                <div className="flex gap-2">
                                    <select className="border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary">
                                        <option>$ (Fixed)</option><option>% (Percentage)</option>
                                    </select>
                                    <input type="text" placeholder="0.00" className="flex-1 border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Applicable Items</label>
                                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary">
                                    <option>All POS</option><option>Beverages</option><option>Snacks</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Discount Reason</label>
                                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary">
                                    <option>Sale</option><option>Employee Discount</option><option>Damaged Item</option>
                                </select>
                            </div>
                            <div className="bg-warning/10 p-4 rounded-lg">
                                <p className="text-sm font-medium text-warning">Manager Approval Required</p>
                                <p className="text-xs text-muted-foreground">All loyalty and override points need to be approved</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Items Apply Further Discounts</span>
                                <button
                                    onClick={() => setDiscountForm({ ...discountForm, itemsApplyFurther: !discountForm.itemsApplyFurther })}
                                    className={`w-10 h-6 rounded-full transition-colors relative ${discountForm.itemsApplyFurther ? "bg-primary" : "bg-muted"}`}
                                >
                                    <div className={`w-4 h-4 bg-card rounded-full absolute top-1 transition-transform ${discountForm.itemsApplyFurther ? "translate-x-5" : "translate-x-1"}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Manual Discount Override</span>
                                <button
                                    onClick={() => setDiscountForm({ ...discountForm, manualOverride: !discountForm.manualOverride })}
                                    className={`w-10 h-6 rounded-full transition-colors relative ${discountForm.manualOverride ? "bg-primary" : "bg-muted"}`}
                                >
                                    <div className={`w-4 h-4 bg-card rounded-full absolute top-1 transition-transform ${discountForm.manualOverride ? "translate-x-5" : "translate-x-1"}`} />
                                </button>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Discount Expiration Date</label>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="accent-primary" />
                                    <span className="text-sm">Mandatory</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button className="px-6 py-2 border rounded-lg text-sm font-medium hover:bg-muted">Back to Checkout</button>
                            <button onClick={handleApplyDiscount} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                                Apply Discount
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-card rounded-lg border p-6">
                        <h3 className="font-semibold mb-4">Summary</h3>
                        <div className="text-sm space-y-3 mb-4">
                            <div className="flex justify-between"><span className="text-muted-foreground">Order #</span><span>ORD-001234</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>5</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>$49.95</span></div>
                        </div>
                        <div className="border-t pt-3">
                            <div className="mb-3">
                                <p className="text-xs text-muted-foreground">DISCOUNT VALUE</p>
                                <p className="text-2xl font-bold text-primary">10%</p>
                            </div>
                            <div className="bg-accent rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Check size={14} className="text-success" />
                                    <span className="text-xs font-medium">ALWAYS APPLIED</span>
                                </div>
                                <p className="text-xs text-muted-foreground">All discounts applied to specific level</p>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-sm">
                                <AlertTriangle size={14} className="text-warning" />
                                <span className="text-xs text-muted-foreground">Pricing Eligibility verification required</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "promotions" && (
                <div className="bg-card rounded-lg border p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Active Promotions</h3>
                        <p className="text-sm text-muted-foreground">
                            {promotions.filter(p => p.autoApply).length} promotions set to auto-apply
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm py-6">
                            <thead className="bg-muted text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-3 py-4 text-left">Promotion Name</th>
                                    <th className="px-3 py-4 text-left">Promotion Type</th>
                                    <th className="px-3 py-4 text-left">Qualifying Items</th>
                                    <th className="px-3 py-4 text-left">Discount</th>
                                    <th className="px-3 py-4 text-left">Quantity Rules</th>
                                    <th className="px-3 py-4 text-left">Start Date</th>
                                    <th className="px-3 py-4 text-left">End Date</th>
                                    <th className="px-3 py-4 text-left">Priority</th>
                                    <th className="px-3 py-4 text-left">Auto-Apply</th>
                                    <th className="px-3 py-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {promotions.map((promo) => (
                                    <tr key={promo.id} className="hover:bg-muted/20">
                                        <td className="px-3 py-4 font-medium">{promo.name}</td>
                                        <td className="px-3 py-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${promo.type === "BOGO" ? "bg-green-100 text-green-800" :
                                                    promo.type === "Discount" ? "bg-blue-100 text-blue-800" :
                                                        promo.type === "Mix & Match" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-purple-100 text-purple-800"
                                                }`}>
                                                {promo.type}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-muted-foreground">{promo.qualifyingItems}</td>
                                        <td className="px-3 py-2">{promo.discount}</td>
                                        <td className="px-3 py-2 text-xs text-muted-foreground">{promo.quantityRules}</td>
                                        <td className="px-3 py-2">{promo.startDate}</td>
                                        <td className="px-3 py-2">{promo.endDate}</td>
                                        <td className="px-3 py-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${promo.priority === "High" ? "bg-red-100 text-red-800" :
                                                    promo.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-blue-100 text-blue-800"
                                                }`}>
                                                {promo.priority}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2  ">
                                            {promo.autoApply ? (
                                                <Check size={16} className="text-success" />
                                            ) : (
                                                <X size={16} className="text-muted-foreground" />
                                            )}
                                        </td>


                                     
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}



            {/* Validate Discount Modal */}
            {showValidateModal && (
                <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">
                                {validateStep === 0 && "Validate Discount"}
                                {validateStep === 1 && "Validate Discount"}
                                {validateStep === 2 && "Authorize"}
                                {validateStep === 3 && "Review Discount"}
                                {validateStep === 4 && "Discount Applied"}
                            </h3>
                            <button onClick={() => setShowValidateModal(false)} className="p-1 hover:bg-muted rounded">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center gap-2 mb-6">
                            {["Approve", "Validate", "Confirm", "Review", "Complete"].map((step, i) => (
                                <div key={step} className={`flex-1 h-1 rounded-full ${i <= validateStep ? "bg-primary" : "bg-muted"}`} />
                            ))}
                        </div>

                        {validateStep === 0 && (
                            <div className="space-y-3">
                                <div className="bg-accent p-3 rounded-lg">
                                    <p className="text-sm font-medium text-accent-foreground">✓ Form Validation Required</p>
                                    <p className="text-xs text-muted-foreground">Please ensure all discount details are correct before proceeding.</p>
                                </div>
                                <div className="text-sm space-y-2">
                                    <p className="font-medium">Discount Summary</p>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Discount Amount</span><span>10%</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Discount Type</span><span>Item</span></div>
                                </div>
                            </div>
                        )}
                        {validateStep === 1 && (
                            <div className="space-y-3">
                                <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                                    <p className="text-sm font-medium text-success">✓ Form Validation Passed</p>
                                </div>
                                <div className="bg-warning/10 p-3 rounded-lg border border-warning/20">
                                    <p className="text-sm font-medium text-warning">⚠ Manager Authorization Required</p>
                                </div>
                                <div className="bg-accent p-3 rounded-lg">
                                    <p className="text-sm font-medium text-accent-foreground">✓ Validation Done</p>
                                    <p className="text-xs text-muted-foreground">All validation checks passed</p>
                                </div>
                            </div>
                        )}
                        {validateStep === 2 && (
                            <div className="space-y-3">
                                <div className="bg-warning/10 p-3 rounded-lg border border-warning/20">
                                    <p className="text-sm font-medium text-warning">⚠ Manager Authorization Required</p>
                                    <p className="text-xs text-muted-foreground">Please have your manager PIN to continue.</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Manager PIN</label>
                                    <input type="password" placeholder="Enter PIN" className="w-full border rounded-lg px-3 py-2 text-sm bg-card outline-none focus:ring-1 focus:ring-primary" />
                                </div>
                            </div>
                        )}
                        {validateStep === 3 && (
                            <div className="space-y-3">
                                <div className="bg-accent p-3 rounded-lg">
                                    <p className="text-sm font-medium">Ready to Apply Discount</p>
                                </div>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Manager PIN</span><span>Verified ✓</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>10%</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>5 items</span></div>
                                </div>
                            </div>
                        )}
                        {validateStep === 4 && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-success" />
                                </div>
                                <p className="font-bold text-lg mb-2">Discount Applied Successfully!</p>
                                <p className="text-sm text-muted-foreground mb-4">The discount of 10% has been applied to the transaction.</p>
                                <div className="text-sm space-y-1">
                                    <p><span className="text-muted-foreground">Transaction ID:</span> #TXN-000123</p>
                                    <p><span className="text-muted-foreground">Applied at:</span> 2:45 PM</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowValidateModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-muted">
                                {validateStep === 4 ? "Close" : "Back"}
                            </button>
                            {validateStep < 4 && (
                                <button onClick={advanceValidation} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                                    {validateStep === 3 ? "Apply Discount" : "Continue"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountsPromotions;
