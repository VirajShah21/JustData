import { SearchIcon, ArrowRightIcon } from '@primer/octicons-react';
import { HStack } from 'reaction';
import './SearchBar.css';

function SearchBar(props: { placeholder?: string; value?: string }) {
    return (
        <HStack className='search-bar'>
            <span className='search-icon-wrapper'>
                <SearchIcon />
            </span>
            <input
                type='text'
                value={props.value}
                placeholder={props.placeholder}
                className='search-bar-input'
            />
            <button className='search-button'>
                <ArrowRightIcon size={25} />
            </button>
        </HStack>
    );
}

export default SearchBar;
