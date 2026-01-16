import type { RecipePreparationDifficulty } from "../../lib/types/Recipe";
import styles from "./Form.module.css";

type RadioInputProps = {
    value: string;
    title: string;
    elements: RecipePreparationDifficulty[];
    onChange: (value: RecipePreparationDifficulty) => void;
};

const RadioInput = ({title, elements, value, onChange}: RadioInputProps) => {
    return (
        <div className={styles.radio_input}>
            <label>{title + ":"}<br/>
            {elements.map((element, index) => (
                <>
                    <label key={index}>{element}</label>
                    <input type="radio" key={element} name={title} value={element} onChange={(e) => onChange(e.target.value as RecipePreparationDifficulty)} checked={value === element}></input>
                </>
            ))}
            </label>
        </div>
    );
}
export default RadioInput;