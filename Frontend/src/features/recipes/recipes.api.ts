import api from "../../lib/api/axios";
import type { Recipe } from "../../lib/types/Recipe";

export const getAllRecipes = async () => {
    const response = await api.get<Recipe[]>("/api/recipes");
    return response.data;
}
export const createRecipe = async (recipeFormData:FormData) => {
    const response = await api.post("/api/recipes/create", recipeFormData);
    return response;
}