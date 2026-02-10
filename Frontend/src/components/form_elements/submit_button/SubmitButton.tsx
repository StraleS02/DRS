import styles from "./SubmitButton.module.css";

type SubmitButtonProps = {
    title:string;
    formId?:string; 
};

const SubmitButton = ({title, formId}:SubmitButtonProps) => {

    return (
        <input type="submit" value={title} className={styles.submit_button} form={formId ?? undefined}></input>
    );
}
export default SubmitButton;