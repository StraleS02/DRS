export type RecipePreparationDifficulty = "Easy" | "Medium" | "Hard";

export interface Recipe{
    id: number;
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