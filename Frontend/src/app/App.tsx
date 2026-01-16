import { AuthProvider } from "./AuthContext";
import Router from "./Router";

const App = () => {
    return (
        <AuthProvider>
            <Router></Router>
        </AuthProvider>
    );
}
export default App;