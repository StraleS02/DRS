import type { JSX } from "react";
import { useAuth } from "../features/auth/useAuth";
import { Navigate } from "react-router-dom";

type PublicRouteProps = {
    children: JSX.Element;
};

const PublicRoute = ({children}:PublicRouteProps) => {
    
    const {user} = useAuth();

    if(user) {
        return <Navigate to="/" replace></Navigate>
    }

    return children;
}
export default PublicRoute;