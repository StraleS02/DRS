import type { RecipeCardData } from "../recipes/recipes.types";

export interface ProfileUpdateResponse{
    message: string;
}
export interface UserRequests{
    user_email: string;
    id: number;
    created_at: string;
    user_id: number;
}