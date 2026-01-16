import styles from "./Form.module.css";

type DropdownInputProps = {
    value: string;
    title: string;
    elements: string[];
    onChange: (value: string) => void;
};

const DropdownInput = ({title, elements, value, onChange}: DropdownInputProps) => {
    return (
        <div className={styles.dropdown_input}>
            <label>{title + ":"}</label>
            <select onChange={(e) => onChange(e.target.value)}>
                {elements.map(element => <option key={element} value={element}>{element}</option>)}
            </select>
        </div>
    );
}
export default DropdownInput;