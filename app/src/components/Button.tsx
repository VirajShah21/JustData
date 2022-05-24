import './Button.css';

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
