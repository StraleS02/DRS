import styles from "./FormRow.module.css";

type FormRowProps = {
    children: React.ReactNode;
};

const FormRow = ({children}:FormRowProps) => {
    return (
        <div className={styles.form_row}>{children}</div>
    );
}
export default FormRow;