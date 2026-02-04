import styles from "./RadioGroup.module.css";

export type RadioOption = {
    title: string;
    value: string;
};

type RadioGroupProps = {
    title?: string;
    name: string;
    value: string | null;
    options: RadioOption[];
    onChange: (value: string) => void;
    color?: string;
    fontColor?: string;
};

const RadioGroup = ({title, name, value, options, onChange, color, fontColor}:RadioGroupProps) => {
    
    return (
        <div className={styles.radio_group}>
            <div className={styles.section_title}>
                <label className={styles.title} style={{color: fontColor}}>{title}</label>
            </div>
            <div className={styles.section_options}>
                {options.map((option, index) => (
                    <label key={index} className={styles.option_title} style={{borderColor: color, color: fontColor}}>{option.title}&nbsp;
                        <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={(e) => onChange(e.target.value)} style={{accentColor: color}}></input>
                    </label>
                ))}
            </div>
      </div>
    );
};
export default RadioGroup;