import api from "../../lib/api/axios";
import type { MyRecipesInfo, RecipeAuthorDataResponse, RecipeCardData } from "./recipes.types";

export const getAllRecipes = async () => {
    const response = await api.get<RecipeCardData[]>("/api/recipes");
    return response.data;
}
export const createRecipe = async (recipeFormData:FormData) => {
    const response = await api.post("/api/recipes", recipeFormData);
    return response;
}
export const sendRoleRequest = async (id:number, role:string) => {
    await api.post("/api/author_request", {user_id: id, role: role});
}
export const getAuthor = async (authorId: string) => {
    const response = await api.get<RecipeAuthorDataResponse>(`/api/authors/${authorId}`);
    return response.data;
}
export const getMyRecipesInfo = async () => {
    const response = await api.get<MyRecipesInfo>(`/api/users/me`);
    return response.data;
}
export const toggleFavorite = async (recipeId: number) => {
    await api.post(`/api/recipes/${recipeId}/favorite`);
}
export const getRecipeById = async (recipeId: string) => {
    const response = await api.get(`/api/recipes/${recipeId}`);
    return response.data;
}