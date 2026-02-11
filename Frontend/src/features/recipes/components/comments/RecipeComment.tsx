import type { RecipeComment } from "../../../../lib/types/RecipeComment";
import styles from "./RecipeComment.module.css";

type RecipeCommentProps = {
    comment: RecipeComment;
};

const RecipeComment = () => {
    return (
        <div className={styles.recipe_comment}>
            <div className={styles.header}>
                <div className={styles.title}>BROTHER GOOOD</div>
                <div className={styles.author}>by: longfords@gmail.com</div>
            </div>
            <div className={styles.content}>
                <div className={styles.image}>
                    <img src="/pasulj.jpg"></img>
                </div>
                <div className={styles.description}></div>
            </div>
        </div>
    );
}
export default RecipeComment;