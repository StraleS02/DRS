import styles from "./FormColumn.module.css";

type FormColumnProps = {
    children: React.ReactNode;
    flex: string;
};

const FormColumn = ({children, flex}:FormColumnProps) => {
    return (
        <div className={styles.form_column} style={{flex: flex}}>{children}</div>
    );
}
export default FormColumn;