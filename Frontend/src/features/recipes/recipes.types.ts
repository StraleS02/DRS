import type { Recipe, RecipePrepDifficulty } from "../../lib/types/Recipe";
import type { RecipeComment } from "../../lib/types/RecipeComment";
import type { RecipeIngredient } from "../../lib/types/RecipeIngredient";
import type { RecipeStep } from "../../lib/types/RecipeStep";
import type { RecipeTag } from "../../lib/types/RecipeTag";

export interface RecipeCardData extends Recipe{
    author: {
        id: number;
        first_name: string;
        last_name: string;
        profile_image: string;
    }
}

export interface MyRecipesInfo{
    recipe_ids: number[];
    favorite_ids: number[];
}

export interface RecipeData extends Recipe{
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
    comments: RecipeComment[];
    tags: RecipeTag[]
}

export interface RecipeAuthorDataResponse{
    author: {
        id: number;
        first_name: string;
        last_name: string;
        country: string;
        joined_at: string;
        average_rating: number;
        profile_image: string;
        email: string;
        total_recipes: number;
    }
    recipes: RecipeCardData[];
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