import { API_URL } from "../../env";
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
export const downloadPdf = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/api/admin/report/top-authors`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to generate PDF");
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.pdf";
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error(error);
    }
};