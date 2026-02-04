import { Link } from "react-router-dom";
import styles from "./AuthForm.module.css";
import FormRow from "../../../../components/form_elements/form_row/FormRow";
import SubmitButton from "../../../../components/form_elements/submit_button/SubmitButton";

type AuthFormProps = {
    title: string;
    children: React.ReactNode;
    onSubmit: (e:React.FormEvent<HTMLFormElement>) => void;
    swapPath: string;
    swapTitle: string;
    feedback: string;
}; 

const AuthForm = ({title, children, onSubmit, swapPath, swapTitle, feedback}:AuthFormProps) => {
    return (
        <div className={styles.auth_form}>
            <div className={styles.main_section}>
                <div className={styles.title}>{title}</div>
                <form onSubmit={(e) => onSubmit(e)}>
                    {children}
                </form>
                <div className={styles.feedback} style={{opacity: feedback === "" ? 0 : 1, backgroundColor: feedback === "Success" ? "rgb(178, 255, 194)" : "rgb(253, 196, 196)"}}>
                    <span>{feedback}</span>
                </div>
            </div>
            <div className={styles.swap_section}>
                <Link className={styles.swap_link} to={swapPath}>{swapTitle}</Link>
            </div>
        </div>
    );
}
export default AuthForm;