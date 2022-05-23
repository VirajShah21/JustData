import { useEffect, useState } from 'react';
import { HStack, VStack } from 'reaction';
import BrandButton from 'src/components/BrandButton';
import FeatureButton from 'src/components/FeatureButton';
import FugitiveProfile from 'src/components/FugitiveProfile';
import PaginationController from 'src/components/PaginationController';
import SearchBar from 'src/components/SearchBar';
import { useTitle } from 'src/HTMLHead';
import { FBIKit } from 'src/utils/JustSDK';
import './JustFugitives.css';

type FBIMostWantedFeature =
    | 'ten-most-wanted'
    | 'fugitives'
    | 'capitol-violence'
    | 'terrorism'
    | 'missing-persons'
    | 'parental-kidnappings';

const features: Record<string, FBIMostWantedFeature> = {
    tenMostWanted: 'ten-most-wanted',
    allFugitives: 'fugitives',
    capitolViolence: 'capitol-violence',
};
const loadingText = 'Loading...';

const httpSuccess = 200;

/**
 * This is the webpage for the FBIs most wanted fugitives. It includes several features,
 * such as:
 *
 * - Ten most wanted fugitives
 * - Fugitives
 *
 * In the future, it will also include:
 *
 * - Capitol violence
 * - Terrorists
 * - Kidnappings / Missing Persons
 * - Parental Kidnappings
 *
 * @returns The page for the FBIs most wanted fugitives.
 */
function FBIMostWanted() {
    const [feature, setFeature] = useState<FBIMostWantedFeature>(features.tenMostWanted);

    useTitle('Just Fugitives');

    return (
        <VStack width='100%' justify='start' className='fbi-most-wanted-page'>
            <HStack>
                <BrandButton />
                <SearchBar />
            </HStack>
            <HStack className='features-bar'>
                <FeatureButton
                    label='Ten Most Wanted Fugitives'
                    onClick={() => setFeature(features.tenMostWanted)}
                    active={feature === features.tenMostWanted}
                />
                <FeatureButton
                    label='Fugitives'
                    onClick={() => setFeature(features.allFugitives)}
                    active={feature === features.allFugitives}
                />
                {/* <FeatureButton
                    label='Capitol Violence'
                    onClick={() => setFeature(features.capitolViolence)}
                    active={feature === features.capitolViolence}
                /> */}
            </HStack>
            <HStack className='feature-container'>
                {feature === features.tenMostWanted && <TenMostWantedList />}
                {feature === features.allFugitives && <AllFugitivesList />}
            </HStack>
        </VStack>
    );
}

/**
 * This React component displays a list of the ten most wanted fugitives. It simply
 * uses the fugitives name and when their image is hovered, it also shows an option
 * to view their wanted poster.
 *
 * @returns The ten most wanted fugitives list.
 */
function TenMostWantedList() {
    const [isLoading, setIsLoading] = useState(true);
    const [fugitives, setFugitives] = useState<SimpleFugitiveData[]>([]);

    async function loadFugitives() {
        try {
            setFugitives(await FBIKit.requestTenMostWantedFugitives());
            setIsLoading(false);
        } catch (err) {
            // TODO: Error handling
        }
    }

    useEffect(() => {
        loadFugitives();
    }, []);

    return (
        <VStack>
            {isLoading && loadingText}
            <HStack className='fugitives-list'>
                {fugitives.map(fugitive => (
                    <FugitiveListItem {...fugitive} opensProfile={false} />
                ))}
            </HStack>
        </VStack>
    );
}

/**
 * This is a feature of the FBIs most wanted service. It displays a list of all the fugitives.
 * This also uses pagination to only display a set number of results per page. It will
 * automatically load another "chunk" of results when the user scrolls to the bottom of the
 * list and changes pages.
 *
 * By default, each page will display 20 fugitives.
 *
 * @returns A list of every single fugitive.
 */
function AllFugitivesList() {
    const pageSize = 20;
    const [isLoading, setIsLoading] = useState(true);
    const [fugitives, setFugitives] = useState<SimpleFugitiveData[]>([]);
    const [page, setPage] = useState(1);

    async function loadFugitives() {
        try {
            setFugitives(await FBIKit.requestAllFugitives());
            setIsLoading(false);
        } catch (err) {
            // TODO: Error handling
        }
    }

    useEffect(() => {
        loadFugitives();
    }, []);

    return (
        <VStack>
            {isLoading && loadingText}
            <HStack className='fugitives-list'>
                {fugitives.slice(pageSize * (page - 1), pageSize * page).map(fugitive => (
                    <FugitiveListItem {...fugitive} opensProfile={true} />
                ))}
            </HStack>
            <PaginationController
                lastPage={Math.ceil(fugitives.length / pageSize)}
                currentPage={page}
                onPageChange={pgNumber => setPage(pgNumber)}
            />
        </VStack>
    );
}

/**
 * @param props - The data associated with the fugitive. This can be either the simple
 * data (`SimpleFugitiveData`) or the full data (`FullFugitiveData`). An additional
 * prop should also be assigned, `opensProfile` to determine whether or not to pull up
 * the fugitives profile once the button is clicked.
 *
 * If a `SimpleFugitiveData` object is passed as props, then `opensProfile` must be false
 * or undefined. Otherwise `opensProfile` can either be true or false or undefined.
 *
 * If `SimpleFugitiveData` is set to `true`, then a button will appear to display
 * the fugitives entire profile on-site. Otherwise, a button will appear which links
 * to the PDF containing the wanted poster from the FBI site.
 * @returns A single fugitive to be displayed in a fugitives list.
 */
function FugitiveListItem(
    props: (SimpleFugitiveData | FullFugitiveData) & { opensProfile?: boolean },
) {
    const [showingProfile, setShowingProfile] = useState(false);

    return (
        <VStack
            className='fugitive-list-item'
            style={{ backgroundImage: `url(${props.mugshot})` }}
            justify='end'>
            <VStack className='fugitive-popover' justify='start'>
                <h3 className='fugitive-name'>{props.name}</h3>
                {props.opensProfile ? (
                    <button
                        onClick={() => {
                            setShowingProfile(true);
                        }}
                        className='fugitive-poster-link'>
                        View Full Profile
                    </button>
                ) : (
                    <a href={props.posterURL} className='fugitive-poster-link'>
                        Wanted Poster
                    </a>
                )}
            </VStack>

            {showingProfile && (
                <FugitiveProfile
                    {...(props as FullFugitiveData)}
                    onClose={() => setShowingProfile(false)}
                />
            )}
        </VStack>
    );
}

export default FBIMostWanted;
