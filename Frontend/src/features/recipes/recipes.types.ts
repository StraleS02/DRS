import type { RecipePreparationDifficulty } from "../../lib/types/Recipe";

export interface CreateRecipeRequest{
    name: string;
    type: string;
    preparationTimeMinutes: number;
    preparationDifficulty: RecipePreparationDifficulty;
    people: number;
    ingredients: string;
    steps: string;
    imageUrl: string;
    tags: string[];
}
export interface CreateRecipeResponse{
    success: boolean;
    message: string;
}