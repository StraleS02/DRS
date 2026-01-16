import { useAuth } from "../../app/AuthContext";
import { API_URL } from "../../env";
import type { Recipe } from "../../lib/types/Recipe";
import { getToken } from "../auth";
import type { CreateRecipeResponse } from "./recipes.types";

export const postRecipe = async (recipe:FormData):Promise<CreateRecipeResponse> => {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}/api/recipes/create`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(recipe)
        });
        if(!response.ok) throw new Error(`Error: recipes.api.ts: postRecipe | ` + response.statusText);
        return await response.json();

    } catch (error) {
        console.log(`Error: recipes.api.ts: postRecipe | ` + error);
        throw error;
    }
}