import styles from "./TextInput.module.css";

type TextInputProps = {
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
};

const TextInput = ({type, onChange, value, placeholder, error}:TextInputProps) => {
    return (
        <input className={`${styles.text_input} ${error ? styles.error : ""}`} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}></input>
    );
}
export default TextInput;