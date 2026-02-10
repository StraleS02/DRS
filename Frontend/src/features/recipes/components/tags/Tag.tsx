import type { RecipeTag } from "../../../../lib/types/RecipeTag";
import styles from "./Tag.module.css";

type TagProps = {
    recipeTag: RecipeTag;
    editable: boolean;
    onClick: (name: string) => void; 
}

const Tag = ({recipeTag, editable, onClick}:TagProps) => {
    
    return (
        <div className={styles.tag}>
            <div className={styles.name}>{recipeTag.tag.name}</div>
            {editable && <div className={styles.x} onClick={() => onClick(recipeTag.tag.name)}>X</div>}
        </div>
    );
}
export default Tag;