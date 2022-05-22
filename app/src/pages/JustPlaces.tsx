import { HStack, VStack } from 'reaction';
import BrandButton from 'src/components/BrandButton';
import SearchBar from 'src/components/SearchBar';
import './JustPlaces.css';
import justPlacesPlaceholder from '../resources/images/backgrounds/places.png';

function JustPlaces() {
    return (
        <VStack className='just-places'>
            <HStack>
                <BrandButton />
                <SearchBar />
            </HStack>
            <img
                src={justPlacesPlaceholder}
                alt='Just Places'
                className='just-places-placeholder'
            />
        </VStack>
    );
}

export default JustPlaces;
