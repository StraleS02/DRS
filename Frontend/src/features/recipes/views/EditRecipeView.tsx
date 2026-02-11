import styles from "./RecipeViews.module.css";
import CreateRecipeForm from "../components/forms/CreateRecipeForm";
import { useRef, useState } from "react";
import { createComment, createRecipe, deleteRecipe, sendRoleRequest, updateRecipe } from "../recipes.api";
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
import type { RecipeData } from "../recipes.types";
import RecipeCommentInput from "../components/comments/RecipeCommentInput";
import RecipeComment from "../components/comments/RecipeComment";

const difficultyOptions:RadioOption[] = [
    {title: "Easy", value: "EASY"}, {title: "Medium", value: "MEDIUM"}, {title: "Hard", value: "HARD"}
]

type EditRecipeForm = {
    name: string;
    mealType: string;
    prepTime: string;
    difficulty: string;
    servings: string;
    tags: RecipeTag[];
    steps: RecipeStep[];
    ingredients: TypeIngredient[];
};

type EditRecipeFormError = {
    name: boolean;
    mealType: boolean;
    prepTime: boolean;
    difficulty: boolean;
    servings: boolean;
};

type EditRecipeViewProps = {
    recipe: RecipeData;
    fetchRecipe: () => void;
};

const EditRecipeView = ({recipe, fetchRecipe}:EditRecipeViewProps) => {

    const [editRecipeForm, setEditRecipeForm] = useState<EditRecipeForm>(
        {
            name: recipe.name,
            mealType: recipe.meal_type,
            prepTime: recipe.prep_time.toString(),
            difficulty: recipe.difficulty,
            servings: recipe.servings.toString(),
            tags: recipe.tags,
            ingredients: recipe.ingredients,
            steps: recipe.steps
        }
    );

    const [editRecipeFormError, setEditRecipeFormError] = useState<EditRecipeFormError>(
        {
            name: false,
            mealType: false,
            prepTime: false,
            difficulty: false,
            servings: false
        }
    );

    const imageRef = useRef<HTMLInputElement>(null);

    const {user} = useAuth();
    const [waiting, setWaiting] = useState<boolean>(false);
    
    const [feedback, setFeedback] = useState<string>("");
    const [errorTrigger, setErrorTrigger] = useState<number>(0);

    const [deleted, setDeleted] = useState<boolean>(false);

    const handleErrorDetected = () => {
        setErrorTrigger(t => (t+1)%100);
    }

    const addIngredient = (name: string, quantity: string) => {
        let q:number = parseFloat(quantity);
        setEditRecipeForm((prev) => ({
            ...prev, ingredients: [
                ...prev.ingredients, {name: name, quantity: q, recipe_id: 0, id: 0}
            ]
        }));
    }

    const removeIngredient = (ingredient: RecipeIngredient) => {
        setEditRecipeForm((prev) => ({
            ...prev, ingredients: prev.ingredients.filter((i) => i !== ingredient)
        }))
    }

    const addStep = (description: string) => {
        setEditRecipeForm((prev) => ({
            ...prev, steps: [
                ...prev.steps, {id: 0, description: description, recipe_id: 0, step_number: prev.steps.length+1}
            ]
        }))

        // handle rearraging steps by order
    }

    const removeStep = (step: RecipeStep) => {
        setEditRecipeForm((prev) => ({
            ...prev, steps: prev.steps.filter((s) => s !== step)
        }))
    }

    const addTag = (name: string) => {
        setEditRecipeForm((prev) => ({
            ...prev, tags: [
                ...prev.tags, {id: 0, name: name, recipe_id: 0}
            ]
        }))
    }

    const removeTag = (name: string) => {
        setEditRecipeForm((prev) => ({
            ...prev, tags: prev.tags.filter((tag) => tag.name !== name)
        }))
    }

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWaiting(true);
        
        const nameErr = editRecipeForm.name.trim() === "";
        const mealTypeErr = editRecipeForm.mealType.trim() === "";
        const difficultyErr = editRecipeForm.difficulty.trim() === "";
        const prepTimeErr = editRecipeForm.prepTime.trim() === "";
        const servingsErr = editRecipeForm.servings.trim() === "";
        
        setEditRecipeFormError({
            name: nameErr,
            mealType: mealTypeErr,
            difficulty: difficultyErr,
            prepTime: prepTimeErr,
            servings: servingsErr
        });

        if(nameErr || mealTypeErr || difficultyErr || prepTimeErr || servingsErr)  {
            handleErrorDetected();
            const defaultMessage = "All fields are required.";
            setFeedback(defaultMessage);
            setWaiting(false);
            return;
        }
        
        let formData:FormData = new FormData();
        formData.append("name", editRecipeForm.name);
        formData.append("meal_type", editRecipeForm.mealType);
        formData.append("prep_time", editRecipeForm.prepTime);
        formData.append("difficulty", editRecipeForm.difficulty);
        formData.append("servings", editRecipeForm.servings);
        const file = imageRef.current?.files?.[0];
        if(file) formData.append("image", file);
        formData.append("tags", JSON.stringify(editRecipeForm.tags.map(t => t.name)));
        formData.append("ingredients", JSON.stringify(editRecipeForm.ingredients.map(i => ({ name: i.name, quantity: i.quantity }))));
        formData.append("steps", JSON.stringify(editRecipeForm.steps.map(s => s.description)));

        try {
            await updateRecipe(recipe.id, formData);
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

    const handleDeleteClicked = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setWaiting(true);

        try {
            await deleteRecipe(recipe.id);
            setDeleted(true);
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

    const onCommentPostClicked = async (title: string, content: string, file?: File) => {
        setWaiting(true);
        let formData:FormData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if(file) formData.append("image", file);

        try {
            await createComment(formData, recipe.id.toString());
            await fetchRecipe();
        } catch (error: any) {
            //
        } finally {
            setWaiting(false);
        }
    }

    if(waiting) return <Loading size="medium" theme="dark"></Loading>

    if(deleted) {
        return <div>Recipe has been deleted.</div>
    }

    if(user && user.role === "author") return (
        <div className={styles.recipe_view}>
            <CreateRecipeForm onSubmit={onSubmit} feedback={feedback} title={"Update Your Recipe"} buttonText={"Update"}>
                <>
                    
                    <div className={styles.left_section}>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Name" type="text" value={editRecipeForm.name} onChange={(value) => setEditRecipeForm(prev => ({...prev, name: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Meal Type" type="text" value={editRecipeForm.mealType} onChange={(value) => setEditRecipeForm(prev => ({...prev, mealType: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Preparation Time  (minutes)" type="number" value={editRecipeForm.prepTime} onChange={(value) => setEditRecipeForm(prev => ({...prev, prepTime: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <RadioGroup key={errorTrigger} name="difficulty" title="Difficulty:" color="#94adab" fontColor="#000000" options={difficultyOptions} value={editRecipeForm.difficulty} onChange={(value) => setEditRecipeForm(prev => ({...prev, difficulty: value}))}></RadioGroup>
                        </FormRow>
                        <FormRow>
                            <TextInput key={errorTrigger} placeholder="Servings" type="number" value={editRecipeForm.servings} onChange={(value) => setEditRecipeForm(prev => ({...prev, servings: value}))}></TextInput>
                        </FormRow>
                        <FormRow>
                            <input ref={imageRef} style={{width: "100%"}} type="file" accept="image/*"></input>
                        </FormRow>
                        <FormRow>
                            <button onClick={(e) => handleDeleteClicked(e)} className={styles.delete_button}>Delete</button>
                        </FormRow>
                    </div>
                    <div className={styles.right_section}>
                        <FormRow direction="column" gap="10px">
                                <label style={{width: "100%", fontSize: "22px"}}>Ingredients</label>
                                {editRecipeForm.ingredients.map((ing, index) => (
                                    <Ingredient key={index} editable={true} ingredient={ing} onClick={removeIngredient}></Ingredient>
                                ))}
                                <IngredientInput onClick={addIngredient}></IngredientInput>
                        </FormRow>
                        <FormRow direction="column" gap="10px">
                                <label style={{width: "100%", fontSize: "22px"}}>Preparation Steps</label>
                                {editRecipeForm.steps.map((step, index) => (
                                    <PrepStep key={index} editable={true} step={step} onClick={removeStep}></PrepStep>
                                ))}
                                <PrepStepInput onClick={addStep}></PrepStepInput>
                        </FormRow>
                        
                        <label style={{width: "100%", fontSize: "22px"}}>Tags</label>
                        <div style={{maxWidth: "100%", display: "flex", flexWrap: "wrap", gap: "5px"}}>
                        </div>
                        <div style={{display: "flex", flexWrap: "wrap", gap: "4px"}}>
                            {editRecipeForm.tags.map((tag, index) => (
                                <Tag key={index} recipeTag={tag} editable={true} onClick={removeTag}></Tag>
                            ))}
                        </div>
                        <TagInput onClick={addTag}></TagInput>
                    </div>
                </>
            </CreateRecipeForm>
            <div className={styles.bottom_section}>
                <RecipeCommentInput onClick={onCommentPostClicked}></RecipeCommentInput>
                {recipe.comments.map((comment, index) => <RecipeComment key={comment.id} comment={comment}></RecipeComment>)}
            </div>
        </div> 
    );
}
export default EditRecipeView;