import { createBrowserRouter } from "react-router-dom";
import NotFoundView from "../components/error/NotFoundView";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LoadingView from "../components/loading/LoadingView";
import LoginView from "../features/auth/views/LoginView";
import RegisterView from "../features/auth/views/RegisterView";
import ViewLayout from "../layouts/view/ViewLayout";
import RoleRedirect from "./RoleRedirect";
import AuthWidget from "../features/auth/components/auth_widget/AuthWidget";
import MainViewLayout from "./MainViewLayout";
import { CreateRecipeView, RecipesView, RecipeView, RecipeWrapper } from "../features/recipes";

export const router = createBrowserRouter([
    {
        element: <PublicRoute><LoginView/></PublicRoute>,
        path: "/login"
    },
    {
        element: <PublicRoute><RegisterView /></PublicRoute>,
        path: "/register"
    },
    {
        element: <LoadingView></LoadingView>,
        path: "/dev"
    },
    {
        element: <ProtectedRoute><MainViewLayout /></ProtectedRoute>,
        path: "/",
        children: [
            {
                element: <RoleRedirect></RoleRedirect>,
                index: true
            },
            {
                path: "recipes",
                children: [
                    {element: <RecipesView />, index: true},
                    {element: <RecipeWrapper></RecipeWrapper>, path: ":id"},
                    {element: <CreateRecipeView />, path: "create"}
                ]
            },
            {
                path: "profile",
                children: [
                    {element: <div>EDIT PROFILE</div>, index: true}
                ]
            },
            {
                path: "users",
                children: [
                    {element: <div>ALL USERS</div>, path:"all", index: true}
                ]
            }
        ]
    },
    {
        element: <NotFoundView />,
        path: "*"
    }
]);