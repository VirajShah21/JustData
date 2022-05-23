import { HStack, Spacer, VStack } from 'reaction';
import BrandButton from 'src/components/BrandButton';
import SearchBar from 'src/components/SearchBar';
import './JustPlaces.css';
import justPlacesPlaceholder from '../resources/images/backgrounds/places.png';
import { LocationIcon } from '@primer/octicons-react';
import { useState } from 'react';
import axios from 'axios';
import Rating from 'src/components/RatingComponent';
import SearchResult from 'src/components/SearchResult';
import yellowPagesIcon from '../resources/images/icons/yellow pages.png';
import { useTitle } from 'src/HTMLHead';

function JustPlaces() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [results, setSearchResults] = useState([]);
    const [showingResults, setShowingResults] = useState(false);

    useTitle('Just Places');

    return (
        <VStack className='just-places' justify='start'>
            <HStack>
                <BrandButton />
                <SearchBar
                    value={searchQuery}
                    placeholder='What are you looking for?'
                    onChange={e => setSearchQuery(e.target.value)}
                    searchDisabled
                />
                <SearchBar
                    value={searchLocation}
                    placeholder='Where are you looking for it?'
                    onChange={e => setSearchLocation(e.target.value)}
                    onSearch={() => {
                        axios
                            .get(
                                `http://localhost:3001/api/business/search?q=${searchQuery}&location=${searchLocation}`,
                            )
                            .then(response => {
                                if (response.status === 200) {
                                    setSearchResults(response.data);
                                    setShowingResults(true);
                                }
                            });
                    }}
                    icon={<LocationIcon />}
                />
            </HStack>
            {!showingResults && (
                <img
                    src={justPlacesPlaceholder}
                    alt='Just Places'
                    className='just-places-placeholder'
                />
            )}
            <VStack justify='start' align='start' className='search-results'>
                {showingResults && results.map(result => <PlaceSearchResult {...result} />)}
            </VStack>
        </VStack>
    );
}

function PlaceSearchResult(props: YellowPagesSearchResult) {
    return (
        <SearchResult>
            <HStack>
                <h3 className='text-gradient-primary'>{props.business}</h3>
                <Spacer />
                <span>{props.openStatus}</span>
            </HStack>
            <HStack className='categories' justify='start'>
                {props.categories.map(category => (
                    <span>{category}</span>
                ))}
            </HStack>
            <HStack justify='between'>
                {props.rating.yellowPages && (
                    <HStack width='auto'>
                        <img
                            src={yellowPagesIcon}
                            alt='Yellow Pages Rating'
                            style={{ height: '2rem' }}
                        />
                        <Rating rating={props.rating.yellowPages} color='yellow' />
                    </HStack>
                )}
            </HStack>
            <HStack justify='between'>
                <VStack align='start'>
                    <span>{props.phone}</span>
                    <a href={props.website} className='text-gradient-link'>
                        Website
                    </a>
                </VStack>
                <VStack align='start'>
                    <span>{props.address.street}</span>
                    <span>
                        {props.address.city}, {props.address.state} {props.address.zip}
                    </span>
                </VStack>
                {props.age && (
                    <HStack width='auto'>
                        <VStack className='business-age'>{props.age}</VStack>
                        <VStack className='business-age-label' align='start'>
                            <span>Years in</span>
                            <span>Business</span>
                        </VStack>
                    </HStack>
                )}
            </HStack>
        </SearchResult>
    );
}

export default JustPlaces;
