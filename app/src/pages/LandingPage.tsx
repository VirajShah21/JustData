import { ArchiveIcon, GraphIcon, LawIcon, SearchIcon } from '@primer/octicons-react';
import { HStack, Spacer, VStack } from 'reaction';
import { ProductResult, ProductSectionTitle } from '../components/ProductComponents';
import SearchBar from '../components/SearchBar';
import justFugitivesLogo from '../resources/images/icons/Just Fugitives.png';
import logo from '../resources/images/icons/logo.png';
import justSecuritiesLogo from '../resources/images/icons/Just Securities.png';
import searchLogo from '../resources/images/icons/search.png';
import './LandingPage.css';
import justPlacesLogo from '../resources/images/icons/Just Places.png';

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

            <HStack justify='start'>
                <ProductResult icon={justSecuritiesLogo} label='Just Securities' url='stocks' />
            </HStack>

            {/* Stock information */}

            <ProductSectionTitle icon={<ArchiveIcon />} label='U.S. Intelligence' />

            {/* CIA World Factbook */}

            <ProductSectionTitle icon={<LawIcon />} label='Crime & Justice' />

            <HStack justify='start'>
                <ProductResult icon={justFugitivesLogo} label='Just Fugitives' url='most-wanted' />
            </HStack>

            <ProductSectionTitle icon={<SearchIcon />} label='Web Search' />

            <HStack justify='start'>
                <ProductResult icon={searchLogo} label='Just Search' url='/search' />
                <ProductResult icon={justPlacesLogo} label='Just Places' url='/places' />
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
