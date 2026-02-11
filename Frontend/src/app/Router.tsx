import { createBrowserRouter } from "react-router-dom";
import NotFoundView from "../components/error/NotFoundView";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LoadingView from "../components/loading/LoadingView";
import LoginView from "../features/auth/views/LoginView";
import RegisterView from "../features/auth/views/RegisterView";
import RoleRedirect from "./RoleRedirect";
import MainViewLayout from "./MainViewLayout";
import { CreateRecipeView, RecipeAuthorWrapper, RecipesView, RecipeView, RecipeWrapper } from "../features/recipes";
import { EditProfileView, UserRequestsView } from "../features/users";
import UsersView from "../features/users/views/UsersView";
import UserReportView from "../features/users/views/UserReportView";

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
                    {element: <RecipeWrapper></RecipeWrapper>, path: ":recipeId"},
                    {element: <CreateRecipeView />, path: "create"},
                    {element: <RecipeAuthorWrapper></RecipeAuthorWrapper>, path: "authors/:authorId"}
                ]
            },
            {
                path: "profile",
                children: [
                    {element: <EditProfileView></EditProfileView>, index: true}
                ]
            },
            {
                path: "users",
                children: [
                    {element: <UsersView></UsersView>, index: true},
                    {element: <UserRequestsView></UserRequestsView>, path: "requests"},
                    {element: <UserReportView></UserReportView>, path: "report"}
                ]
            }
        ]
    },
    {
        element: <NotFoundView />,
        path: "*"
    }
]);