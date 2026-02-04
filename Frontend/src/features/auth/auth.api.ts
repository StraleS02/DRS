import api from "../../lib/api/axios";
import type { LoginRequest, SuccessfulLoginResponse, FailedLoginResponse, RegisterResponse } from "./auth.types";

export const login = async (loginRequest:LoginRequest) => {
    const response = await api.post<SuccessfulLoginResponse>("/api/auth/login", loginRequest);
    return response.data;
}

export const register = async (formData: FormData):Promise<void> => {
    await api.post<RegisterResponse>("/api/auth/register", formData);
}