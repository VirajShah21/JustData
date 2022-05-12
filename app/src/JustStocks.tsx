import { GraphIcon } from '@primer/octicons-react';
import axios from 'axios';
import { useState } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { HStack, VStack } from 'reaction';
import BrandButton from './components/BrandButton';
import FeatureButton from './components/FeatureButton';
import SearchBar from './components/SearchBar';

function StockSearchBar(props: { value?: string; onSearch: (value: string) => void }) {
    const [searchSuggestions, setSearchSuggestions] = useState<StockSearchResult[]>([]);
    const [searchInput, setSearchInput] = useState(props.value ?? 'AAPL');
    let searchSuggestionLock = false;

    function refreshSearchSuggestions(value: string) {
        if (!searchSuggestionLock) {
            searchSuggestionLock = true;
            axios
                .get(`http://localhost:3001/api/stocks/ticker-search?q=${value}`)
                .then(response => {
                    console.log(response);

                    setSearchSuggestions(
                        response.data.results.length <= 5
                            ? response.data.results
                            : response.data.results.slice(0, 5)
                    );
                    searchSuggestionLock = false;
                });
        }
    }

    return (
        <SearchBar
            placeholder='Search Stocks and Ticker Symbols'
            value={searchInput}
            suggestions={searchSuggestions.map(result => ({
                value: result.symbol,
                children: [<div>{result.symbol}</div>, <div>{result.name}</div>],
            }))}
            onChange={e => {
                const value = e.target.value;
                setSearchInput(value);
                refreshSearchSuggestions(value);
            }}
            onSearch={value => props.onSearch(value)}
        />
    );
}

function JustStocks() {
    const [ticker, setTicker] = useState('AAPL');

    return (
        <VStack width='100%'>
            <HStack>
                <BrandButton />
                <StockSearchBar onSearch={t => setTicker(t)} />
            </HStack>
            <HStack>
                <FeatureButton icon={<GraphIcon />} label='Charts' active />
            </HStack>
            <AdvancedRealTimeChart theme='dark' width='100%' symbol={ticker} autosize />
        </VStack>
    );
}

export default JustStocks;
