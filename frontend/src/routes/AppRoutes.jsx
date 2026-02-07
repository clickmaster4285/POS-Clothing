import { Routes, Route } from "react-router-dom";

import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Branches from "../pages/Branches";
import Products from "../pages/Inventory/Products";
import CategoriesBrandsPage from "../pages/Inventory/Category";
import BarcodeManagementPage from "../pages/Inventory/Barcodes";
import PurchaseOrdersPage from "../pages/Inventory/PurchaseOrder";
import StockAuditPage from "../pages/Inventory/StockAudit";
import StockManagementPage from "../pages/Inventory/StockManagement";
import SupplierPage from '../pages/Suppliers';


import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/"
                element={
                    <AuthLayout>
                        <Auth />
                    </AuthLayout>
                }
            />

            {/* Protected routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/branches"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Branches />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/supplier"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <SupplierPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/inventory/products"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Products />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory/categories"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CategoriesBrandsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory/barcode-management"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <BarcodeManagementPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory/purchase-orders"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <PurchaseOrdersPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory/stock-audit"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <StockAuditPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory/stock"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <StockManagementPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
