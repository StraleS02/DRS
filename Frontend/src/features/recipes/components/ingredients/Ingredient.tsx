import type { RecipeIngredient } from "../../../../lib/types/RecipeIngredient";
import styles from "./Ingredient.module.css";
 
type IngredientProps = {
    ingredient: RecipeIngredient;
    editable: boolean;
    onClick: (ingredient: RecipeIngredient) => void;
};

const Ingredient = ({ingredient, editable, onClick}:IngredientProps) => {
    return (
        <div className={styles.ingredient}>
            <div className={styles.name}>{ingredient.ingredient.name}</div>
            <div className={styles.quantity}>{ingredient.quantity + "g"}</div>
            {editable && <button type="button" onClick={() => onClick(ingredient)}>Drop</button>}
        </div>
    );
}
export default Ingredient;