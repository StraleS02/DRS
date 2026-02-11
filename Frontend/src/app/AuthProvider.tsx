import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "../features/auth";
import { clearToken, getToken, setToken } from "../lib/token/token_storage";
import { decodeJwt, type JwtPayload } from "../lib/token/jwt";

type AuthProviderProps = {
    children: ReactNode;
}; 

const AuthProvider = ({children}:AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token:string|null = getToken();

        if(!token) {
            setUser(null);
            setLoading(false);
        
        }else{ 
            try{
                const tokenData:JwtPayload = decodeJwt(token);
                const currentTimeSeconds = Math.floor(Date.now() / 1000);
                if(tokenData.exp < currentTimeSeconds) handleLogout();
                else setUser({id:tokenData.user_id, email: tokenData.email, role: tokenData.role, favorite_recipe_ids: []});
            
            }catch(error){
                handleLogout();
                console.log("error in decoding jwt token.");
            
            }finally{
                setLoading(false);
            }
        }
    
    }, []);

    const handleLogin = (token: string | null) => {
        setLoading(true);
        if(token) {
            setToken(token);
            const tokenData:JwtPayload = decodeJwt(token);
            setUser({id: tokenData.user_id, email: tokenData.email, role: tokenData.role, favorite_recipe_ids: []});
        }else{
            clearToken();
            setUser(null);
        }
        setLoading(false);
        
        /*
        try{
            const response = await login({email: email, password: password});
            setToken(response.token);
            const tokenData:JwtPayload = decodeJwt(response.token);
            setUser({email: tokenData.email, role: tokenData.role});
            return {success: true};
        
        } catch (error){
            clearToken();
            setUser(null);
            return {success: false};
        } finally {
            setLoading(false);
        }*/
    }

    const handleLogout = () => {
        setLoading(true);
        
        clearToken();
        setUser(null);
        
        setLoading(false);
    }

    const validate = () => {
        setLoading(true);
        const token:string|null = getToken();
        if(token) {
            try{
                const tokenData:JwtPayload = decodeJwt(token);
                const currentTimeSeconds = Math.floor(Date.now() / 1000);
                if(tokenData.exp < currentTimeSeconds) {
                    handleLogout();
                    return;
                }
            } catch(error) {
                handleLogout();
                return;
            }
            
        }else{
            handleLogout();
            return;
        }
        
        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{user, handleLogin, handleLogout, loading, validate}}>{children}</AuthContext.Provider>
    );
}
export default AuthProvider;