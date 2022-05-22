import axios from 'axios';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import BrandButton from 'src/components/BrandButton';
import SearchBar from 'src/components/SearchBar';
import SearchResult from 'src/components/SearchResult';
import background from '../resources/images/backgrounds/search.png';
import './SearchEngine.css';

const httpSuccess = 200;

function SearchEngine() {
    const [showingResults, setShowingResults] = useState(false);
    const [results, setResults] = useState<SERPItem[]>([]);
    const [searchValue, setSearchValue] = useState('');

    return (
        <VStack justify='start' className='search-engine'>
            <HStack>
                <BrandButton />
                <SearchBar
                    value={searchValue}
                    placeholder='Search the Web'
                    onChange={e => setSearchValue(e.target.value)}
                    onSearch={value => {
                        axios
                            .get(`http://localhost:3001/api/serp?q=${encodeURI(value)}`)
                            .then(response => {
                                if (response.status === httpSuccess) {
                                    if (!showingResults) setShowingResults(true);
                                    setResults(response.data);
                                }
                            });
                    }}
                />
            </HStack>
            {!showingResults && (
                <img src={background} alt='Search Placeholder' className='search-placeholder' />
            )}
            {showingResults && (
                <VStack className='search-results' align='start' justify='start'>
                    {results.map(result => (
                        <EngineResult {...result} />
                    ))}
                </VStack>
            )}
        </VStack>
    );
}

function EngineResult(props: { title: string; url: string; description: string }) {
    return (
        <SearchResult>
            <h3 className='result-title'>
                <a href={props.url}>{props.title}</a>
            </h3>
            <div className='result-url'>
                <a href={props.url}>{props.url}</a>
            </div>
            <p
                className='result-description'
                dangerouslySetInnerHTML={{ __html: props.description }}></p>
        </SearchResult>
    );
}

export default SearchEngine;
