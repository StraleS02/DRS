import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Form.module.css";

type FileInputProps = InputHTMLAttributes<HTMLElement>;

const FileInput = forwardRef<HTMLInputElement, FileInputProps>((props, ref) => {
    return (
        <input className={styles.file_input} ref={ref} {...props} type="file" accept="image/*"></input>
    );
});
export default FileInput;