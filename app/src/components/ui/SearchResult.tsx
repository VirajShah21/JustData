import { VStack } from 'reaction';
import './SearchResult.css';

/**
 * A component to display a search result using the Just Data design guidelines.
 *
 * @param props - Accepts only children elements.
 * @returns The search result component.
 */
function SearchResult(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <VStack className='search-result' width='50%' align='start' height='auto'>
            <VStack className='search-result-inside' align='start' width='100%'>
                {props.children}
            </VStack>
        </VStack>
    );
}

export default SearchResult;
