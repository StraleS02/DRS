import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ViewRecipesPage from "../features/recipes/ViewRecipesPage";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}></Route>
                <Route path="/auth/login" element={<LoginPage/>}></Route>
                <Route path="/auth/register" element={<RegisterPage/>}></Route>
                
                <Route path="/recipes/all" element={<ViewRecipesPage/>}></Route>
                <Route path="/recipes/:recipeId"></Route>
                <Route path="/recipes/"></Route>
                <Route path="/profile/"></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default Router;