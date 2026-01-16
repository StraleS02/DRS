import PageLayout from "../../layouts/view/PageLayout";
import Navbar from "../../layouts/navbar/Navbar";
import { getNavbarItemsByRole } from "../../lib/constants/navbar_items";
import styles from "./RecipePages.module.css";

const CreateRecipePage = () => {
    return (
        <PageLayout header={<Navbar items={getNavbarItemsByRole('author')}></Navbar>} content={(
            <div className={styles.recipes_page}>
                <div className={styles.create_recipe_page}>
                    <div className={styles.title}>Create Recipe</div>
                    <form>
                        <input type="text" placeholder="Name"></input>
                        <label>Type:</label>
                        <select>
                            <option>Stew</option>
                            <option>Dessert</option>
                        </select>
                        <input type="number" placeholder="Minutes"></input>
                        <label>Preparation Difficulty:<br/>
                            <label>Easy
                                <input type='radio' name="difficulty"></input>
                            </label>
                            <label>Medium
                                <input type='radio' name="difficulty"></input>
                            </label>
                            <label>Hard
                                <input type='radio' name="difficulty"></input>
                            </label>
                        </label>
                        <input type="number" placeholder="Number of people"></input>
                        <input type="text" placeholder="Ingredients"></input>
                        <input type="text" placeholder="Steps"></input>
                        <input type="file" accept="image/*"></input>
                        <select multiple title="Tags">
                            <option>Familly</option>
                            <option>Light</option>
                        </select>
                        <input type="submit" value="Create"></input>
                    </form>
                </div>
            </div>
        )}>

        </PageLayout>
    );
}
export default CreateRecipePage;