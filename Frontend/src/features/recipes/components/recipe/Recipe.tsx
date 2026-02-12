import {  useState } from 'react';
import emptyHeart from '/empty_heart.png';
import fullHeart from '/full_heart.png';
import halvedHeart from '/halved_heart.png';
import styles from './Recipe.module.css';
import type { RecipeCardData } from '../../recipes.types';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../../utils/image_resolver';

type RecipeProps = {
    currentUserId?: number;
    recipeData: RecipeCardData;
    isFavorite: boolean;
    interactable: boolean;
    onFavorite?: (id:number) => void;
};

const Recipe = ({interactable, isFavorite, currentUserId, recipeData, onFavorite}:RecipeProps) => {
    
    const [favoriteHovered, setFavoriteHovered] = useState<boolean>(false);
    const currentHeart = isFavorite ? fullHeart : emptyHeart;

    const difficultyColor = (difficulty:string, alpha = 1) => {
        if(difficulty === `HARD`) {
            return `rgba(248, 0, 0, ${alpha})`;
        }else if(difficulty === `MEDIUM`) {
            return `rgba(219, 190, 0, ${alpha})`;
        }else{
            return `rgba(0, 160, 84, ${alpha})`;
        }
    }

    return (
        <div className={styles.recipe}>
            <div className={styles.image_section}>
                <img src={getImageUrl(recipeData.image)} alt={recipeData.image}></img>
                <div className={styles.description} style={{background: `linear-gradient(to right, ${difficultyColor(recipeData.difficulty, 0.7)}, rgba(255, 255, 255, 0.7))`}}>
                    <div className={styles.difficulty}>
                        <span>{recipeData.difficulty}</span>
                    </div>
                    <div className={styles.time}>
                        <span>{recipeData.prep_time + " min"}</span>
                    </div>
                </div>
            </div>
            <div className={styles.info_section}>
                <div className={styles.title}>{recipeData.name}</div>
                <div className={styles.type}>{recipeData.meal_type}</div>
                {interactable && (
                    <div className={styles.author}>By:&nbsp;
                        <Link to={`/recipes/authors/${recipeData.author.id}`}>{recipeData.author.last_name + " " + recipeData.author.first_name}</Link>
                    </div>)}
                {interactable && (
                    <div className={styles.options}>
                        <div className={styles.favorite}>
                            <img src={favoriteHovered ? (currentHeart === emptyHeart ? fullHeart : halvedHeart) : currentHeart} onMouseEnter={() => setFavoriteHovered(true)} onMouseLeave={() => setFavoriteHovered(false)} onClick={onFavorite ? () => onFavorite(recipeData.id) : undefined}></img>
                        </div>
                        <div className={styles.preview}>
                            <Link to={`/recipes/${recipeData.id}`}>{currentUserId === recipeData.author.id ? "Edit" : "View"}</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Recipe;