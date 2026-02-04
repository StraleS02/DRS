import styles from "./DateInput.module.css";

type DateInputProps = {
    error?: boolean;
    value: string;
    onChange: (value:string) => void;
};

const DateInput = ({error, value, onChange}:DateInputProps) => {
    
    return (
        <input className={`${styles.date_input} ${error ? styles.error : ""}`} type="date" value={value} onChange={(e) => onChange(e.target.value)}></input>
    );
}
export default DateInput;