import styles from "./SubmitButton.module.css";

type SubmitButtonProps = {
    title:string;
};

const SubmitButton = ({title}:SubmitButtonProps) => {

    return (
        <input type="submit" value={title} className={styles.submit_button}></input>
    );
}
export default SubmitButton;