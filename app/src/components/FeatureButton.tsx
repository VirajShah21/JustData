import { HStack } from 'reaction';
import './FeatureButton.css';

function FeatureButton(props: {
    icon?: JSX.Element;
    label?: string;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className={`feature-button${props.active ? ' active' : ''}`}
            onClick={() => props.onClick()}>
            <HStack className='feature-button-inside gradient-text'>
                {props.icon && <span className='feature-button-icon'>{props.icon}</span>}
                {props.label && <span>{props.label}</span>}
            </HStack>
        </button>
    );
}

export default FeatureButton;
