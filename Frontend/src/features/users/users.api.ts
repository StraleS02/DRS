import api from "../../lib/api/axios"
import type { User } from "../../lib/types/User";
import type { ProfileUpdateResponse } from "./users.types";

export const getUserById = async (id:number) => {
    const response = await api.get<User>(`//${id}`);
}
export const profileUpdate = async (profileUpdateData:FormData) => {
    const response = await api.post<ProfileUpdateResponse>("/api/users/profile", profileUpdate);
}