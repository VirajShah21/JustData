import { HStack, Spacer, VStack } from 'reaction';
import RatingComponent from 'src/components/JustPlaces/RatingComponent';
import SearchResult from 'src/components/ui/SearchResult';
import yellowPagesIcon from 'src/assets/images/icons/yellow pages.png';

interface BusinessAgeBadgeProps {
    age: number;
}

interface JustPlacesRatingProps {
    rating: number;
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
export function PlaceSearchResult(props: YellowPagesSearchResult) {
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
                    <YellowPagesRating rating={props.rating.yellowPages} />
                )}
            </HStack>
            <HStack justify='between'>
                <VStack align='start'>
                    <span>{props.phone}</span>
                    <a href={props.website} className='text-gradient-link'>
                        Website
                    </a>
                </VStack>
                <ResultAddress {...props.address} />
                {props.age && <BusinessAgeBadge age={props.age} />}
            </HStack>
        </SearchResult>
    );
}

export function YellowPagesRating({ rating }: JustPlacesRatingProps) {
    return (
        <HStack width='auto'>
            <img src={yellowPagesIcon} alt='Yellow Pages Rating' style={{ height: '2rem' }} />
            <RatingComponent rating={rating} color='yellow' />
        </HStack>
    );
}

export function ResultAddress({ street, city, state, zip }: YellowPagesAddress) {
    return (
        <HStack align='start'>
            <span>{street}</span>
            <span>
                {city}, {state} {zip}
            </span>
        </HStack>
    );
}

export function BusinessAgeBadge({ age }: BusinessAgeBadgeProps) {
    return (
        <HStack width='auto'>
            <VStack className='business-age'>{age}</VStack>
            <VStack className='business-age-label' align='start'>
                <span>Years in</span>
                <span>Business</span>
            </VStack>
        </HStack>
    );
}
