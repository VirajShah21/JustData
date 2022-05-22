import { VStack } from 'reaction';
import './SearchResult.css';

function SearchResult(props: { children: JSX.Element[] }) {
    return (
        <VStack className='search-result' width='50%' align='start'>
            <VStack className='search-result-inside' align='start' width='100%'>
                {props.children}
            </VStack>
        </VStack>
    );
}

export default SearchResult;
