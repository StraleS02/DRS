import styles from "./RecipeViews.module.css";

const RecipeView = ({recipeId}:{recipeId: string}) => {
    console.log(recipeId);

    return (
        <div className={styles.recipes_view}>
            {`RECIPE VIEW: Viewing 1 recipe with an id of: ${recipeId}`}
        </div>
    );
}
export default RecipeView;