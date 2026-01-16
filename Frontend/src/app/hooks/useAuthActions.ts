import { useContext } from "react"
import { AuthContext } from "../AuthContext"

export const useAuthActions = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("Auth provider is needed for useAuthActions()");
    return {handleLogin: context.handleLogin, handleLogout: context.handleLogout};
}