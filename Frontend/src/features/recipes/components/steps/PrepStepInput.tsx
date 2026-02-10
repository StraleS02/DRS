import { useState } from "react";
import type { RecipeStep } from "../../../../lib/types/RecipeStep";
import styles from "./PrepStep.module.css";

type PrepStepInput = {
    onClick: (description: string) => void;
};

const PrepStepInput = ({onClick}:PrepStepInput) => {
    const [description, setDescription] = useState<string>("");

    const handleClick =  () => {
        onClick(description);
        setDescription("");
    }

    return (
        <div className={styles.prep_step_input}>
            <input className={styles.number} placeholder="Description of a step" value={description} type="text" onChange={(e) => setDescription(e.target.value)}></input>
            <button type="button" disabled={description === ""} style={{opacity: description === "" ? 0.6 : 1.0}} onClick={handleClick}>Add</button>
        </div>
    );
}
export default PrepStepInput;