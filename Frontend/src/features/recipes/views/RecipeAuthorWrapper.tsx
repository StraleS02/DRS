import { useParams } from "react-router-dom";
import RecipeAuthorView from "./RecipeAuthorView";

const RecipeAuthorWrapper = () => {
    const {authorId} = useParams<{authorId: string}>();

    return authorId ? (<RecipeAuthorView authorId={authorId}></RecipeAuthorView>) : (null);
}
export default RecipeAuthorWrapper;