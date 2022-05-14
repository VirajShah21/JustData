import { ArchiveIcon, GraphIcon, LawIcon } from '@primer/octicons-react';
import { HStack, Spacer, VStack } from 'reaction';
import { ProductResult, ProductSectionTitle } from '../components/ProductComponents';
import SearchBar from '../components/SearchBar';
import mostWantedLogo from '../resources/images/icons/Just Most Wanted.png';
import logo from '../resources/images/icons/logo.png';
import stocksLogo from '../resources/images/icons/stocks.png';
import './LandingPage.css';

function LandingLeft() {
    return (
        <VStack className='landing-left'>
            <VStack className='landing-left-overlay'>
                <Spacer />
                <img src={logo} alt='Just Data' className='landing-brand' />
                <Spacer />
                <span className='bg-attribution' style={{ alignSelf: 'start' }}>
                    Photo by Maximalfocus on Unsplash
                </span>
            </VStack>
        </VStack>
    );
}

function LandingRight() {
    return (
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
                <ProductResult icon={mostWantedLogo} label='FBI Most Wanted' url='most-wanted' />
            </HStack>

            <Spacer />
        </VStack>
    );
}

function LandingPage() {
    return (
        <HStack height='100%'>
            <LandingLeft />
            <VStack className='landing-divider'>&nbsp;</VStack>
            <LandingRight />
        </HStack>
    );
}

export default LandingPage;
