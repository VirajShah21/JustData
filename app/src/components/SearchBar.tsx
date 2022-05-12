import { SearchIcon, ArrowRightIcon } from '@primer/octicons-react';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import './SearchBar.css';

interface SearchSuggestion {
    image?: string;
    icon?: JSX.Element;
    value: string;
    children?: JSX.Element[];
}

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
                    onBlur={() => setShowingSuggestions(false)}
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
                                }>
                                {typeof suggestion !== 'string' ? suggestion.children : undefined}
                            </SearchBarSuggestion>
                        ))}
                    </VStack>
                </div>
            )}
        </div>
    );
}

function SearchBarSuggestion(props: SearchSuggestion) {
    let innerNodes: JSX.Element[];

    if (!props.children) {
        innerNodes = [];

        if (props.icon) {
            innerNodes.push(<span className='search-bar-suggestion-icon'>{props.icon}</span>);
        }

        if (props.image) {
            innerNodes.push(
                <img className='search-bar-suggestion-image' src={props.image} alt={props.value} />
            );
        }

        innerNodes.push(<span className='search-bar-suggestion-value'>{props.value}</span>);
    }

    return (
        <HStack className='search-bar-suggestion' justify='start'>
            {props.children ?? innerNodes!}
        </HStack>
    );
}

export default SearchBar;
