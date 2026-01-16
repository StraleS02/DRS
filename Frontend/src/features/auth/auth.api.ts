import { API_URL } from "../../env";
import type { User } from "../../lib/types/User";
import type { LoginRequest, LoginResponse, RegisterResponse } from "./auth.types";

export const login = async (loginRequest:LoginRequest):Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(loginRequest)
    });

    if(!response.ok) {
        throw new Error("Invalid Credentials");
    }


    const data:LoginResponse = await response.json();
    console.log(data.token);
    return data;
} 

export const register = async (formData: FormData):Promise<RegisterResponse> => {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            body: formData
        });
        const data:RegisterResponse = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error in AuthService: register | ' + error);
    }
}

export const authenticate = (token: string | null, user: User | null):boolean => {
    if(token){
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
    }
    return false;
}

export const isAuthenticated = ():boolean => {
    return !!localStorage.getItem('jwtToken');
}

export const unauthenticate = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
}

export const getToken = () => {
    return localStorage.getItem('jwtToken');
}

export const getUser = (): User|null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}