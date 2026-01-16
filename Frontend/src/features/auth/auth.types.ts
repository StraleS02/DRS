import type { User } from "../../lib/types/User";

export interface LoginRequest{
    email: string;
    password: string;
}
export interface LoginResponse{
    status: string;
    token: string;
    user: User;
    message: string;
    time: number;
}
export interface RegisterRequest{
    
}
export interface RegisterResponse{
    status: string;
    messages: string[];
}