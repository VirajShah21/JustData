import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { VStack } from 'reaction';
import './App.css';
import SearchBar from './components/SearchBar';
import LandingPage from './LandingPage';

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
