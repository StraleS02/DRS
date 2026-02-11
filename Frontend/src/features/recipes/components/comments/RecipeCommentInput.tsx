import styles from "./RecipeComment.module.css";

type RecipeCommentInputProps = {

};

const RecipeCommentInput = () => {
    return (
        <div className={styles.recipe_comment_input}>
           <div className={styles.header}> 
                <div className={styles.title}>
                    <input type="text" placeholder="Title"></input>
                </div>
                <div className={styles.file}>
                    <input type="file" accept="image/*"></input>
                </div>
                <div className={styles.add_button}>
                    <button>Post</button>
                </div>
            </div>
            <div className={styles.content}>
                <textarea placeholder="Comment now!"></textarea>
            </div>
        </div>
    );
}
export default RecipeCommentInput;