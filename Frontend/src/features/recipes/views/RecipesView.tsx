import { useEffect, useState } from "react";
import Recipe from "../../../features/recipes/components/recipe/Recipe";
import styles from "./RecipeViews.module.css";
import type { MyRecipesInfo, RecipeCardData } from "../recipes.types";
import { getAllRecipes, getMyRecipesInfo, toggleFavorite } from "../recipes.api";
import Loading from "../../../components/loading/Loading";
import { useAuth } from "../../auth/useAuth";

const RecipesView = () => {
 
    const {user} = useAuth();

    const [recipes, setRecipes] = useState<RecipeCardData[]>([]);
    const [myRecipesInfo, setMyRecipesInfo] = useState<MyRecipesInfo | null>(null);
    const [waiting, setWaiting] = useState<boolean>(false);

    useEffect(() => {
        fetchRecipes();
        fetchMyRecipesInfo();
    }, []);

    const fetchRecipes = async () => {
        setWaiting(true);
        try{
            const data:RecipeCardData[] = await getAllRecipes();
            setRecipes(data);
            console.log(data);
        } catch{
            setRecipes([]);
        } finally {
            setWaiting(false);
        }
    }

    const fetchMyRecipesInfo = async () => {
        setWaiting(true)
        try {
            const data:MyRecipesInfo = await getMyRecipesInfo();
            setMyRecipesInfo(data);
            console.log(data)
        } catch {
            setMyRecipesInfo(null);
        } finally {
            setWaiting(false);
        }
    }

    const handleOnFavorite = async (recipeId: number) => {
        setWaiting(true);
        try{
            await toggleFavorite(recipeId);
            if(myRecipesInfo) {
                setMyRecipesInfo(prev => {
                    if(!prev) return prev;
                    
                    const isFavorite = prev.favorite_ids.includes(recipeId);

                    return {
                        ...prev,
                        favorite_ids: isFavorite ? prev.favorite_ids.filter(id => id !== recipeId) : [...prev.favorite_ids, recipeId]
                    }
                });
            }
        } catch {
            //
        } finally {
            setWaiting(false);
        }
    }

    if(waiting) return <Loading size="medium" theme="dark"></Loading>

    return (
        myRecipesInfo && 
        <div className={styles.recipes_view}>
            {recipes.map((item, index) => (
                <Recipe key={index} currentUserId={user?.id} recipeData={item} isFavorite={myRecipesInfo.favorite_ids.includes(item.id)} interactable={true} onFavorite={(recipeId) => handleOnFavorite(recipeId)}></Recipe>
            ))}
        </div>
    );
}
export default RecipesView;