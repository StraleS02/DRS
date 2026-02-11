import { useEffect, useState } from "react";
import styles from "./RecipeViews.module.css";
import Loading from "../../../components/loading/Loading";
import { createComment, getRecipeById, rateRecipe } from "../recipes.api";
import type { RecipeData } from "../recipes.types";
import RecipeComment from "../components/comments/RecipeComment";
import  type {RecipeComment as RecipeCommentType} from "../../../lib/types/RecipeComment";
import RecipeCommentInput from "../components/comments/RecipeCommentInput";
import Ingredient from "../components/ingredients/Ingredient";
import Tag from "../components/tags/Tag";
import PrepStep from "../components/steps/PrepStep";
import { useAuth } from "../../auth";
import EditRecipeView from "./EditRecipeView";
import NotFoundView from "../../../components/error/NotFoundView";

const RecipeView = ({recipeId}:{recipeId: string}) => {

    const {user} = useAuth();
    
    const [waiting, setWaiting] = useState<boolean>(false);
    const [rating, setRating] = useState<string>("");

    const [recipe, setRecipe] = useState<RecipeData | null>(null);

    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {
        fetchRecipe();
    }, [recipeId]);

    const fetchRecipe = async () => {
        setWaiting(true);
        try{
            const data = await getRecipeById(recipeId);
            setRecipe(data);
            console.log(data);
        } catch {
            setNotFound(true);
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
            await createComment(formData, recipeId);
            await fetchRecipe();
        } catch (error: any) {
            //
        } finally {
            setWaiting(false);
        }
    }

    const handleRateButtonClicked = async () => {
        setWaiting(true);
        try{
            await rateRecipe(Number.parseInt(rating), recipeId);
            setRating("");
        } catch {
            //
        } finally {
            setWaiting(false);
        }
    }

    if(waiting) return <Loading size="medium" theme="dark"></Loading>

    if(notFound) return <NotFoundView></NotFoundView>
    
    if(recipe && (recipe.author.id === user?.id)) return <EditRecipeView fetchRecipe={fetchRecipe} recipe={recipe}></EditRecipeView>

    return recipe ? 
    (
        <div className={styles.recipe_view}>
            <div className={styles.upper_section}>
                <div className={styles.left_section}>
                    <div className={styles.image}>
                        <img src={recipe.image} alt={recipe.image}></img>
                    </div>
                    <div className={styles.info_row}>
                        <div className={styles.row_title}>{"Name: "}</div>
                        <div className={styles.row_content}>{recipe.name}</div>
                    </div>
                    <div className={styles.info_row}>
                        <div className={styles.row_title}>{"Type: "}</div>
                        <div className={styles.row_content}>{recipe.meal_type}</div>
                    </div>
                    <div className={styles.info_row}>
                        <div className={styles.row_title}>{"Servings: "}</div>
                        <div className={styles.row_content}>{recipe.servings}</div>
                    </div>
                    <div className={styles.info_row}>
                        <div className={styles.row_title}>{"Preparation Time: "}</div>
                        <div className={styles.row_content}>{recipe.prep_time + " minutes"}</div>
                    </div>
                    <div className={styles.info_row}>
                        <div className={styles.row_title}>{"Difficulty: "}</div>
                        <div className={styles.row_content}>{recipe.difficulty.charAt(0) + recipe.difficulty.slice(1).toLowerCase()}</div>
                    </div>
                    <div className={styles.info_row}>
                        <div className={styles.row_title}>{"Average Rating: "}</div>
                        <div className={styles.row_content}>{recipe.average_rating}</div>
                    </div>
                    {user?.id !== recipe.author.id && (
                        <div className={styles.rating}>
                        <div className={styles.row_title}>{"Rate: "}</div>
                        <div className={styles.row_content}>
                            <input type="number" min="1" max="5" onChange={(e) => setRating(e.target.value)}></input>
                        </div>
                        <div className={styles.row_content}>
                            <button onClick={() => handleRateButtonClicked()} disabled={rating === ""}>Confirm</button>
                        </div>
                    </div>
                    )}
                </div>
                <div className={styles.right_section}>
                    <div className={styles.lists}>
                        <div className={styles.list_title}>Ingredients:</div>
                        <div className={styles.list_of_elements}>
                            {recipe.ingredients.map((ingr, index) => <Ingredient key={ingr.id} editable={false} ingredient={ingr} onClick={() => null} ></Ingredient>)}
                        </div>
                    </div>
                    <div className={styles.lists}>
                        <div className={styles.list_title}>Steps:</div>
                        <div className={styles.list_of_elements}>
                            {recipe.steps.map((step, index) => <PrepStep key={step.id} step={step} editable={false} onClick={() => null}></PrepStep>)}
                        </div>
                    </div>
                    <div className={styles.lists}>
                        <div className={styles.list_title}>Tags:</div>
                        <div  className={styles.list_of_tags}>
                            {recipe.tags.map((tag, index) => <Tag key={tag.id} recipeTag={tag} editable={false} onClick={() => null}></Tag>)}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.bottom_section}>
                <RecipeCommentInput onClick={onCommentPostClicked}></RecipeCommentInput>
                {recipe.comments.map((comment, index) => <RecipeComment key={comment.id} comment={comment}></RecipeComment>)}
            </div>
        </div>
    ) : 
    (<div>Error fetching recipe with ID: {recipeId}</div>)
}
export default RecipeView;