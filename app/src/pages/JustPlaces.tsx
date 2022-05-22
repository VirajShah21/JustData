import { HStack, VStack } from 'reaction';
import BrandButton from 'src/components/BrandButton';
import SearchBar from 'src/components/SearchBar';
import './JustPlaces.css';
import justPlacesPlaceholder from '../resources/images/backgrounds/places.png';
import { LocationIcon } from '@primer/octicons-react';
import { useState } from 'react';
import axios from 'axios';
import Rating from 'src/components/RatingComponent';
import SearchResult from 'src/components/SearchResult';

function JustPlaces() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [results, setSearchResults] = useState([]);
    const [showingResults, setShowingResults] = useState(false);

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
            <h3>{props.business}</h3>
            <HStack>{props.categories}</HStack>
        </SearchResult>
    );
}

export default JustPlaces;
