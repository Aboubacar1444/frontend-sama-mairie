import { auth } from "@/firebase";
import { PageLoader } from "@/loading/PageLoader";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoutes = () => {
    const token = localStorage.getItem("token");
    const [user, loading] = useAuthState(auth);

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    if (loading) {
        return <PageLoader />;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default GuestRoutes;
