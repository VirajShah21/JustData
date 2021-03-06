import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import background from 'src/assets/images/backgrounds/search.png';
import logo from 'src/assets/images/icons/search.png';
import LoadingAnimation from 'src/components/LoadingAnimation';
import SearchResult from 'src/components/ui/SearchResult';
import SearchBar from 'src/components/ui/SearchBar';
import Sidebar from 'src/components/ui/Sidebar';
import { useTitle } from 'src/hooks/meta';
import { SERPKit } from 'src/utils/JustSDK';
import styles from './SearchEngine.module.css';

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
            <Sidebar logo={logo} />
            <VStack justify='start' className={styles.search_engine} width='100%'>
                <SearchBar
                    value={searchValue}
                    placeholder='Search the Web'
                    onChange={e => setSearchValue(e.target.value)}
                    onSearch={search}
                />

                {loading && (
                    <VStack>
                        <LoadingAnimation />
                    </VStack>
                )}

                {!loading && !showingResults && (
                    <img
                        src={background}
                        alt='Search Placeholder'
                        className={styles.placeholder_image}
                    />
                )}

                {showingResults && (
                    <VStack className={styles.results} align='start' justify='start'>
                        {results.map((result, i) => (
                            <EngineResult
                                key={result.url}
                                title={result.title}
                                url={result.url}
                                description={result.description}
                            />
                        ))}
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
            <h3 className={styles.result_title}>
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
                className={styles.result_description}
                dangerouslySetInnerHTML={{ __html: props.description }}></p>
        </SearchResult>
    );
}

export default SearchEngine;
