import { auth } from "@/firebase";
import { PageLoader } from "@/loading/PageLoader";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
    const token = localStorage.getItem("token");
    const [user, loading] = useAuthState(auth);

    if (token) {
        return <Outlet />;
    }

    if (loading) {
        return <PageLoader />;
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
