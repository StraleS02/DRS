import { BrowserRouter, Route, Routes } from "react-router-dom";
import RecipesView from "./views/recipes/RecipesView";
import CreateRecipeView from "./views/recipes/CreateRecipeView";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import RecipeWrapper from "./views/recipes/RecipeWrapper";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginView/>}></Route>
                <Route path="/auth/login" element={<LoginView/>}></Route>
                <Route path="/auth/register" element={<RegisterView/>}></Route>
                
                <Route path="/recipes/all" element={<RecipesView/>}></Route>
                <Route path="/recipes/:recipeId" element={<RecipeWrapper></RecipeWrapper>}></Route>
                <Route path="/recipes/create" element={<CreateRecipeView></CreateRecipeView>}></Route>
                <Route path="/profile/"></Route>

                <Route path="*" element={<div>Page Not found</div>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default Router;