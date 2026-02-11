import { useState } from "react";
import type { RecipeIngredient } from "../../../../lib/types/RecipeIngredient";
import styles from "./Ingredient.module.css";

type IngredientInputType = {
    onClick: (name: string, quantity: string) => void;
};

const IngredientInput = ({onClick}:IngredientInputType) => {
    const [name, setName] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");

    const handleClick =  () => {
        onClick(name, quantity);
        setName("");
        setQuantity("");
    }

    return (
        <div className={styles.ingredient_input}>
            <input className={styles.name} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
            <input className={styles.quantity} type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>
            <button type="button" onClick={() => handleClick()} disabled={(name === "" || quantity === "")} style={{opacity: (name === "" || quantity === "") ? 0.6 : 1.0}}>Add</button>
        </div>
    );
}
export default IngredientInput;