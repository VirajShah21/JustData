import styles from './TextBox.module.css';

export interface TextBoxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * Generates a basic long-field text box input comonent.
 *
 * @param props.value - The string value of the text box.
 * @param props.onChange - The function to call when the text box value changes.
 * @param props.placeholder - The placeholder text to display in the text box when value is empty.
 * @param props.className - The class name to apply to the text box.
 * @returns The text box component.
 */
export default function TextBox({ value, onChange, placeholder, className }: TextBoxProps) {
    function getClassName() {
        return className ? `${styles.textbox} ${className}` : styles.textbox;
    }

    return (
        <textarea
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            className={getClassName()}
        />
    );
}
