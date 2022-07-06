import './TextBox.css';

export interface TextBoxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function TextBox({ value, onChange, placeholder, className }: TextBoxProps) {
    function getClassName() {
        return className ? `text-box ${className}` : 'text-box';
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
