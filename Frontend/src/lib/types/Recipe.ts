import type { RecipeComment } from "./RecipeComment";
import type { RecipeIngredient } from "./RecipeIngredient";
import type { RecipeStep } from "./RecipeStep";
import type { RecipeTag } from "./RecipeTag";
import type { User } from "./User";

export type RecipePrepDifficulty = "Easy" | "Medium" | "Hard";

export interface Recipe{
    id: number;
    author_id: number;
    
    name: string;
    meal_type: string;
    prep_time: number;
    difficulty: RecipePrepDifficulty;
    servings: number;
    image: string;

    created_at: string;
    updated_at: string;

    //ratings
    //favorites
    //comments: RecipeComment[];
    ingredients: RecipeIngredient[];
    steps: RecipeStep[]; 
    tags: RecipeTag[];
}