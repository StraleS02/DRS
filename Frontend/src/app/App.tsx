import { RouterProvider } from "react-router-dom";
import {router} from "./Router";
import AuthProvider from "./AuthProvider";

const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
    );
}
export default App;