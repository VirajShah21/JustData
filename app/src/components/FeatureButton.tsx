import { HStack } from 'reaction';
import './FeatureButton.css';

function FeatureButton(props: { icon?: JSX.Element; label?: string; active?: boolean }) {
    return (
        <button className={`feature-button${props.active ? ' active' : ''}`}>
            <HStack className='feature-button-inside gradient-text'>
                {props.icon && <span className='feature-button-icon'>{props.icon}</span>}
                {props.label && <span>{props.label}</span>}
            </HStack>
        </button>
    );
}

export default FeatureButton;
