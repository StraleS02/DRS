import type { RecipeComment as RecipeCommentType } from "../../../../lib/types/RecipeComment";
import styles from "./RecipeComment.module.css";

type RecipeCommentProps = {
    comment: RecipeCommentType;
};

const RecipeComment = ({comment}: RecipeCommentProps) => {
    return (
        <div className={styles.recipe_comment}>
            <div className={styles.header}>
                <div className={styles.title}>{comment.title}</div>
                <div className={styles.author}>{comment.user.email}</div>
            </div>
            <div className={styles.content}>
                <div className={styles.image}>
                    <img src={comment.image}></img>
                </div>
                <div className={styles.description}>{comment.content}</div>
            </div>
        </div>
    );
}
export default RecipeComment;