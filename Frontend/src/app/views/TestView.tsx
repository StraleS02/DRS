import { useAuth } from "../../features/auth/useAuth";
import ViewLayout from "../../layouts/view/ViewLayout";

const TestView = () => {
    const {user} = useAuth();

    return (
        <div>Hellooo</div>
    );
}
export default TestView;