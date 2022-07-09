import {
    analytics,
    analyticsOutline,
    cash,
    cashOutline,
    informationCircle,
    informationCircleOutline,
    trendingUp,
    trendingUpOutline,
} from 'ionicons/icons';
import { useState } from 'react';
import {
    AdvancedRealTimeChart,
    CompanyProfile,
    FundamentalData,
    TechnicalAnalysis,
} from 'react-ts-tradingview-widgets';
import { HStack, Spacer, VStack } from 'reaction';
import logo from 'src/assets/images/icons/Just Securities.png';
import SearchBar from 'src/components/ui/SearchBar';
import Sidebar, { SidebarNavigationButton } from 'src/components/ui/Sidebar';
import { useTitle } from 'src/hooks/meta';
import { SecuritiesKit } from 'src/utils/JustSDK';
import styles from './JustSecurities.module.css';
import './TradingViewOverrides.css';

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
    async function refreshSearchSuggestions(value: string) {
        if (!searchSuggestionLock) {
            // The lock prevents many searches from being executed at once.
            searchSuggestionLock = true;
            const suggestions = await SecuritiesKit.searchTickerSymbols(value);
            setSearchSuggestions(
                suggestions.results.length <= maxTickerSuggestions
                    ? suggestions.results
                    : suggestions.results.slice(0, maxTickerSuggestions),
            );
            searchSuggestionLock = false;
        }
    }

    return (
        <SearchBar
            placeholder='Search Stocks and Ticker Symbols'
            value={searchInput}
            suggestions={searchSuggestions.map(result => ({
                value: result.symbol,
                children: [
                    <div className={styles.autocomplete_ticker}>{result.symbol}</div>,
                    <div className={styles.autocomplete_name}>{result.name}</div>,
                    <div className={styles.autocomplete_price}>{result.lastPrice}</div>,
                    <Spacer />,
                    <div className={styles.autocomplete_industry}>{result.industry}</div>,
                    <div className={styles.autocomplete_type}>{result.type}</div>,
                    <div className={styles.autocomplete_exchange}>{result.exchange}</div>,
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
function JustSecurities() {
    const [ticker, setTicker] = useState('AAPL');
    const [activeFeature, setActiveFeature] = useState<StocksFeature>('chart');

    useTitle('Just Securities');

    return (
        <HStack height='100%'>
            <Sidebar logo={logo}>
                <SidebarNavigationButton
                    ionicon={{ default: trendingUpOutline, active: trendingUp }}
                    label='Charts'
                    onClick={() => setActiveFeature('chart')}
                    active={activeFeature === 'chart'}
                />
                <SidebarNavigationButton
                    ionicon={{ default: analyticsOutline, active: analytics }}
                    label='Analysis'
                    onClick={() => setActiveFeature('analysis')}
                    active={activeFeature === 'analysis'}
                />
                <SidebarNavigationButton
                    ionicon={{ default: cashOutline, active: cash }}
                    label='Fundamentals'
                    onClick={() => setActiveFeature('fundamentals')}
                    active={activeFeature === 'fundamentals'}
                />
                <SidebarNavigationButton
                    ionicon={{ default: informationCircleOutline, active: informationCircle }}
                    label='Company Profile'
                    onClick={() => setActiveFeature('profile')}
                    active={activeFeature === 'profile'}
                />
            </Sidebar>
            <VStack width='100%' id='just-stocks'>
                <StockSearchBar
                    onSearch={t => {
                        setTicker(t);
                    }}
                />

                {getActiveFeature(activeFeature, ticker)}
            </VStack>
        </HStack>
    );
}

/**
 * Gets a rendering of the active feature with the active stock ticker.
 *
 * @param feature - The feature name to be rendered.
 * @param ticker - The ticker symbol of the stock to be rendered.
 * @returns The active feature
 */
function getActiveFeature(feature: StocksFeature, ticker: string) {
    switch (feature) {
        case 'chart':
            return <AdvancedRealTimeChart theme='dark' width='100%' symbol={ticker} autosize />;
        case 'analysis':
            return <TechnicalAnalysis colorTheme='dark' symbol={ticker} />;
        case 'fundamentals':
            return <FundamentalData colorTheme='dark' height='100%' width='100%' symbol={ticker} />;
        case 'profile':
            return <CompanyProfile colorTheme='dark' height='100%' width='100%' symbol={ticker} />;
        default:
            return <AdvancedRealTimeChart theme='dark' width='100%' symbol={ticker} autosize />;
    }
}

export default JustSecurities;
