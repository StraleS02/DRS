import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

const RoleRedirect = () => {
    
    const {user} = useAuth();

    if(!user) return <Navigate to={"/login"} replace={true}></Navigate>

    const role = user.role;
    if(role === "admin") return <Navigate to={"/users"} replace></Navigate>;
    else return <Navigate to={"/recipes"} replace></Navigate>;
}
export default RoleRedirect;