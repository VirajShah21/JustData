import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import LoadingAnimation from 'src/components/LoadingAnimation';
import SearchBar from 'src/components/SearchBar';
import SearchResult from 'src/components/SearchResult';
import Sidebar from 'src/components/Sidebar';
import { useTitle } from 'src/HTMLHead';
import logo from 'src/resources/images/icons/search.png';
import { SERPKit } from 'src/utils/JustSDK';
import background from '../resources/images/backgrounds/search.png';
import './SearchEngine.css';

/**
 * The page for the Just Search application. By default it displays an image
 * but when a search is run, it will display the search results, along with
 * relevant information.
 *
 * @returns The search engine page.
 */
function SearchEngine() {
    const [showingResults, setShowingResults] = useState(false);
    const [results, setResults] = useState<SERPItem[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);

    useTitle('Just Search');

    /**
     * Performs a search using the `searchValue` state variable.
     */
    async function search() {
        setLoading(true);
        setResults((await SERPKit.bing(searchValue)).results);
      
        setLoading(false);

        if (!showingResults) {
            setShowingResults(true);
        }
    }

    return (
        <HStack height='100%'>
            <Sidebar logo={logo}></Sidebar>
            <VStack justify='start' className='search-engine' width='100%'>
                <SearchBar
                    value={searchValue}
                    placeholder='Search the Web'
                    onChange={e => setSearchValue(e.target.value)}
                    onSearch={search}
                />

                {loading && <LoadingAnimation />}

                {!showingResults && (
                    <img src={background} alt='Search Placeholder' className='search-placeholder' />
                )}

                {showingResults && (
                    <VStack className='search-results' align='start' justify='start'>
                        {results.map(EngineResult)}
                    </VStack>
                )}
            </VStack>
        </HStack>
    );
}

/**
 * A component for displaying a search engine result. This uses the
 * `SearchResult` component to display the result.
 *
 * @param props - The props for each search result:
 * - `title` - The page title for the search result
 * - `url` - The URL which the result links to
 * - `description` - The meta description for the webpage
 * @returns The Just Search engine result.
 */
function EngineResult(props: { title: string; url: string; description: string }) {
    return (
        <SearchResult>
            <h3 className='result-title'>
                <a href={props.url} className='text-gradient-primary'>
                    {props.title}
                </a>
            </h3>
            <div className='result-url'>
                <a href={props.url} className='text-gradient-link'>
                    {props.url}
                </a>
            </div>
            <p
                className='result-description'
                dangerouslySetInnerHTML={{ __html: props.description }}></p>
        </SearchResult>
    );
}

export default SearchEngine;
