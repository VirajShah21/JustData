import { ArchiveIcon, GraphIcon, LawIcon, SearchIcon } from '@primer/octicons-react';
import { HStack, Spacer, VStack } from 'reaction';
import { ProductResult, ProductSectionTitle } from '../components/ProductComponents';
import SearchBar from '../components/SearchBar';
import mostWantedLogo from '../resources/images/icons/Just Most Wanted.png';
import logo from '../resources/images/icons/logo.png';
import stocksLogo from '../resources/images/icons/stocks.png';
import searchLogo from '../resources/images/icons/search.png';
import './LandingPage.css';

/**
 * @returns The left side of the landing page. This incldues a logo and a
 * sleek background.
 */
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

/**
 * A React component which displays the right side of the landing page.
 * This includes the search bar and a list of products, sorted by category.
 *
 * @returns The right side of the landing page.
 */
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

            <ProductSectionTitle icon={<SearchIcon />} label='Web Search' />

            <HStack justify='around'>
                <ProductResult icon={searchLogo} label='Search Engine' url='/search' />
            </HStack>

            <Spacer />
        </VStack>
    );
}

/**
 * @returns The landing page for Just Data.
 */
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
