import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Check, X } from "lucide-react";
import { useCategories } from "@/hooks/inv_hooks/useCategory";
import ViewPromotionSheet from "./ViewPromotionSheet";


const PromotionsTable = ({
    promotions,
    searchTerm,
    onView,
    onEdit,
    onDelete,
    deleteLoading
}) => {
    const [categories, setCategories] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    console.log("promotions", promotions)

    // Filter promotions based on search
    useEffect(() => {
        if (Array.isArray(promotions)) {
            const filtered = promotions.filter(promo =>
                promo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                promo.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                promo.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPromotions(filtered);
        } else {
            setFilteredPromotions([]);
        }
    }, [promotions, searchTerm]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

   
    // Get category names
    const getCategoryNames = (categoriesArray) => {
        if (!categoriesArray || !categoriesArray.length) return "All Items";

        return categoriesArray.map(cat => {
            // If cat is an object with categoryName, use it
            if (cat?.categoryName) return cat.categoryName;

            // If cat is just an ID string, fallback
            const found = categories.find(c => c._id === cat);
            return found ? found.name : cat;
        }).join(", ");
    };


    const getTypeColor = (type) => {
        const colors = {
            "BOGO": "bg-green-100 text-green-800",
            "Discount": "bg-blue-100 text-blue-800",
            "Mix & Match": "bg-amber-100 text-amber-800",
        };
        return colors[type] || "bg-purple-100 text-purple-800";
    };

    const getPriorityColor = (priority) => {
        const colors = {
            "High": "bg-red-100 text-red-800",
            "Medium": "bg-amber-100 text-amber-800",
            "Low": "bg-blue-100 text-blue-800",
        };
        return colors[priority] || "bg-gray-100 text-gray-800";
    };

    const getStatusColor = (status) => {
        return status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800";
    };

    const handleView = (promo) => {
        setSelectedPromo(promo);
        setIsSheetOpen(true);
    };

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="min-w-full text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Code</th>
                        <th className="px-4 py-3 text-left">Qualifying Items</th>
                        <th className="px-4 py-3 text-left">Discount</th>
                        <th className="px-4 py-3 text-left">Valid Period</th>
                        <th className="px-4 py-3 text-left">Priority</th>
                        <th className="px-4 py-3 text-left">Auto</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {filteredPromotions.map((promo) => (
                        <tr key={promo._id || promo.id} className="hover:bg-muted/40">
                            <td className="px-4 py-4 font-medium">{promo.name}</td>
                            <td className="px-4 py-4">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTypeColor(promo.type)}`}>
                                    {promo.type}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-xs font-mono">
                                {promo.couponCode || "—"}
                            </td>
                            <td className="px-4 py-4 text-xs text-muted-foreground max-w-[200px] truncate">
                                {getCategoryNames(promo.qualifyingCategories)}
                            </td>
                            <td className="px-4 py-4 font-medium">
                                {promo.amountValue}{promo.amountType === "Percentage" ? "%" : "$"}
                                {promo.discountDescription &&
                                    <span className="text-xs text-muted-foreground ml-1">({promo.discountDescription})</span>
                                }
                            </td>
                            <td className="px-4 py-4 text-xs">
                                {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                            </td>
                            <td className="px-4 py-4">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(promo.priority)}`}>
                                    {promo.priority}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                                {promo.autoApply ? (
                                    <Check size={16} className="text-green-600 mx-auto" />
                                ) : (
                                    <X size={16} className="text-muted-foreground mx-auto" />
                                )}
                            </td>
                            <td className="px-4 py-4">
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(promo.status)}`}>
                                    {promo.status}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleView(promo)}
                                        className="p-1 hover:bg-muted rounded"
                                        title="View"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(promo)}
                                        className="p-1 hover:bg-muted rounded"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(promo._id || promo.id)}
                                        className="p-1 hover:bg-muted rounded text-red-600"
                                        title="Delete"
                                        disabled={deleteLoading}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredPromotions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    {searchTerm ? "No promotions match your search" : "No promotions yet. Create your first one!"}
                </div>
            )}
            {/* Sheet modal */}
            <ViewPromotionSheet
                promotion={selectedPromo}
                open={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            />
        </div>
    );
};

export default PromotionsTable;