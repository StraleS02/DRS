import type { Recipe } from "./Recipe";
import type { User } from "./User";

export interface RecipeComment{
    id: number;
    recipe_id: number;
    user: {
        user_id: number,
        email: string
    };

    title: string;
    content: string;
    image?: string;
}