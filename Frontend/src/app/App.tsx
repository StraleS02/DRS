import PageLayout from "../components/layout/PageLayout";
import Navbar from "../components/navbar/Navbar";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import Recipe from "../features/recipes/components/recipe/Recipe";
import ViewRecipesPage from "../features/recipes/ViewRecipesPage";
import ViewRecipes from "../features/recipes/ViewRecipesPage";
import { AuthProvider } from "./AuthContext";
import Router from "./Router";

function App() {
  
  return (
    <AuthProvider>
      <Router></Router>
    </AuthProvider>
  );
}

export default App
