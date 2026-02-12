"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { List, ArrowUpDown, Truck, ChevronLeft } from "lucide-react"

// Custom hooks
import { useProducts } from "@/hooks/inv_hooks/useProducts"
import { useBrands } from "@/hooks/inv_hooks/useBrand"
import { useCategories } from "@/hooks/inv_hooks/useCategory"
import { useSuppliers } from "@/hooks/useSupplier"
import { useStock, useAdjustments, useTransfers, useAdjustStock, useTransferStock, useLowStockAlerts, useStockHistory } from "@/hooks/inv_hooks/useStock"
import { useBranches } from "@/hooks/useBranches"

// Components
import { PageHeader } from "./PageHeader"
import { StockOverviewTab } from "./StockOverviewTab"
import { AdjustmentForm } from "./AdjustmentForm"
import { TransferForm } from "./TransferForm"

export default function StockPage() {
    // Data fetching
    const { data: productsData, isLoading: productsLoading } = useProducts()
    const { data: brandsData, isLoading: branchesLoading } = useBrands()
    const { data: categoriesData } = useCategories()
    const { data: suppliersData } = useSuppliers()
    const { data: stockData, isLoading: stockLoading } = useStock()
    const { data: adjustmentData } = useAdjustments()
    const { data: transferData } = useTransfers()
    const { data: branchesData } = useBranches()

    const { data: lowStock } = useLowStockAlerts
    const { data: stockHistory } = useStockHistory

    // State
    const [activeTab, setActiveTab] = useState("overview")
    const [searchTerm, setSearchTerm] = useState("")
    const [branchFilter, setBranchFilter] = useState("all")
    const [stocks, setStocks] = useState([])
    const [adjustments, setAdjustments] = useState([])
    const [transfers, setTransfers] = useState([])

    // Forms
    const [adjustForm, setAdjustForm] = useState({
        type: "add",
        reason: "",
        branch: "",
        items: [
            { product: "", variant: "", color: "", quantity: "" } // add color here
        ]
    })


    const [transferForm, setTransferForm] = useState({
        fromBranch: "",
        toBranch: "",
        product: "",
        variant: "",
        quantity: "",
        notes: "",
    })

    // Mutations
    const { mutate: adjustStockMutate, isPending: adjusting } = useAdjustStock();
    const { mutate: transferStockMutate, isPending: transferring } = useTransferStock();

    // Data processing
    const branches = branchesData?.data || []
    const products = productsData?.data || []
    const brands = brandsData?.data || []
    const categories = categoriesData?.data || []
    const suppliers = suppliersData?.data || []

    useEffect(() => {
        if (stockData?.data) setStocks(stockData.data)
    }, [stockData])

    useEffect(() => {
        if (adjustmentData?.data) setAdjustments(adjustmentData.data)
    }, [adjustmentData])

    useEffect(() => {
        if (transferData?.data) setTransfers(transferData.data)
    }, [transferData])

    // Handlers
    const resetAdjustForm = () => setAdjustForm({
        type: "add",
        reason: "",
        branch: "",
        items: [
            { product: "", variant: "", color: "", quantity: "" }
        ]
    })

    const resetTransferForm = () => setTransferForm({ fromBranch: "", toBranch: "", product: "", variant: "", quantity: "", notes: "" })

    const lowStockItems = stocks.filter((s) => s.isLowStock)
    const totalValue = stocks.reduce((acc, s) => acc + s.stockValue, 0)

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": case "approved": return "bg-green-50 text-green-700 border-green-200"
            case "pending": case "draft": return "bg-amber-50 text-amber-700 border-amber-200"
            case "in-transit": return "bg-blue-50 text-blue-700 border-blue-200"
            case "rejected": case "cancelled": return "bg-red-50 text-red-700 border-red-200"
            default: return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    const handleAddAdjustment = () => {
        if (!adjustSummary.isValid) {
            toast.error("Please fill all fields");
            return;
        }

        // Prepare items for backend
        const itemsToAdjust = adjustForm.items.map(row => ({
            product: row.product,
            color: row.color,
            variantId: row.variant,
            quantity: Number(row.quantity)
        }));

       

        adjustStockMutate(
            {
                branchId: adjustForm.branch,
                data: {
                    adjustmentType: adjustForm.type,
                    reason: adjustForm.reason,
                    remarks: adjustForm.reason,
                    items: itemsToAdjust
                }
            },
            {
                onSuccess: (data) => {
                    toast.success("Adjustment submitted!");
                    resetAdjustForm();
                    setActiveTab("overview");

                    // Merge the newly added/adjusted stock into frontend stocks
                    setStocks(prevStocks => {
                        const updatedStocks = [...prevStocks];

                        itemsToAdjust.forEach(item => {
                            const existingStockIndex = updatedStocks.findIndex(
                                s => s.product === item.product && s.variantId === item.variantId && s.branch === adjustForm.branch
                            );

                            const branchLocation = branches.find(b => b._id === adjustForm.branch)?.branch_name + ", ";

                            if (existingStockIndex >= 0) {
                                // Stock exists → update quantity
                                updatedStocks[existingStockIndex].currentStock += item.quantity;
                                updatedStocks[existingStockIndex].availableStock += item.quantity;
                            } else {
                                // Stock does not exist → create new
                                updatedStocks.push({
                                    _id: `${item.product}-${item.variantId}-${adjustForm.branch}-${Date.now()}`, // temporary ID for frontend
                                    product: item.product,
                                    variantId: item.variantId,
                                    branch: adjustForm.branch,
                                    location: branchLocation,
                                    currentStock: item.quantity,
                                    availableStock: item.quantity,
                                    damagedStock: 0,
                                    inTransitStock: 0,
                                    reservedStock: 0,
                                    isLowStock: false,
                                    stockAlerts: []
                                });
                            }
                        });

                        return updatedStocks;
                    });
                }
            }
        );
    };

    const handleAddTransfer = () => {
        if (!transferSummary.isValid) { toast.error("Check form fields"); return; }
        transferStockMutate({
            fromBranch: transferForm.fromBranch,
            toBranch: transferForm.toBranch,
            items: [{ product: transferForm.product, variantId: transferForm.variant, quantity: Number(transferForm.quantity) }],
            notes: transferForm.notes
        }, {
            onSuccess: () => { toast.success("Transfer created!"); resetTransferForm(); setActiveTab("overview"); }
        });
    };

    // Summaries
    const selectedAdjustProduct = products.find(p => p._id === adjustForm.product)
    const adjustSummary = {
        isValid:
            adjustForm.branch &&
            adjustForm.reason &&
            adjustForm.items.length > 0 &&
            adjustForm.items.every(
                row => row.product && row.variant && row.quantity && Number(row.quantity) > 0
            ),
        typeLabel: adjustForm.type === "add" ? "Add Stock" : adjustForm.type === "remove" ? "Remove Stock" : "Damage",
        product: (adjustForm.items || []).map(row => {
            const prod = products?.find(p => p._id === row.product);
            return prod ? prod.productName : "Not selected";
        }).join(", ")
    };



    const selectedTransferProduct = products.find(p => p._id === transferForm.product)
    const transferSummary = {
        product: selectedTransferProduct?.productName || "Not selected",
        isValid: transferForm.fromBranch && transferForm.toBranch && transferForm.product && transferForm.variant && transferForm.quantity && transferForm.fromBranch !== transferForm.toBranch,
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title={activeTab === "overview" ? "Stock Management" : activeTab === "adjustment-form" ? "New Adjustment" : "New Transfer"}
                    description="Manage stock levels, adjustments, and transfers"
                    lowStockCount={lowStockItems.length}
                />

                {/* ACTION BUTTONS: These act as the "Tabs" now */}
                <div className="flex items-center gap-2">
                    {activeTab === "overview" ? (
                        <>
                            <Button
                               
                                onClick={() => setActiveTab("adjustment-form")}
                                className="gap-2"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                Stock Adjustment
                            </Button>
                            {/* <Button
                                onClick={() => setActiveTab("transfer-form")}
                                className="gap-2"
                            >
                                <Truck className="h-4 w-4" />
                                Stock Transfer
                            </Button> */}
                        </>
                    ) : (
                        <Button variant="ghost" onClick={() => setActiveTab("overview")} className="gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Back to Overview
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Hidden TabsList because we are using buttons above */}
                <TabsList className="hidden">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="adjustment-form">Adjustment</TabsTrigger>
                    <TabsTrigger value="transfer-form">Transfer</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                    <StockOverviewTab
                        stocks={stocks}
                        lowStockItems={lowStockItems}
                        totalValue={totalValue}
                        transfers={transfers}
                        adjustments={adjustments}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        branchFilter={branchFilter}
                        setBranchFilter={setBranchFilter}
                        branches={branches}
                        setAdjustForm={setAdjustForm}
                        setTransferForm={setTransferForm}
                        setActiveTab={setActiveTab}
                        getStatusColor={getStatusColor}
                    />
                </TabsContent>

                <TabsContent value="adjustment-form" className="mt-0">
                    <AdjustmentForm
                        adjustForm={adjustForm}
                        setAdjustForm={setAdjustForm}
                        products={products}
                        productsLoading={productsLoading}
                        branches={branches}
                        adjustments={adjustments}
                        adjustSummary={adjustSummary}
                        handleAddAdjustment={handleAddAdjustment}
                        resetAdjustForm={resetAdjustForm}
                        getStatusColor={getStatusColor}
                    />
                </TabsContent>

                <TabsContent value="transfer-form" className="mt-0">
                    <TransferForm
                        transferForm={transferForm}
                        setTransferForm={setTransferForm}
                        products={products}
                        productsLoading={productsLoading}
                        branches={branches}
                        transfers={transfers}
                        transferSummary={transferSummary}
                        handleAddTransfer={handleAddTransfer}
                        resetTransferForm={resetTransferForm}
                        getStatusColor={getStatusColor}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}