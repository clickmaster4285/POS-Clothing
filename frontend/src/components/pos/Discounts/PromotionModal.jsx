import { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories} from "@/hooks/inv_hooks/useCategory";
import { Checkbox } from "@/components/ui/checkbox";

const PromotionModal = ({
    isEditing,
    selectedPromo,
    onClose,
    onCreate,
    onUpdate,
    isLoading
}) => {

    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();

    const category = categoriesData?.data || []
 

    const [categories, setCategories] = useState([]);
    const [promoForm, setPromoForm] = useState({
        name: "",
        type: "Discount",
        couponCode: "",
        qualifyingCategories: [],
        qualifyingProducts: [],
        discountDescription: "",
        amountType: "Percentage",
        amountValue: "",
        quantityRules: "",
        startDate: "",
        endDate: "",
        hasExpiration: false,
        expirationDate: "",
        priority: "Medium",
        autoApply: true,
        allowFurtherDiscounts: true,
        status: "active",
    });

    // Load mock categories
    useEffect(() => {
        if (categoriesData?.data) {
            setCategories(categoriesData.data);
        }
    }, [categoriesData]);




    // Load promotion data when editing
    useEffect(() => {
        if (isEditing && selectedPromo) {
            setPromoForm({
                name: selectedPromo.name || "",
                type: selectedPromo.type || "Discount",
                couponCode: selectedPromo.couponCode || "",
                qualifyingCategories: selectedPromo.qualifyingCategories || [],
                qualifyingProducts: selectedPromo.qualifyingProducts || [],
                discountDescription: selectedPromo.discountDescription || "",
                amountType: selectedPromo.amountType || "Percentage",
                amountValue: selectedPromo.amountValue || "",
                quantityRules: selectedPromo.quantityRules || "",
                startDate: selectedPromo.startDate ? new Date(selectedPromo.startDate).toISOString().split('T')[0] : "",
                endDate: selectedPromo.endDate ? new Date(selectedPromo.endDate).toISOString().split('T')[0] : "",
                hasExpiration: selectedPromo.hasExpiration || false,
                expirationDate: selectedPromo.expirationDate ? new Date(selectedPromo.expirationDate).toISOString().split('T')[0] : "",
                priority: selectedPromo.priority || "Medium",
                autoApply: selectedPromo.autoApply !== undefined ? selectedPromo.autoApply : true,
                allowFurtherDiscounts: selectedPromo.allowFurtherDiscounts !== undefined ? selectedPromo.allowFurtherDiscounts : true,
                status: selectedPromo.status || "active",
            });
        }
    }, [isEditing, selectedPromo]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPromoForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleCategorySelect = (categoryId) => {
        setPromoForm(prev => {
            const isSelected = prev.qualifyingCategories.includes(categoryId);
            return {
                ...prev,
                qualifyingCategories: isSelected
                    ? prev.qualifyingCategories.filter(id => id !== categoryId)
                    : [...prev.qualifyingCategories, categoryId]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const promotionData = {
            ...promoForm,
            startDate: promoForm.startDate ? new Date(promoForm.startDate) : null,
            endDate: promoForm.endDate ? new Date(promoForm.endDate) : null,
            expirationDate: promoForm.hasExpiration ? new Date(promoForm.expirationDate) : null,
            amountValue: parseFloat(promoForm.amountValue) || 0,
        };

        try {
            if (isEditing && selectedPromo) {
                await onUpdate({ id: selectedPromo._id, data: promotionData });
            } else {
                await onCreate(promotionData);
            }
            onClose();
            alert(`Promotion ${isEditing ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} promotion: ` + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg">
                        {isEditing ? "Edit Promotion" : "Create New Promotion"}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Basic Info */}
                        <div className="col-span-2">
                            <label className="text-sm font-medium mb-1 block">Promotion Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter promotion name"
                                value={promoForm.name}
                                onChange={handleInputChange}
                                required
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Type *</label>
                            <select
                                name="type"
                                value={promoForm.type}
                                onChange={handleInputChange}
                                required
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="Discount">Discount</option>
                                <option value="BOGO">BOGO</option>
                                <option value="Mix & Match">Mix & Match</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Coupon Code</label>
                            <input
                                type="text"
                                name="couponCode"
                                value={promoForm.couponCode}
                                onChange={handleInputChange}
                                placeholder="SUMMER2024"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>

                        {/* Discount Info */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">Amount Type *</label>
                            <select
                                name="amountType"
                                value={promoForm.amountType}
                                onChange={handleInputChange}
                                required
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="Fixed">Fixed ($)</option>
                                <option value="Percentage">Percentage (%)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Amount Value *</label>
                            <input
                                type="number"
                                name="amountValue"
                                value={promoForm.amountValue}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-medium mb-1 block">Discount Description</label>
                            <input
                                type="text"
                                name="discountDescription"
                                value={promoForm.discountDescription}
                                onChange={handleInputChange}
                                placeholder="e.g., 20% off all items, Buy 1 Get 1 Free"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>

                        {/* <div className="col-span-2">
                            <label className="text-sm font-medium mb-1 block">Quantity Rules</label>
                            <input
                                type="text"
                                name="quantityRules"
                                value={promoForm.quantityRules}
                                onChange={handleInputChange}
                                placeholder="e.g., Min 2 items, No minimum"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div> */}

                        {/* Validity Period */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={promoForm.startDate}
                                onChange={handleInputChange}
                                required
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={promoForm.endDate}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>

                        {/* Priority and Status */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">Priority</label>
                            <select
                                name="priority"
                                value={promoForm.priority}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Status</label>
                            <select
                                name="status"
                                value={promoForm.status}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                       
                        {/* Checkboxes */}
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Checkbox
                                    checked={promoForm.autoApply}
                                    onCheckedChange={(checked) =>
                                        setPromoForm(prev => ({ ...prev, autoApply: checked }))
                                    }
                                />
                                <span className="text-sm">Auto-apply to transactions</span>
                            </div>

                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Checkbox
                                    checked={promoForm.allowFurtherDiscounts}
                                    onCheckedChange={(checked) =>
                                        setPromoForm(prev => ({ ...prev, allowFurtherDiscounts: checked }))
                                    }
                                />
                                <span className="text-sm">Allow further discounts</span>
                            </div>
                        </div>


                        {/* Expiration */}
                        {/* <div className="col-span-2 border rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Checkbox
                                    checked={promoForm.hasExpiration}
                                    onCheckedChange={(checked) =>
                                        setPromoForm(prev => ({ ...prev, hasExpiration: checked }))
                                    }
                                />
                                <span className="text-sm font-medium">Set expiration date</span>
                            </div>


                            {promoForm.hasExpiration && (
                                <input
                                    type="date"
                                    name="expirationDate"
                                    value={promoForm.expirationDate}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                                />
                            )}
                        </div> */}

                        {/* Qualifying Categories */}
                        <div className="col-span-2">
                            <label className="text-sm font-medium mb-2 block">Qualifying Categories</label>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                                {categories.map(cat => (
                                    <div key={cat._id} className="flex items-center gap-2 text-sm">
                                        <Checkbox
                                            checked={promoForm.qualifyingCategories.includes(cat._id)}
                                            onCheckedChange={(checked) =>
                                                setPromoForm(prev => {
                                                    const isSelected = prev.qualifyingCategories.includes(cat._id);
                                                    return {
                                                        ...prev,
                                                        qualifyingCategories: checked
                                                            ? [...prev.qualifyingCategories, cat._id]
                                                            : prev.qualifyingCategories.filter(id => id !== cat._id)
                                                    };
                                                })
                                            }
                                        />
                                        <span>{cat.categoryName}</span>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <RefreshCw size={16} className="animate-spin mr-2" />}
                            {isEditing ? "Update Promotion" : "Create Promotion"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromotionModal;