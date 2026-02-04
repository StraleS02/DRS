import styles from "./RecipeViews.module.css";
import CreateRecipeForm from "../components/forms/CreateRecipeForm";
import { useState } from "react";
import { createRecipe } from "../recipes.api";
import FormRow from "../../../components/form_elements/form_row/FormRow";
import TextInput from "../../../components/form_elements/text_input/TextInput";
import SubmitButton from "../../../components/form_elements/submit_button/SubmitButton";
import RadioGroup, { type RadioOption } from "../../../components/form_elements/radio_group/RadioGroup";

const difficultyOptions:RadioOption[] = [
    {title: "Easy", value: "EASY"}, {title: "Medium", value: "MEDIUM"}, {title: "Hard", value: "HARD"}
]

const CreateRecipeView = () => {

    const [feedback, setFeedback] = useState<string>("");

    const [errorTrigger, setErrorTrigger] = useState<number>(0);

    const onSubmit = async (createRecipeFormData:FormData) => {
        const data = await createRecipe(createRecipeFormData);
        
        console.log("test");
    }

    return (
        <div className={styles.create_recipe_view}>
            <CreateRecipeForm onSubmit={onSubmit}>
                <>
                    <div className={styles.left_section}>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Name" type="text" value="" onChange={() => ("")}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Meal Type" type="text" value="" onChange={() => ("")}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Preparation Time  (minutes)" type="number" value="" onChange={() => ("")}></TextInput>
                        </FormRow>
                        <FormRow>
                            <RadioGroup key={errorTrigger} name="difficulty" title="Difficulty:" color="#94adab" fontColor="#000000" options={difficultyOptions} value={"HARD"} onChange={() => ("") }></RadioGroup>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Servings" type="number" value="" onChange={() => ("")}></TextInput>
                        </FormRow>
                        <FormRow>
                            <input style={{width: "100%"}} type="file" accept="image/*"></input>
                        </FormRow>
                    </div>
                    <div className={styles.right_section}>
                        <FormRow>
                            <>
                                <label>Ingredients</label>
                            </>
                        </FormRow>
                        <FormRow>
                            <>
                                <label>Preparation Steps</label>
                            </>
                        </FormRow>
                        <FormRow>
                            <>
                                <label>Tags</label>
                            </>
                        </FormRow>
                    </div>
                </>
            </CreateRecipeForm>
            <div className={styles.feedback}>{feedback}</div>
        </div>

    );
}
export default CreateRecipeView;