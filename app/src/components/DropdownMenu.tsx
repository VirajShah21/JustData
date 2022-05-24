import { ChevronDownIcon } from '@primer/octicons-react';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import './DropdownMenu.css';

type ValueLabelPair = { value: string; label: string };

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
                    <ChevronDownIcon />
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
