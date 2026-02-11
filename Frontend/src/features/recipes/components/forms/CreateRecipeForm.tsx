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
    feedback: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    title: string;
    buttonText: string;
};

const CreateRecipeForm = ({onSubmit, feedback, children, title, buttonText}:CreateRecipeFormProps) => {
    
    return (
        <div className={styles.create_recipe_form}>
            <div className={styles.title}>{title}
            </div>
            <form id="create-recipe-form" onSubmit={(e) => onSubmit(e)}>
                {children}
            </form>
            <div className={styles.feedback} style={{opacity: feedback === "" ? 0 : 1, backgroundColor: feedback === "Success" ? "rgb(178, 255, 194)" : "rgb(253, 196, 196)"}}>
                <span>{feedback}</span>
            </div>
            <div className={styles.submit_button_wrapper}>
                <SubmitButton formId="create-recipe-form" title={buttonText}></SubmitButton>
            </div>
        </div>
    );
}
export default CreateRecipeForm;