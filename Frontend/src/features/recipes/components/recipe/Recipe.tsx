import { useRef, useState } from 'react';
import emptyHeart from '../../../../../public/empty_heart.png';
import fullHeart from '../../../../../public/full_heart.png';
import halvedHeart from '../../../../../public/halved_heart.png';
import styles from './Recipe.module.css';

const Recipe = () => {
    const [favouriteHovered, setFavouriteHovered] = useState<boolean>(false);

    return (
        <div className={styles.recipe}>
            <div className={styles.image_section}>
                <img src='/pasulj.jpg'></img>
                <div className={styles.description}>
                    <div className={styles.difficulty}>
                        <span>Hard</span>
                    </div>
                    <div className={styles.time}>
                        <span>90 min</span>
                    </div>
                </div>
            </div>
            <div className={styles.info_section}>
                <div className={styles.title}>Pasulj corba za 10 osoba</div>
                <div className={styles.type}>Corba</div>
                <div className={styles.options}>
                    <div className={styles.favourite}>
                        <img src={favouriteHovered ? fullHeart : emptyHeart} onMouseEnter={() => setFavouriteHovered(true)} onMouseLeave={() => setFavouriteHovered(false)}></img>
                    </div>
                    <div className={styles.preview}>
                        <button>View</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Recipe;