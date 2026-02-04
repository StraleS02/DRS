import { useParams } from "react-router-dom";
import RecipeView from "./RecipeView";

const RecipeWrapper = () => {
    const {recipeId} = useParams<{recipeId: string}>();

    return recipeId ? (<RecipeView recipeId={recipeId}></RecipeView>) : (null);
}
export default RecipeWrapper;