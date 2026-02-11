import { useEffect, useState } from "react";
import styles from "./RecipeViews.module.css";
import { getAuthor } from "../recipes.api";
import { type RecipeAuthorDataResponse } from "../recipes.types";
import Recipe from "../components/recipe/Recipe";
import Loading from "../../../components/loading/Loading";

const RecipeAuthorView = ({authorId}:{authorId: string}) => {

    const [waiting, setWaiting] = useState<boolean>(false);
    const [data, setData] = useState<RecipeAuthorDataResponse | null>(null);

    useEffect(() => {
        fetchRecipeAuthor(authorId);
    }, [authorId]);

    const fetchRecipeAuthor = async (authorId: string) => {
        setWaiting(true);
        try{
            const data = await getAuthor(authorId);
            setData(data)
            console.log(data)
        }catch{
            setData(null);
        } finally {
            setWaiting(false);
        }
    }

    if(waiting) return <Loading size="medium" theme="dark"></Loading>

    return (
        data ? (
            <div className={styles.recipe_author_view}>
                {data.author.profile_image && (
                    <div className={styles.author_row}>
                        <img src={data.author.profile_image} alt={data.author.profile_image}></img>
                    </div>
                )}
                <div className={styles.author_row}>
                    <div className={styles.row_title}>{"Email: "}</div>
                    <div className={styles.row_content}>{data.author.email}</div>
                </div>
                <div className={styles.author_row}>
                    <div className={styles.row_title}>{"First Name: "}</div>
                    <div className={styles.row_content}>{data.author.first_name}</div>
                </div>
                <div className={styles.author_row}>
                    <div className={styles.row_title}>{"Last Name: "}</div>
                    <div className={styles.row_content}>{data.author.last_name}</div>
                </div>
                <div className={styles.author_row}>
                    <div className={styles.row_title}>{"Date Joined: "}</div>
                    <div className={styles.row_content}>{new Date(data.author.joined_at).toLocaleString()}</div>
                </div>
                <div className={styles.author_row}>
                    <div className={styles.row_title}>{"Total Recipes: "}</div>
                    <div className={styles.row_content}>{data.author.total_recipes}</div>
                </div>
                <div className={styles.author_row}>
                    <div className={styles.row_title}>{"Average Rating: "}</div>
                    <div className={styles.row_content}>{data.author.average_rating}</div>
                </div>
                <div style={{padding: "5px", fontSize: "18px"}}> List of {" " + data.author.first_name +"'s" + " recipes:"}</div>
                <div className={styles.recipe_list}>
                    {data.recipes.map(recipeCard => (
                        <Recipe key={recipeCard.id} isFavorite={false} recipeData={recipeCard} interactable={false} currentUserId={0}></Recipe>
                    ))}
                </div>
            </div>
        ) : 
        <div>Failed to fetch data. ID: {authorId}</div>
    );
}
export default RecipeAuthorView;