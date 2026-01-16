import PageLayout from "../../layouts/view/PageLayout";
import Navbar from "../../layouts/navbar/Navbar";
import { getNavbarItemsByRole } from "../../lib/constants/navbar_items";
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