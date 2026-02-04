import { RouterProvider } from "react-router-dom";
import {router} from "./router";
import AuthProvider from "./AuthProvider";

const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
    );
}
export default App;