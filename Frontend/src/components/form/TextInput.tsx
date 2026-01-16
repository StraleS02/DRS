import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Form.module.css";

type TextInputProps = InputHTMLAttributes<HTMLElement>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    return (
        <input className={styles.string_input} ref={ref} {...props}></input>
    );
})
export default TextInput;