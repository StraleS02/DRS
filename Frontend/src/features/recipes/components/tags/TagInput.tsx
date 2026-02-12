import { useState } from "react";
import type { RecipeTag } from "../../../../lib/types/RecipeTag";
import styles from "./Tag.module.css";

type TagInputProps = {
    onClick: (name: string) => void;
};

const TagInput = ({onClick}:TagInputProps) => {
    const [name, setName] = useState<string>("");

    const handleClick =  () => {
        onClick(name);
        setName("");
    }

    return (
        <div className={styles.tag_input}>
            <input type="text" placeholder="Tag Name" value={name} onChange={(e) => setName(e.target.value)}></input>
            <button disabled={name === ""} style={{opacity: name === "" ? "0.6" : "1.0"}} type="button" onClick={() => handleClick()}>Add</button>
        </div>
    );
}
export default TagInput;