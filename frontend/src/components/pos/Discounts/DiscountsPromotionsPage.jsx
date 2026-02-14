import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    usePromotions,
    useCreatePromotion,
    useUpdatePromotion,
    useDeletePromotion,
} from "@/hooks/pos_hooks/useDiscountPromotion";
import PromotionsHeader from "./PromotionsHeader";
import PromotionsTable from "./PromotionsTable";
import PromotionModal from "./PromotionModal";
import ValidationModal from "./ValidationModal";
import { RefreshCw } from "lucide-react";

const DiscountsPromotionsPage = () => {
    const [activeTab, setActiveTab] = useState("promotions");
    const [showValidateModal, setShowValidateModal] = useState(false);
    const [validateStep, setValidateStep] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [managerPin, setManagerPin] = useState("");

    // API Hooks
    const {
        data: response,
        isLoading,
        error,
        refetch
    } = usePromotions();

    // Extract promotions array from response
    const promotions = response?.success && Array.isArray(response.data)
        ? response.data
        : [];

    
  
    const createPromotion = useCreatePromotion();
    const updatePromotion = useUpdatePromotion();
    const deletePromotion = useDeletePromotion();

    // Form state for manual discount
    const [discountForm, setDiscountForm] = useState({
        discountType: "ITEM",
        couponCode: "",
        discountDescription: "",
        amountType: "Fixed",
        amountValue: "",
        applicableTo: "ALL",
        selectedCategories: [],
        selectedProducts: [],
        discountReason: "Sale",
        managerApproval: true,
        allowFurtherDiscounts: true,
        manualOverride: false,
        hasExpiration: false,
        expirationDate: "",
    });

    // Handle Apply Discount
    const handleApplyDiscount = () => {
        if (!discountForm.amountValue || !discountForm.discountDescription) {
            alert("Please fill all required fields");
            return;
        }
        setShowValidateModal(true);
        setValidateStep(0);
    };

    const advanceValidation = () => {
        if (validateStep < 4) {
            if (validateStep === 2 && !managerPin) {
                alert("Please enter manager PIN");
                return;
            }
            setValidateStep(validateStep + 1);
        } else {
            alert("Discount applied to transaction!");
            setShowValidateModal(false);
            setValidateStep(0);
            setManagerPin("");
            setDiscountForm({
                ...discountForm,
                couponCode: "",
                discountDescription: "",
                amountValue: "",
            });
        }
    };

    const closeValidationModal = () => {
        setShowValidateModal(false);
        setValidateStep(0);
        setManagerPin("");
    };

    return (
        <div className="">
            {/* Breadcrumb */}
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-1">
                <span>Home</span><span>›</span><span>Point of Sale</span><span>›</span>
                <span className="text-primary font-medium">Discounts & Promotions</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold">Discounts & Promotions</h1>
                    <p className="text-sm text-muted-foreground">Manage on-the-spot discounts and store promotions</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => {
                        setIsEditing(false);
                        setShowPromoModal(true);
                    }}>
                        New Promotion
                    </Button>
                </div>
            </div>

            {/* Promotions Tab */}
            {activeTab === "promotions" && (
                <div className="space-y-4">
                    <PromotionsHeader
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    {isLoading && (
                        <div className="text-center py-12">
                            <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">Loading promotions...</p>
                        </div>
                    )}

                    {!isLoading && (
                        <PromotionsTable
                            promotions={promotions}
                            searchTerm={searchTerm}
                            onView={setSelectedPromo}
                            onEdit={(promo) => {
                                setSelectedPromo(promo);
                                setIsEditing(true);
                                setShowPromoModal(true);
                            }}
                            onDelete={deletePromotion.mutateAsync}
                            deleteLoading={deletePromotion.isLoading}
                        />
                    )}
                </div>
            )}

            {/* Promotion Modal */}
            {showPromoModal && (
                <PromotionModal
                    isEditing={isEditing}
                    selectedPromo={selectedPromo}
                    onClose={() => {
                        setShowPromoModal(false);
                        setSelectedPromo(null);
                        setIsEditing(false);
                    }}
                    onCreate={createPromotion.mutateAsync}
                    onUpdate={updatePromotion.mutateAsync}
                    isLoading={createPromotion.isLoading || updatePromotion.isLoading}
                />
            )}

            {/* Validation Modal */}
            {showValidateModal && (
                <ValidationModal
                    step={validateStep}
                    discountForm={discountForm}
                    managerPin={managerPin}
                    setManagerPin={setManagerPin}
                    calculatedDiscount={`${discountForm.amountValue}${discountForm.amountType === "Percentage" ? "%" : "$"}`}
                    onClose={closeValidationModal}
                    onAdvance={advanceValidation}
                />
            )}
        </div>
    );
};

export default DiscountsPromotionsPage;