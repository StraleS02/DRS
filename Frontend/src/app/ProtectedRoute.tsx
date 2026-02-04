import { useEffect, type JSX } from "react";
import { useAuth } from "../features/auth/useAuth";
import Loading from "../components/loading/Loading";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
    children: JSX.Element;
};

const ProtectedRoute = ({children}:ProtectedRouteProps) => {
    
    const {user, loading, validate} = useAuth();
    const location = useLocation();

    useEffect(() => {
        validate();
    }, [location.pathname]);

    if(loading) return <Loading size="large" theme="dark"></Loading>

    if(!user) return <Navigate to="/login" replace></Navigate> 
    
    return (
        <>{children}</>
    );
}
export default ProtectedRoute;