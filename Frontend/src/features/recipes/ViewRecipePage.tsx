import PageLayout from "../../components/layout/PageLayout";
import Navbar from "../../components/navbar/Navbar";
import { getNavbarItemsByRole } from "../../constants/navbar_items";
import styles from './RecipePages.module.css';

const ViewRecipePage = ({recipeId}:{recipeId: string}) => {
    console.log(recipeId);

    return (
        <PageLayout header={<Navbar items={getNavbarItemsByRole('author')}></Navbar>} content={(
            <div className={styles.recipes_page}>

            </div>
        )}>

        </PageLayout>
    );
}
export default ViewRecipePage;