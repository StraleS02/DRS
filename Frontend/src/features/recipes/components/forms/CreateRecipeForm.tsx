import { useRef, useState } from "react";
import DropdownInput from "../../../../components/form/DropDownInput";
import FormField from "../../../../components/form/FormField";
import TextInput from "../../../../components/form/TextInput";
import styles from "./Form.module.css";
import FileInput from "../../../../components/form/FileInput";
import RadioInput from "../../../../components/form/RadioInput";
import type { Recipe, RecipePreparationDifficulty } from "../../../../lib/types/Recipe";
import type { CreateRecipeRequest } from "../../recipes.types";

type CreateRecipeFormProps = {
    onSubmit: (recipe: FormData) => void;
};

const CreateRecipeForm = ({onSubmit}:CreateRecipeFormProps) => {
    /** FALE TAGOVI */
    const [type, setType] = useState<string>("");
    const [difficulty, setDifficulty] = useState<RecipePreparationDifficulty>("Easy");
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
        <form className={styles.create_recipe_form}  onSubmit={createRecipe}>
            <div className={styles.form_row}>
                <FormField>
                    <TextInput ref={nameRef} type="text" placeholder="Name"></TextInput>
                </FormField>
            </div>
            <div className={styles.form_row}>
                <FormField>
                    <DropdownInput value="x" title="Type" elements={["corba", "supa", "pecenje"]} onChange={(value:string) => setType(value)}></DropdownInput>
                </FormField>
            </div>
            
            <div className={styles.form_row}>
                <FormField>
                    <TextInput ref={preparationTimeRef} type="number" placeholder="Preparation Minutes"></TextInput>
                </FormField>
            </div>
            <div className={styles.form_row}>
                <FormField>
                    <RadioInput value={difficulty} elements={["Easy", "Medium", "Hard"]} title="Difficulty" onChange={(value) => setDifficulty(value)}></RadioInput>
                </FormField>
            </div>
            <div className={styles.form_row}>
                <FormField>
                    <TextInput ref={peopleRef} type="text" placeholder="Number of People"></TextInput>
                </FormField>
            </div>
            <div className={styles.form_row}>
                <FormField>
                    <TextInput ref={ingredientsRef} type="text" placeholder="Ingredients"></TextInput>
                </FormField>
            </div>
            <div className={styles.form_row}>
                <FormField>
                    <TextInput ref={stepsRef} type="text" placeholder="Steps"></TextInput>
                </FormField>
            </div>
            <div className={styles.form_row}>
                <FormField>
                    <FileInput ref={imageRef}></FileInput>
                </FormField>
            </div>
            
            <div className={styles.form_row}>
                <input type="submit" value="Create"></input>
            </div>
        </form>
    );
}
export default CreateRecipeForm;