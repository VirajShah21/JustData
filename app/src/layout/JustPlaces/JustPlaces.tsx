import { IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import justPlacesPlaceholder from 'src/assets/images/backgrounds/places.png';
import logo from 'src/assets/images/icons/Just Places.png';
import LoadingAnimation from 'src/components/LoadingAnimation';
import SearchBar from 'src/components/ui/SearchBar';
import Sidebar from 'src/components/ui/Sidebar';
import { useTitle } from 'src/HTMLHead';
import { PlacesKit } from 'src/utils/JustSDK';
import './JustPlaces.css';
import { PlaceSearchResult } from '../../components/JustPlaces/PlaceSearchResult';

/**
 * The page which displays the Just Places application.
 *
 * @returns The Just Places page.
 */
export default function JustPlaces() {
    // Search query and location from the titlebar's search bar
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');

    // The search results (this is populated when the server responsds with the search results)
    const [results, setSearchResults] = useState<YellowPagesSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Allows the page to know if search results are provided
    const [showingResults, setShowingResults] = useState(false);

    useTitle('Just Places');

    async function search() {
        try {
            setLoading(true);
            setSearchResults((await PlacesKit.search(searchQuery, searchLocation)).results);
            setLoading(false);
            setShowingResults(true);
        } catch (err) {
            // TODO: Error handling
        }
    }

    return (
        <HStack height='100%'>
            <Sidebar logo={logo} />
            <VStack className='just-places' justify='start' width='100%' scroll='vertical'>
                <HStack>
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
                        icon={<IonIcon icon={locationOutline} />}
                    />
                </HStack>

                {loading && <LoadingAnimation />}
                {!showingResults && !loading && (
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
        </HStack>
    );
}
