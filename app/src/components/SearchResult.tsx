import { VStack } from 'reaction';
import './SearchResult.css';

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
