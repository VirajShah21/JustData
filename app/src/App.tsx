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

function ProductSectionTitle(props: { icon: JSX.Element; label: string }) {
    return (
        <HStack className='product-section-title' justify='start' width='100%'>
            <span className='product-section-icon'>{props.icon}</span>
            <span className='product-section-label'>{props.label}</span>
        </HStack>
    );
}

function ProductResult(props: { icon: string; label: string; url: string }) {
    return (
        <button
            className='product-result'
            onClick={() => {
                window.location.href = props.url;
            }}>
            <HStack className='product-result' justify='start' width='100%'>
                <span className='product-icon'>
                    <img src={props.icon} alt={props.label} height='50' />
                </span>
                <span className='product-label'>{props.label}</span>
            </HStack>
        </button>
    );
}

function SearchBar(props: { placeholder?: string; value?: string }) {
    return (
        <HStack className='search-bar'>
            <span className='search-icon-wrapper'>
                <SearchIcon />
            </span>
            <input
                type='text'
                value={props.value}
                placeholder={props.placeholder}
                className='search-bar-input'
            />
            <button className='search-button'>
                <ArrowRightIcon size={25} />
            </button>
        </HStack>
    );
}

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
