import PageLayout from "../../layouts/view/PageLayout";
import Navbar from "../../layouts/navbar/Navbar";
import { getNavbarItemsByRole } from "../../lib/constants/navbar_items";
import Recipe from "./components/recipe/Recipe";
import styles from './RecipePages.module.css';

const ViewRecipesPage = () => {
    const placeholderArray = Array.from({length: 11});

    return (
        <PageLayout header={<Navbar items={getNavbarItemsByRole('author')}/>} content={(
            <div className={styles.recipes_page}>
            {placeholderArray.map((_, index) => (
                <Recipe key={index}></Recipe>
            ))}
        </div>
        )}></PageLayout>
    );
}
export default ViewRecipesPage;