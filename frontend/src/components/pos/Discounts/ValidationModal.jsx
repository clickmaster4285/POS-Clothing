import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ValidationModal = ({
    step,
    discountForm,
    managerPin,
    setManagerPin,
    calculatedDiscount,
    onClose,
    onAdvance
}) => {
    const getStepTitle = () => {
        const titles = ["Validate Discount", "Validation Passed", "Authorize", "Review & Apply", "Discount Applied"];
        return titles[step] || "Validate Discount";
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg">{getStepTitle()}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="flex gap-2 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
                    ))}
                </div>

                {/* Step Content */}
                {step === 0 && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium">Step 1: Confirm details</p>
                            <p className="text-xs text-muted-foreground mt-1">Make sure all entered values are correct.</p>
                        </div>
                        <div className="text-sm space-y-2 border-t pt-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <span>{discountForm.discountType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount</span>
                                <span>{calculatedDiscount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Description</span>
                                <span className="text-right">{discountForm.discountDescription}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Reason</span>
                                <span>{discountForm.discountReason}</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-800">✓ Validation checks passed</p>
                        </div>
                        {discountForm.discountReason !== "Sale" && (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <p className="text-sm font-medium text-yellow-800">⚠ Manager approval needed</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-yellow-800">Manager PIN required</p>
                            <p className="text-xs text-yellow-700 mt-1">Enter supervisor PIN to authorize this discount.</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-1.5">Manager PIN</label>
                            <input
                                type="password"
                                value={managerPin}
                                onChange={(e) => setManagerPin(e.target.value)}
                                placeholder="••••••"
                                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-medium">Ready to apply</p>
                        </div>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="font-medium">{calculatedDiscount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Description</span>
                                <span>{discountForm.discountDescription}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Reason</span>
                                <span>{discountForm.discountReason}</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
                            <Check size={40} className="text-green-600" />
                        </div>
                        <p className="text-xl font-bold mb-2">Discount Applied!</p>
                        <p className="text-sm text-muted-foreground mb-6">
                            {calculatedDiscount} {discountForm.discountType === "ORDER" ? "order" : "item"} discount added successfully.
                        </p>
                    </div>
                )}

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 mt-8">
                    <Button variant="outline" onClick={onClose}>
                        {step === 4 ? "Close" : "Cancel"}
                    </Button>
                    {step < 4 && (
                        <Button onClick={onAdvance}>
                            {step === 3 ? "Confirm & Apply" : "Continue"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ValidationModal;