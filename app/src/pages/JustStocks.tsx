import { GraphIcon, InfoIcon, LightBulbIcon, NumberIcon } from '@primer/octicons-react';
import axios from 'axios';
import { useState } from 'react';
import {
    AdvancedRealTimeChart,
    CompanyProfile,
    FundamentalData,
    TechnicalAnalysis,
} from 'react-ts-tradingview-widgets';
import { HStack, Spacer, VStack } from 'reaction';
import BrandButton from '../components/BrandButton';
import FeatureButton from '../components/FeatureButton';
import SearchBar from '../components/SearchBar';
import './JustStocks.css';

type StocksFeature = 'chart' | 'analysis' | 'fundamentals' | 'profile';

const maxTickerSuggestions = 5;

/**
 * A custom SearchBar component for searching stock tickers.
 *
 * @param props - Two props:
 * - `value?` - The value of the input
 * - `onSearch` - The function to be called when the user clicks the search button or on
 *   a search suggestion.
 * @returns The search bar for the Just Stocks product.
 */
function StockSearchBar(props: { value?: string; onSearch: (value: string) => void }) {
    const [searchSuggestions, setSearchSuggestions] = useState<StockSearchResult[]>([]);
    const [searchInput, setSearchInput] = useState(props.value ?? 'AAPL');
    let searchSuggestionLock = false;

    /**
     * Refreshes `searchSuggestions` state variable with provided StockSearchResult array.
     * This is based on the user's query and provides suggestions for the stock ticker symbol.
     *
     * @param value - The value of the input
     */
    function refreshSearchSuggestions(value: string) {
        if (!searchSuggestionLock) {
            // The lock prevents many searches from being executed at once.
            searchSuggestionLock = true;
            axios
                .get(`http://localhost:3001/api/stocks/ticker-search?q=${encodeURI(value)}`)
                .then(response => {
                    setSearchSuggestions(
                        response.data.results.length <= maxTickerSuggestions
                            ? response.data.results
                            : response.data.results.slice(0, maxTickerSuggestions),
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
                children: [
                    <div className='stock-search-ac-ticker'>{result.symbol}</div>,
                    <div className='stock-search-ac-name'>{result.name}</div>,
                    <div className='stock-search-ac-price'>{result.lastPrice}</div>,
                    <Spacer />,
                    <div className='stock-search-ac-industry'>{result.industry}</div>,
                    <div className='stock-search-ac-type'>{result.type}</div>,
                    <div className='stock-search-ac-exchange'>{result.exchange}</div>,
                ],
            }))}
            onChange={e => {
                const value = e.target.value;
                setSearchInput(value);
                refreshSearchSuggestions(value);
            }}
            onSearch={value => {
                setSearchInput(value);
                props.onSearch(value);
            }}
        />
    );
}

/**
 * @returns The Just Stocks product page.
 */
function JustStocks() {
    const [ticker, setTicker] = useState('AAPL');
    const [activeFeature, setActiveFeature] = useState<StocksFeature>('chart');

    return (
        <VStack width='100%' id='just-stocks'>
            <HStack>
                <BrandButton />
                <StockSearchBar
                    onSearch={t => {
                        setTicker(t);
                    }}
                />
            </HStack>
            <HStack>
                <FeatureButton
                    icon={<GraphIcon />}
                    label='Charts'
                    onClick={() => setActiveFeature('chart')}
                    active={activeFeature === 'chart'}
                />
                <FeatureButton
                    icon={<LightBulbIcon />}
                    label='Analysis'
                    onClick={() => setActiveFeature('analysis')}
                    active={activeFeature === 'analysis'}
                />
                <FeatureButton
                    icon={<NumberIcon />}
                    label='Fundamentals'
                    onClick={() => setActiveFeature('fundamentals')}
                    active={activeFeature === 'fundamentals'}
                />
                <FeatureButton
                    icon={<InfoIcon />}
                    label='Company Profile'
                    onClick={() => setActiveFeature('profile')}
                    active={activeFeature === 'profile'}
                />
            </HStack>
            {activeFeature === 'chart' && (
                <AdvancedRealTimeChart theme='dark' width='100%' symbol={ticker} autosize />
            )}
            {activeFeature === 'analysis' && (
                <TechnicalAnalysis colorTheme='dark' symbol={ticker} />
            )}
            {activeFeature === 'fundamentals' && (
                <FundamentalData colorTheme='dark' height='100%' width='100%' symbol={ticker} />
            )}
            {activeFeature === 'profile' && (
                <CompanyProfile colorTheme='dark' height='100%' width='100%' symbol={ticker} />
            )}
        </VStack>
    );
}

export default JustStocks;
