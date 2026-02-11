import type { RecipeStep } from "../../../../lib/types/RecipeStep";
import styles from "./PrepStep.module.css";

type PrepStepProps = {
    step: RecipeStep;
    editable: boolean;
    onClick: (step: RecipeStep) => void;
};

const PrepStep = ({step, editable, onClick}:PrepStepProps) => {
    return (
        <div className={styles.prep_step}>
            <div className={styles.number}>{step.step_number}</div>
            <div className={styles.description}>{step.description}</div>
            {editable && <button type="button" onClick={() => onClick(step)}>Drop</button>}
        </div>
    );
}
export default PrepStep;