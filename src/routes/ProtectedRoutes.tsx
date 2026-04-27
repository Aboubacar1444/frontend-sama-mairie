import { useLoading } from "@/context/LoadingContext";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    // const [loading] = useAuthState(auth);
    // if (loading) {
    //     return (
    //         <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
    //             <Loader2 className="h-11 w-11 animate-spin text-neutral-900" />
    //             <p className="mt-4 text-neutral-900 font-semibold animate-pulse text-xl">Loading...</p>
    //         </div>
    //     );
    // }

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <Outlet />
    );
};

export default ProtectedRoutes;