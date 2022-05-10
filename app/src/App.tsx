import './App.css';
import { HStack, VStack, Spacer } from 'reaction';
import logo from './logo.png';
import { ArrowRightIcon, SearchIcon } from '@primer/octicons-react';

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
                <SearchBar placeholder='Search Products and Services' />
                <Spacer />
            </VStack>
        </HStack>
    );
}

function App() {
    return <LandingPage />;
}

export default App;
