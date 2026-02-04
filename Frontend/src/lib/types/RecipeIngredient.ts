import type { Ingredient } from "./Ingredient";

export interface RecipeIngredient{
    recipe_id: number;
    ingredient: Ingredient;
    quantity: number;
}