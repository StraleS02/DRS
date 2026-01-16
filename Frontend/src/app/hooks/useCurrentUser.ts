import { useContext } from "react"
import { AuthContext } from "../AuthContext"

export const useCurrentUser = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("AuthProvider is needed for useCurrentUser()");
    return {user: context.user, loading: context.loading};
}