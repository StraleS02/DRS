import { useRef, useState } from "react";
import FormField from "../../../../components/form/FormField";
import TextInput from "../../../../components/form/TextInput";
import styles from "./CreateRecipeForm.module.css";
import FileInput from "../../../../components/form/FileInput";
import RadioInput from "../../../../components/form/RadioInput";
import type { Recipe, RecipePrepDifficulty } from "../../../../lib/types/Recipe";
import type { CreateRecipeRequest } from "../../recipes.types";
import SubmitButton from "../../../../components/form_elements/submit_button/SubmitButton";

type CreateRecipeFormProps = {
    children: React.ReactNode;
    onSubmit: (recipe: FormData) => void;
};

const CreateRecipeForm = ({onSubmit, children}:CreateRecipeFormProps) => {
    
    const [feedback, setFeedback] = useState<string>("");

    const [type, setType] = useState<string>("");
    const [difficulty, setDifficulty] = useState<RecipePrepDifficulty>("Easy");
    const nameRef = useRef<HTMLInputElement | null>(null);
    const preparationTimeRef = useRef<HTMLInputElement | null>(null);
    const peopleRef = useRef<HTMLInputElement | null>(null);
    const ingredientsRef = useRef<HTMLInputElement | null>(null);
    const stepsRef = useRef<HTMLInputElement | null>(null);
    const imageRef = useRef<HTMLInputElement | null>(null);

    const createRecipe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let formData:FormData = new FormData();
        formData.append("name", nameRef.current?.value || "");
        formData.append("type", type);
        formData.append("preparationDifficulty", difficulty);
        formData.append("preparationTime", preparationTimeRef.current?.value || "");
        formData.append("ingredients", ingredientsRef.current?.value || "");
        formData.append("steps", stepsRef.current?.value || "");
        formData.append("people", peopleRef.current?.value || "");
        formData.append("tags", [].toString());
        const image = imageRef.current?.files?.[0] || null;
        if(image) formData.append("image", image);
        
        onSubmit(formData);
    }

    return (
        <div className={styles.create_recipe_form}>
            <div className={styles.title}>Create new Recipe
            </div>
            <form>
                {children}
            </form>
            <div className={styles.feedback} style={{opacity: feedback === "" ? 0 : 1, backgroundColor: feedback === "Success" ? "rgb(178, 255, 194)" : "rgb(253, 196, 196)"}}>
                <span>{feedback}</span>
            </div>
            <div className={styles.submit_button_wrapper}>
                <SubmitButton title="Create and Publish"></SubmitButton>
            </div>
        </div>
    );
}
export default CreateRecipeForm;