import { SearchIcon, ArrowRightIcon } from '@primer/octicons-react';
import { HStack, VStack } from 'reaction';
import './SearchBar.css';

function SearchBar(props: {
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
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
                />
                <button className='search-button'>
                    <ArrowRightIcon size={25} />
                </button>
            </HStack>
            <VStack className='search-bar-autocomplete' width='100%'>
                <SearchBarSuggestion value='Hello World' />
            </VStack>
        </div>
    );
}

function SearchBarSuggestion(props: { image?: string; icon?: JSX.Element; value?: string }) {
    return (
        <HStack className='search-bar-suggestion' justify='start'>
            {props.image && (
                <img className='search-bar-suggestion-image' src={props.image} alt={props.value} />
            )}
            {props.icon && <span className='search-bar-suggestion-icon'>{props.icon}</span>}
            <span className='search-bar-suggestion-value'>{props.value}</span>
        </HStack>
    );
}

export default SearchBar;
