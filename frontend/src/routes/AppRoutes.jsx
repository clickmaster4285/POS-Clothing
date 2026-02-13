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
import UserPage from '../pages/User';
import StaffCreatePage from '../pages/users/create/page';
import StaffFormPage from '../pages/users/[id]/edit/page'
import StaffDetailPage from '../pages/users/[id]/page'
import CustomerPage from '../pages/pos/customer/Customers';
import CustomerCreatePage from '../pages/pos/customer/create/page';
import CustomerProfilePage from '../pages/pos/customer/[id]/page'
import CustomerEditPage from '../pages/pos/customer/[id]/edit/page'
import SpecialItems from '../pages/pos/SpecialItems'
import DiscountsPromotions from '../pages/pos/DiscountAndPromotions';
import TransactionPage from '../pages/pos/Transaction'
import ReturnsExchanges from '../pages/pos/ReturnExchange'
import ReciptManagement from '../pages/pos/RecieptManagement'

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const AppRoutes = () => {
    const { user, isAuthenticated } = useAuth();
    const role = user?.role?.toLowerCase() || 'customer'; // default role

    return (
        <Routes>
            {/* Public route */}
            <Route
                path="/login"
                element={
                    <AuthLayout>
                        <Auth />
                    </AuthLayout>
                }
            />

            {/* Role-based protected routes */}
            <Route
                path={`/${role}/dashboard`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/pos/transaction`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <TransactionPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/pos/customer-info`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CustomerPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/pos/create`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CustomerCreatePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/pos/:id/detail`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CustomerProfilePage />
                        </MainLayout>
                    </ProtectedRoute>
                }

            />

            <Route
                path={`/${role}/pos/:id/edit`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CustomerEditPage />
                        </MainLayout>
                    </ProtectedRoute>
                }

            />

            <Route
                path={`/${role}/pos/discounts`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <DiscountsPromotions />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path={`/${role}/pos/special-items`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <SpecialItems />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path={`/${role}/pos/returns`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ReturnsExchanges />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path={`/${role}/pos/receipts`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ReciptManagement />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/user-management`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <UserPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/branches`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Branches />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/users/create`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <StaffCreatePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/users/:id/edit`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <StaffFormPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/users/:id`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <StaffDetailPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />


            <Route
                path={`/${role}/supplier`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <SupplierPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/inventory/products`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Products />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/inventory/categories`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CategoriesBrandsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/inventory/barcode-management`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <BarcodeManagementPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/inventory/purchase-orders`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <PurchaseOrdersPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/inventory/stock-audit`}
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <StockAuditPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={`/${role}/inventory/stock`}
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
