import { createContext } from "react";
import type { AuthUser } from "./auth.types";

export type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
    handleLogin: (token: string | null) => void;
    handleLogout: () => void;
    validate: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);