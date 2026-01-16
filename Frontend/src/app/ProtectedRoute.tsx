import { useEffect, type JSX } from "react";
import type { Role } from "../lib/constants/roles";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../features/auth";

type ProtectedRouteProps = {
    children: JSX.Element;
    requiredRoles: Role[];
};

const ProtectedRoute = ({children, requiredRoles}:ProtectedRouteProps) => {
    const {token, user, handleLogout, loading} = useAuth();

    useEffect(() => {
        if(!isAuthenticated() && token) {
            handleLogout();
        }
    }, []);

    if(loading) {
        return <div>Loading...</div>;
    }

    if(!isAuthenticated() || !token) {
        return (<Navigate to="/" replace/>);

    }

    /*if(user?.role.name !== requiredRole) {
        return (<Navigate to={"/" + user?.role.name} replace/>);
    }*/

    return children;
}
export default ProtectedRoute;