import { useRef, useState } from "react";
import styles from "./RecipeComment.module.css";

type RecipeCommentInputProps = {
    onClick: (title: string, content: string, file?: File) => void;
};

const RecipeCommentInput = ({onClick}:RecipeCommentInputProps) => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const imageRef = useRef<HTMLInputElement>(null);

    const handlePostClicked = () => {
        // grab data
        const file = imageRef.current?.files?.[0];

        setTitle("");
        setContent("");
        onClick(title, content, file);
    }
    
    return (
        <div className={styles.recipe_comment_input}>
           <div className={styles.header}> 
                <div className={styles.title}>
                    <input type="text" placeholder="Title"  value={title} onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div className={styles.file}>
                    <input type="file" accept="image/*"></input>
                </div>
                <div className={styles.add_button}>
                    <button onClick={() => handlePostClicked()} disabled={content === "" || title === ""}  style={{opacity: (content === "" || title === "") ? 0.6 : 1.0}}>Post</button>
                </div>
            </div>
            <div className={styles.content}>
                <textarea placeholder="Comment now!" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
        </div>
    );
}
export default RecipeCommentInput;