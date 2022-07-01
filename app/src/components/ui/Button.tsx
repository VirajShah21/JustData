import './Button.css';

/**
 * A React component for a button. This uses the Just Data design guidelines the
 * button's theme.
 *
 * @param props - Basic JSX properties, onClick, and className.
 * @returns A react component which renders a themed button.
 */
function Button(props: { children?: React.ReactNode; onClick?: () => void; className?: string }) {
    return (
        <button
            className={`button-component ${props.className}`.trim()}
            onClick={() => props.onClick?.()}>
            {props.children}
        </button>
    );
}

export default Button;
