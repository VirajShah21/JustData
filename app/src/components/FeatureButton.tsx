import { HStack } from 'reaction';
import './FeatureButton.css';

/**
 * A react component for a feature button, to be displayed on each Just Data service.
 *
 * If no icon or label is provided, then the button will leave it out.
 *
 * If active is not assigned or set to false, then the button will not be filled in.
 * If the active is assigned to true, then it will be filled in to indicate that the
 * current feature is being used.
 *
 * @param props - The props for the component.
 * @returns A pill-shaped button with the specified icon and label
 */
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
