export interface AuthUser{
    id: number;
    email:string;
    role: string;
    favorite_recipe_ids: number[]
}

export interface LoginRequest{
    email: string;
    password: string;
}
export interface SuccessfulLoginResponse{
    token: string;
}
export interface FailedLoginResponse{
    message: string;
    blocked_seconds: number;
}

export interface RegisterResponse{
    message: string;
}