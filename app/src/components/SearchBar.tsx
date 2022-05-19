import { SearchIcon, ArrowRightIcon } from '@primer/octicons-react';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import './SearchBar.css';

const suggestionBlurDelay = 250;

interface SearchSuggestion {
    image?: string;
    icon?: JSX.Element;
    value: string;
    children?: JSX.Element[];
}

/**
 * @param props - The props for the SearchBar:
 * - `placeholder` - The placeholder text for the input
 * - `value` - The value of the input
 * - `suggestions` - An array of each search suggestion
 *     - If an item is a string, then a regular string suggestion is provided
 *     - If an item is a SearchSuggestion object, then the specified image,
 *       icon, and value are used instead. If a `children` field exists on the object,
 *       then it is displayed instead of the other fields. The `value` field must exist
 *       as this is the text used as the value of the input.
 * - `onChange` - The function to be called when the value of the input changes
 * - `onSearch` - The function to be called when the user clicks the search button or
 *   clicks on a search suggestion.
 * @returns A search bar
 */
function SearchBar(props: {
    placeholder?: string;
    value?: string;
    suggestions?: (string | SearchSuggestion)[];
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onSearch?: (value: string) => void;
}) {
    const [showingSuggestions, setShowingSuggestions] = useState(false);

    return (
        <div className='search-bar-container'>
            <HStack className='search-bar'>
                <span className='search-icon-wrapper'>
                    <SearchIcon />
                </span>
                <input
                    type='text'
                    value={props.value}
                    placeholder={props.placeholder}
                    className='search-bar-input'
                    onChange={props.onChange}
                    onFocus={() => setShowingSuggestions(true)}
                    onBlur={() =>
                        window.setTimeout(() => {
                            setShowingSuggestions(false);
                        }, suggestionBlurDelay)
                    }
                />
                <button
                    className='search-button'
                    onClick={() => {
                        props.onSearch?.(props.value ?? '');
                    }}>
                    <ArrowRightIcon size={25} />
                </button>
            </HStack>
            {showingSuggestions && props.suggestions && (
                <div className='search-bar-autocomplete'>
                    <VStack className='search-bar-autocomplete-stack' width='100%'>
                        {props.suggestions.map(suggestion => (
                            <SearchBarSuggestion
                                value={
                                    typeof suggestion === 'string' ? suggestion : suggestion.value
                                }
                                icon={typeof suggestion === 'string' ? undefined : suggestion.icon}
                                image={
                                    typeof suggestion === 'string' ? undefined : suggestion.image
                                }
                                onClick={value => props.onSearch?.(value)}>
                                {typeof suggestion !== 'string' ? suggestion.children : undefined}
                            </SearchBarSuggestion>
                        ))}
                    </VStack>
                </div>
            )}
        </div>
    );
}

/**
 * @param props - The props for the SearchBarSuggestion are SearchSuggestion, as outlined below:
 * - `value: string` - The value of the suggestion (will appear in the search input when clicked)
 * - `image: string` - The URL of an image to display to the left of the suggestion
 * - `icon: JSX.Element` - A custom icon to display to the left of the suggestion
 * - `children: JSX.Element[]` - Custom content to display in the suggestion result. If this is
 *   provided, then the `image`, `icon`, and `value` fields are not displayed.
 *
 * In addition to the previously mentioned props, a required onClick callback must be provided.
 * It will pass the value of the suggestion to the callback.
 * @returns The search bar suggestion to be displayed under the search bar.
 */
function SearchBarSuggestion(props: SearchSuggestion & { onClick: (value: string) => void }) {
    const innerNodes: JSX.Element[] = [];

    if (!props.children) {
        if (props.icon) {
            innerNodes.push(<span className='search-bar-suggestion-icon'>{props.icon}</span>);
        }

        if (props.image) {
            innerNodes.push(
                <img className='search-bar-suggestion-image' src={props.image} alt={props.value} />,
            );
        }

        innerNodes.push(<span className='search-bar-suggestion-value'>{props.value}</span>);
    }

    return (
        <button className='search-bar-suggestion' onClick={() => props.onClick(props.value)}>
            <HStack justify='start'>{props.children ?? innerNodes}</HStack>
        </button>
    );
}

export default SearchBar;
