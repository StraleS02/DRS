import { useEffect, useState } from "react";
import styles from "./RecipeViews.module.css";
import Loading from "../../../components/loading/Loading";
import { getRecipeById } from "../recipes.api";
import type { RecipeData } from "../recipes.types";
import RecipeComment from "../components/comments/RecipeComment";
import RecipeCommentInput from "../components/comments/RecipeCommentInput";

const RecipeView = ({recipeId}:{recipeId: string}) => {
    
    const [waiting, setWaiting] = useState<boolean>(false);

    const [recipe, setRecipe] = useState<RecipeData | null>(null);

    useEffect(() => {
        fetchRecipe();
    }, [recipeId]);

    const fetchRecipe = async () => {
        setWaiting(true);
        try{
            const data = await getRecipeById(recipeId);
            setRecipe(data);
            console.log
        } catch {
            setRecipe(null);
        } finally {
            setWaiting(false);
        }
    }

    if(waiting) return <Loading size="medium" theme="dark"></Loading>

    return (
        <div className={styles.recipes_view}>
            <div className={styles.upper_section}>
                <div className={styles.left_section}></div>
                <div className={styles.right_section}></div>
            </div>
            <div className={styles.bottom_section}>
                <RecipeCommentInput></RecipeCommentInput>
                <RecipeComment></RecipeComment>
            </div>
        </div>
    );
}
export default RecipeView;