import './Button.css';

function Button(props: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button className='button-component' onClick={() => props.onClick?.()}>
            {props.children}
        </button>
    );
}

export default Button;
