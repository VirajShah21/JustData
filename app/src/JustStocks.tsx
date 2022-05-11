import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { HStack, VStack } from 'reaction';
import BrandButton from './components/BrandButton';
import SearchBar from './components/SearchBar';

function JustStocks() {
    return (
        <VStack width='100%'>
            <HStack>
                <BrandButton />
                <SearchBar placeholder='Search Stocks and Ticker Symbols' />
            </HStack>
            <AdvancedRealTimeChart theme='dark' width='100%' autosize />
        </VStack>
    );
}

export default JustStocks;
