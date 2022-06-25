import { IonIcon } from '@ionic/react';
import { chevronDown } from 'ionicons/icons';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import './DropdownMenu.css';

type ValueLabelPair = { value: string; label: string };

/**
 * A React component for a dropdown menu. It behaves pretty much the same as the built-in
 * HTML `<select>` element, but is themed to match the Just Data design guidelines.
 *
 * @param props - Properties to define the behavior/appearance of the dropdown menu:
 * - `options` - An array of `ValueLabelPair` objects (`{ value: string, label: string }`).
 * - `placeholder` - Default text to display when no value is selected.
 * - `default` - The default selected value-label pair.
 * - `onChange` - A callback function to be called when the value changes.
 * @returns The dropdown menu component.
 */
function DropdownMenu(props: {
    options: ValueLabelPair[];
    placeholder?: string;
    default?: ValueLabelPair;
    onChange: (selected: ValueLabelPair) => void;
}) {
    const [selected, setSelected] = useState(
        props.default ?? { value: '', label: props.placeholder ?? 'Select an Item' },
    );
    const [showingDropdown, setShowingDropdown] = useState(false);

    return (
        <VStack
            className='dropdown-menu'
            height='auto'
            onClick={() => setShowingDropdown(!showingDropdown)}>
            <HStack className='dropdown-box' width='auto'>
                <div className='value-label'>{selected.label}</div>
                <div className='dropdown-chevron'>
                    <IonIcon icon={chevronDown} />
                </div>
            </HStack>
            {showingDropdown && (
                <VStack className='dropdown-options' justify='start'>
                    {props.options.map(option => (
                        <DropdownMenuOption
                            {...option}
                            onClick={newSelected => {
                                setSelected(newSelected);
                                props.onChange(newSelected);
                            }}
                        />
                    ))}
                </VStack>
            )}
        </VStack>
    );
}

function DropdownMenuOption(
    props: ValueLabelPair & { onClick: (selected: ValueLabelPair) => void },
) {
    return (
        <span
            className='dropdown-option'
            onClick={() => props.onClick({ value: props.value, label: props.label })}>
            {props.label}
        </span>
    );
}

export default DropdownMenu;
export type { ValueLabelPair };
