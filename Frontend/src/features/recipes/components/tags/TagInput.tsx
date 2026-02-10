import { useState } from "react";
import type { RecipeTag } from "../../../../lib/types/RecipeTag";
import styles from "./Tag.module.css";

type TagInputProps = {
    onClick: (tag: RecipeTag) => void;
};

const TagInput = ({onClick}:TagInputProps) => {
    const [name, setName] = useState<string>("");

    return (
        <div className={styles.tag_input}>
            <input type="text" placeholder="Tag Name" value={name} onChange={(e) => setName(e.target.value)}></input>
            <button disabled={name === ""} style={{opacity: name === "" ? "0.6" : "1.0"}} type="button" onClick={() => onClick({recipe_id: 0, tag:{id: 0, name: name}})}>Add</button>
        </div>
    );
}
export default TagInput;