import styles from "./RecipeViews.module.css";
import CreateRecipeForm from "../components/forms/CreateRecipeForm";
import { useRef, useState } from "react";
import { createRecipe, sendRoleRequest } from "../recipes.api";
import FormRow from "../../../components/form_elements/form_row/FormRow";
import TextInput from "../../../components/form_elements/text_input/TextInput";
import SubmitButton from "../../../components/form_elements/submit_button/SubmitButton";
import RadioGroup, { type RadioOption } from "../../../components/form_elements/radio_group/RadioGroup";
import Ingredient from "../components/ingredients/Ingredient";
import IngredientInput from "../components/ingredients/IngredientInput";
import FormColumn from "../../../components/form_elements/form_columns/FormColumn";
import PrepStep from "../components/steps/PrepStep";
import PrepStepInput from "../components/steps/PrepStepInput";
import Tag from "../components/tags/Tag";
import TagInput from "../components/tags/TagInput";
import { useAuth } from "../../auth/useAuth";
import Loading from "../../../components/loading/Loading";
import type { RecipeTag } from "../../../lib/types/RecipeTag";
import type { RecipeStep } from "../../../lib/types/RecipeStep";
import type { RecipeIngredient, RecipeIngredient as TypeIngredient } from "../../../lib/types/RecipeIngredient";

const difficultyOptions:RadioOption[] = [
    {title: "Easy", value: "EASY"}, {title: "Medium", value: "MEDIUM"}, {title: "Hard", value: "HARD"}
]

type CreateRecipeForm = {
    name: string;
    mealType: string;
    prepTime: string;
    difficulty: string;
    servings: string;
    tags: RecipeTag[];
    steps: RecipeStep[];
    ingredients: TypeIngredient[];
}

type CreateRecipeFormError = {
    name: boolean;
    mealType: boolean;
    prepTime: boolean;
    difficulty: boolean;
    servings: boolean;
    image: boolean;
}

const CreateRecipeView = () => {

    const [createRecipeForm, setCreateRecipeForm] = useState<CreateRecipeForm>(
        {
            name: "",
            mealType: "",
            prepTime: "",
            difficulty: difficultyOptions[0].value,
            servings: "",
            tags: [],
            ingredients: [],
            steps: []
        }
    );

    const [createRecipeFormError, setCreateRecipeFormError] = useState<CreateRecipeFormError>(
        {
            name: false,
            mealType: false,
            prepTime: false,
            difficulty: false,
            servings: false,
            image: false
        }
    );

    const imageRef = useRef<HTMLInputElement>(null);

    const {user} = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);
    
    const [feedback, setFeedback] = useState<string>("");
    const [errorTrigger, setErrorTrigger] = useState<number>(0);

    const handleErrorDetected = () => {
        setErrorTrigger(t => (t+1)%100);
    }

    const handleRoleRequest = async () => {
        setWaiting(true);

        if(!user) return;

        const userId = user.id;
        const role = user.role;

        try{
            await sendRoleRequest(userId, role);  
            setFeedback("Successfully sent. You will receive an email with the update.");  
        } catch {
            setFeedback("Failed to send");
        } finally {
            setWaiting(false);
        }
    }

    const addIngredient = (name: string, quantity: string) => {
        let q:number = parseFloat(quantity);
        setCreateRecipeForm((prev) => ({
            ...prev, ingredients: [
                ...prev.ingredients, {recipe_id: 0, quantity: q, ingredient: {id: 0, name: name}}
            ]
        }));
    }

    const removeIngredient = (ingredient: RecipeIngredient) => {
        setCreateRecipeForm((prev) => ({
            ...prev, ingredients: prev.ingredients.filter((i) => i !== ingredient)
        }))
    }

    const addStep = (description: string) => {
        setCreateRecipeForm((prev) => ({
            ...prev, steps: [
                ...prev.steps, {id: 0, description: description, recipe_id: 0, step_number: prev.steps.length+1}
            ]
        }))

        // handle rearraging steps by order
    }

    const removeStep = (step: RecipeStep) => {
        setCreateRecipeForm((prev) => ({
            ...prev, steps: prev.steps.filter((s) => s !== step)
        }))
    }

    const addTag = (tag: RecipeTag) => {
        setCreateRecipeForm((prev) => ({
            ...prev, tags: [
                ...prev.tags, tag
            ]
        }))
    }

    const removeTag = (name: string) => {
        setCreateRecipeForm((prev) => ({
            ...prev, tags: prev.tags.filter((tag) => tag.tag.name !== name)
        }))
    }

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setWaiting(true);
            
            const nameErr = createRecipeForm.name.trim() === "";
            const mealTypeErr = createRecipeForm.mealType.trim() === "";
            const difficultyErr = createRecipeForm.difficulty.trim() === "";
            const prepTimeErr = createRecipeForm.prepTime.trim() === "";
            const imageErr = !imageRef.current || imageRef.current.files?.length === 0;;
            const servingsErr = createRecipeForm.servings.trim() === "";
            
            setCreateRecipeFormError({
                name: nameErr,
                mealType: mealTypeErr,
                difficulty: difficultyErr,
                prepTime: prepTimeErr,
                image: imageErr,
                servings: servingsErr
            });
    
            if(nameErr || mealTypeErr || difficultyErr || prepTimeErr || imageErr || servingsErr)  {
                handleErrorDetected();
                const defaultMessage = "All fields are required.";
                setFeedback(defaultMessage);
                setWaiting(false);
                return;
            }
            
            let formData:FormData = new FormData();
            formData.append("name", createRecipeForm.name);
            formData.append("meal_type", createRecipeForm.mealType);
            formData.append("prep_time", createRecipeForm.prepTime);
            formData.append("difficulty", createRecipeForm.difficulty);
            formData.append("servings", createRecipeForm.servings);
            const file = imageRef.current?.files?.[0];
            if(file) formData.append("image", file);
            formData.append("tags", JSON.stringify(createRecipeForm.tags.map(t => t.tag.name)));
            formData.append("ingredients", JSON.stringify(createRecipeForm.ingredients.map(i => ({ name: i.ingredient.name, quantity: i.quantity }))));
            formData.append("steps", JSON.stringify(createRecipeForm.steps.map(s => s.description)));
    
            try {
                await createRecipe(formData);
                setFeedback("Success");
            } catch (error: any) {
                if(!error.response) {
                    setFeedback("No connection to the server.");
                } else {
                    const data = error.response.data;
                    setFeedback(data.message);
                }
                
            } finally {
                setWaiting(false);
            }
            
        }

    if(waiting) return <Loading size="medium" theme="dark"></Loading>

    if(user && user.role === "reader") return (
        <div className={styles.create_recipe_view}>
            <h2>In order to post new recipes yourself, you need to be an author!</h2>
            <h2>You can send a request to administrators for a role upgrade.</h2>
            <span>Sent successfully</span>
            <button className={styles.request_button} onClick={handleRoleRequest}>Send</button>
        </div>
    );

    if(user && user.role === "author") return (
        <div className={styles.create_recipe_view}>
            <CreateRecipeForm onSubmit={onSubmit} feedback={feedback}>
                <>
                    <div className={styles.left_section}>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Name" type="text" value={createRecipeForm.name} onChange={(value) => setCreateRecipeForm(prev => ({...prev, name: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Meal Type" type="text" value={createRecipeForm.mealType} onChange={(value) => setCreateRecipeForm(prev => ({...prev, mealType: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Preparation Time  (minutes)" type="number" value={createRecipeForm.prepTime} onChange={(value) => setCreateRecipeForm(prev => ({...prev, prepTime: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <RadioGroup key={errorTrigger} name="difficulty" title="Difficulty:" color="#94adab" fontColor="#000000" options={difficultyOptions} value={createRecipeForm.difficulty} onChange={(value) => setCreateRecipeForm(prev => ({...prev, difficulty: value}))}></RadioGroup>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Servings" type="number" value={createRecipeForm.servings} onChange={(value) => setCreateRecipeForm(prev => ({...prev, servings: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <input ref={imageRef} style={{width: "100%"}} type="file" accept="image/*"></input>
                        </FormRow>
                    </div>
                    <div className={styles.right_section}>
                        <FormRow direction="column" gap="10px">
                                <label style={{width: "100%", fontSize: "22px"}}>Ingredients</label>
                                {createRecipeForm.ingredients.map((ing, index) => (
                                    <Ingredient key={index} editable={true} ingredient={ing} onClick={removeIngredient}></Ingredient>
                                ))}
                                <IngredientInput onClick={addIngredient}></IngredientInput>
                        </FormRow>
                        <FormRow direction="column" gap="10px">
                                <label style={{width: "100%", fontSize: "22px"}}>Preparation Steps</label>
                                {createRecipeForm.steps.map((step, index) => (
                                    <PrepStep key={index} editable={true} step={step} onClick={removeStep}></PrepStep>
                                ))}
                                <PrepStepInput onClick={addStep}></PrepStepInput>
                        </FormRow>
                        
                        <label style={{width: "100%", fontSize: "22px"}}>Tags</label>
                        <div style={{maxWidth: "100%", display: "flex", flexWrap: "wrap", gap: "5px"}}>
                        </div>
                        <div style={{display: "flex", flexWrap: "wrap", gap: "4px"}}>
                            {createRecipeForm.tags.map((tag, index) => (
                                <Tag key={index} recipeTag={tag} editable={true} onClick={removeTag}></Tag>
                            ))}
                        </div>
                        <TagInput onClick={addTag}></TagInput>
                    </div>
                </>
            </CreateRecipeForm>
        </div> 
    );
}
export default CreateRecipeView;