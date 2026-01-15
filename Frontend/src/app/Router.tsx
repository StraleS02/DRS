import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ViewRecipesPage from "../features/recipes/ViewRecipesPage";
import RecipeWrapper from "../features/recipes/RecipeWrapper";
import CreateRecipePage from "../features/recipes/CreateRecipePage";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}></Route>
                <Route path="/auth/login" element={<LoginPage/>}></Route>
                <Route path="/auth/register" element={<RegisterPage/>}></Route>
                
                <Route path="/recipes/all" element={<ViewRecipesPage/>}></Route>
                <Route path="/recipes/:recipeId" element={<RecipeWrapper></RecipeWrapper>}></Route>
                <Route path="/recipes/create" element={<CreateRecipePage></CreateRecipePage>}></Route>
                <Route path="/profile/"></Route>

                <Route path="*" element={<div>Page Not found</div>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default Router;