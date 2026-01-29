import { Routes, Route } from "react-router-dom";

import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Branches from "../pages/Branches";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
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
        </Routes>
    );
};

export default AppRoutes;
