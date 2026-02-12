import api from "../../lib/api/axios"
import type { User } from "../../lib/types/User";
import type { ProfileUpdateResponse, UserRequests } from "./users.types";

export const getUserById = async (id:number) => {
    const response = await api.get<User>(`/api/users/${id}`);
    return response.data;
}
export const profileUpdate = async (profileUpdateData:FormData) => {
    const response = await api.put<ProfileUpdateResponse>("/api/users/profile", profileUpdateData);
}
export const getAllUsers = async () => {
    const response = await api.get<{users: User[]}>("/api/admin/users");
    return response.data;
}
export const deleteUserById = async (id: number) => {
    await api.delete(`/api/admin/users/${id}`);
}
export const getAllUserRequests = async () => {
    const response = await api.get<UserRequests[]>("/api/admin/author_requests");
    return response.data;
}
export const answerRoleRequest = async (requestId:number, decision:string, rejection_reason: string) => {
    await api.post(`/api/admin/author_requests/${requestId}`, {decision: decision, rejection_reason: rejection_reason});
}