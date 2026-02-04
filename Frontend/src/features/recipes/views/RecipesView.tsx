import Recipe from "../../../features/recipes/components/recipe/Recipe";
import styles from "./RecipeViews.module.css";

const RecipesView = () => {
    const placeholderArray = Array.from({length: 11});

    //useEffect load All recipes

    return (
        <div className={styles.recipes_view}>
            {placeholderArray.map((_, index) => (
                <Recipe key={index}></Recipe>
            ))}
        </div>

    );
}
export default RecipesView;