import type { User } from "../users/types";

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