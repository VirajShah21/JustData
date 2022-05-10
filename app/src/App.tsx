import {
    ArchiveIcon,
    ArrowRightIcon,
    GraphIcon,
    LawIcon,
    SearchIcon,
} from '@primer/octicons-react';
import { HStack, Spacer, VStack } from 'reaction';
import './App.css';
import logo from './logo.png';
import stocksLogo from './stocks.png';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import mostWantedLogo from './Just Most Wanted.png';
import { ProductSectionTitle, ProductResult } from './components/ProductComponents';
import SearchBar from './components/SearchBar';

function LandingPage() {
    return (
        <HStack height='100%'>
            <VStack className='landing-left'>
                <Spacer />
                <img src={logo} alt='Just Data' className='landing-brand' />
                <Spacer />
                <span className='bg-attribution' style={{ alignSelf: 'start' }}>
                    Photo by Maximalfocus on Unsplash
                </span>
            </VStack>
            <VStack className='landing-divider'>&nbsp;</VStack>
            <VStack className='landing-right'>
                <SearchBar placeholder='Search Our Products' />
                <div style={{ height: '2rem' }} />

                <ProductSectionTitle icon={<GraphIcon />} label='Financial Markets' />

                <HStack justify='around'>
                    <ProductResult icon={stocksLogo} label='Stocks' url='stocks' />
                </HStack>

                {/* Stock information */}

                <ProductSectionTitle icon={<ArchiveIcon />} label='U.S. Intelligence' />

                {/* CIA World Factbook */}

                <ProductSectionTitle icon={<LawIcon />} label='Crime & Justice' />

                <HStack justify='around'>
                    <ProductResult
                        icon={mostWantedLogo}
                        label='FBI Most Wanted'
                        url='most-wanted'
                    />
                </HStack>

                <Spacer />
            </VStack>
        </HStack>
    );
}

function JustStocks() {
    return (
        <VStack width='100%'>
            <SearchBar placeholder='Search Stocks and Ticker Symbols' />
            <AdvancedRealTimeChart theme='dark' width='100%' autosize />
        </VStack>
    );
}

function App() {
    switch (window.location.pathname) {
        case '/':
            return <LandingPage />;
        case '/stocks':
            return <JustStocks />;
        default:
            return <div>404</div>;
    }
}

export default App;
