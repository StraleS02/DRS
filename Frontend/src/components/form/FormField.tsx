import type { ReactNode } from "react";
import styles from "./Form.module.css";

type FormFieldProps = {
    children: ReactNode;
}

const FormField = ({children}:FormFieldProps) => {
    return (
        <div className={styles.form_field}>
            {children}
        </div>
    );
}
export default FormField;