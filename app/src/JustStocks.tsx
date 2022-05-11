import { GraphIcon } from '@primer/octicons-react';
import { useState } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { HStack, VStack } from 'reaction';
import BrandButton from './components/BrandButton';
import FeatureButton from './components/FeatureButton';
import SearchBar from './components/SearchBar';

function JustStocks() {
    const [searchInput, setSearchInput] = useState('');

    return (
        <VStack width='100%'>
            <HStack>
                <BrandButton />
                <SearchBar
                    placeholder='Search Stocks and Ticker Symbols'
                    value={searchInput}
                    onChange={e => {
                        setSearchInput(e.target.value);
                    }}
                />
            </HStack>
            <HStack>
                <FeatureButton icon={<GraphIcon />} label='Charts' active />
            </HStack>
            <AdvancedRealTimeChart theme='dark' width='100%' symbol={searchInput} autosize />
        </VStack>
    );
}

export default JustStocks;
