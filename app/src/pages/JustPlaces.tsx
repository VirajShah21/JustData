import { LocationIcon } from '@primer/octicons-react';
import { useState } from 'react';
import { HStack, Spacer, VStack } from 'reaction';
import BrandButton from 'src/components/BrandButton';
import Rating from 'src/components/RatingComponent';
import SearchBar from 'src/components/SearchBar';
import SearchResult from 'src/components/SearchResult';
import { useTitle } from 'src/HTMLHead';
import { PlacesKit } from 'src/utils/JustSDK';
import justPlacesPlaceholder from '../resources/images/backgrounds/places.png';
import yellowPagesIcon from '../resources/images/icons/yellow pages.png';
import './JustPlaces.css';

/**
 * The page which displays the Just Places application.
 *
 * @returns The Just Places page.
 */
function JustPlaces() {
    // Search query and location from the titlebar's search bar
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');

    // The search results (this is populated when the server responsds with the search results)
    const [results, setSearchResults] = useState<YellowPagesSearchResult[]>([]);

    // Allows the page to know if search results are provided
    const [showingResults, setShowingResults] = useState(false);

    useTitle('Just Places');

    async function search() {
        try {
            setSearchResults((await PlacesKit.search(searchQuery, searchLocation)).results);
            setShowingResults(true);
        } catch (err) {
            // TODO: Error handling
        }
    }

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
                    onSearch={search}
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

/**
 * A component which extends the base `SearchResult` component to display a search result
 * for a Yellow Pages SERP result.
 *
 * Note: Rather than applying each property using the `attr={value}` notation, the
 * spread operation should be used insted:
 *
 * ```
 * <PlaceSearchResult {...result} />
 * ```
 *
 * @param props - Properties belonging to `YellowPagesSearchResult` which contains
 * all the data from a Yellow Pages search.
 * @returns The search result component.
 */
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
