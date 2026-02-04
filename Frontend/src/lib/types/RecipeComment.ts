import type { Recipe } from "./Recipe";
import type { User } from "./User";

export interface RecipeComment{
    id: number;
    recipe_id: number;
    user: User;

    title: string;
    content: string;
    image?: string;
    created_at: string;
}