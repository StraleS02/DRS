import type { Recipe, RecipePrepDifficulty } from "../../lib/types/Recipe";

export interface RecipeCardData{
    recipe: Recipe;
    user: {
        name: string;
        lastname: string;
    }
}

export interface CreateRecipeRequest{
    author_id: string;
    name: string;
    meal_type: string;
    prep_time: number;
    difficulty: RecipePrepDifficulty;
    servings: number;
    ingredients: string;
    steps: string;
    image: string;
    tags: string[];
}
export interface CreateRecipeResponse{
    success: boolean;
    message: string;
}