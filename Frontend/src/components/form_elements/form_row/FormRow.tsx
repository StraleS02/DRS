import styles from "./FormRow.module.css";

type FormRowProps = {
    children: React.ReactNode;
    direction?: "row" | "column";
    gap?: string;
};

const FormRow = ({children, direction, gap}:FormRowProps) => {
    return (
        <div className={styles.form_row} style={{flexDirection: direction, gap: gap}}>{children}</div>
    );
}
export default FormRow;