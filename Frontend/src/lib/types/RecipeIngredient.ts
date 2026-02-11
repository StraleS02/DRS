import type { Ingredient } from "./Ingredient";

export interface RecipeIngredient{
    id: number;
    recipe_id: number;
    name: string;
    quantity: number;
}