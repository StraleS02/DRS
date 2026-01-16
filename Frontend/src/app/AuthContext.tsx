import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../lib/types/User";
import { getToken, getUser, isAuthenticated, unauthenticate } from "../features/auth";

type AuthContextType = {
    token: string | null,
    user: User | null,
    handleLogin: (token: string, user: User) => void,
    handleLogout: () => void;
    loading: boolean;
 }

 export const AuthContext = createContext<AuthContextType | undefined>(undefined);

 export const AuthProvider = ({children}:{children: ReactNode}) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(isAuthenticated()) {
            setToken(getToken());
            setUser(getUser());
        }
        setLoading(false);
    }, []);

    const handleLogin = (token: string, user: User) => {
        setToken(token);
        setUser(user);
    }

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        unauthenticate();
    }

    return (
        <AuthContext.Provider value={{token, user, handleLogin, handleLogout, loading}}>
            {children}
        </AuthContext.Provider>
    );
 }

 export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used inside AuthProvider.");
    }
    return context;
 }