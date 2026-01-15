import { useParams } from "react-router-dom";
import ViewRecipePage from "./ViewRecipePage";

const RecipeWrapper = () => {
    const {recipeId} = useParams<{recipeId: string}>();

    return recipeId ? (<ViewRecipePage recipeId={recipeId}></ViewRecipePage>) : (null);
}
export default RecipeWrapper;