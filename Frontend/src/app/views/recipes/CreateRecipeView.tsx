import PageLayout from "../../../layouts/view/PageLayout";
import Navbar from "../../../layouts/navbar/Navbar";
import { getNavbarItemsByRole } from "../../../lib/constants/navbar_items";
import styles from "./RecipeViews.module.css";
import CreateRecipeForm from "../../../features/recipes/components/forms/CreateRecipeForm";
import type { Recipe } from "../../../lib/types/Recipe";
import type { CreateRecipeRequest, CreateRecipeResponse } from "../../../features/recipes";
import { postRecipe } from "../../../features/recipes/recipes.api";
import { useState } from "react";

const CreateRecipeView = () => {

    const [feedback, setFeedback] = useState<string>("");

    const onSubmit = async (createRecipeFormData:FormData) => {
        const data:CreateRecipeResponse = await postRecipe(createRecipeFormData);
        if(!data.success) {
            setFeedback(data.message);
        }
        
        console.log("test");
    }

    return (
        <PageLayout header={<Navbar items={getNavbarItemsByRole('author')}></Navbar>} content={(
            <div className={styles.create_recipe_view}>
                <div className={styles.title}>Create Recipe</div>
                <CreateRecipeForm onSubmit={onSubmit}></CreateRecipeForm>
                <div>{feedback}</div>
            </div>
        )}>

        </PageLayout>
    );
}
export default CreateRecipeView;