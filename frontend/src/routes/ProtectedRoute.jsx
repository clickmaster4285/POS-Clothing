import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // Make sure path is correct
import Loading from "../pages/Loading"; // Import your loading component

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <Loading />; // Show loading while checking auth
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;