import { list, skullOutline } from 'ionicons/icons';
import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import logo from 'src/assets/images/icons/Just Fugitives.png';
import SearchBar from 'src/components/ui/SearchBar';
import Sidebar, { SidebarNavigationButton } from 'src/components/ui/Sidebar';
import { useTitle } from 'src/HTMLHead';
import AllFugitivesList from './AllFugitivesList';
import './JustFugitives.css';
import TenMostWantedList from './TenMostWantedList';

// TODO: Add ability to view full profile

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
export default function JustFugitives() {
    const [feature, setFeature] = useState<FBIMostWantedFeature>(features.tenMostWanted);

    useTitle('Just Fugitives');

    return (
        <HStack height='100%'>
            <Sidebar logo={logo}>
                <SidebarNavigationButton
                    ionicon={list}
                    label='Ten Most Wanted Fugitives'
                    onClick={() => setFeature(features.tenMostWanted)}
                    active={feature === features.tenMostWanted}
                />
                <SidebarNavigationButton
                    ionicon={skullOutline}
                    label='Fugitives'
                    onClick={() => setFeature(features.allFugitives)}
                    active={feature === features.allFugitives}
                />
            </Sidebar>
            <VStack width='100%' justify='start' className='fbi-most-wanted-page'>
                <SearchBar />

                <HStack className='feature-container'>
                    {feature === features.tenMostWanted && <TenMostWantedList />}
                    {feature === features.allFugitives && <AllFugitivesList />}
                </HStack>
            </VStack>
        </HStack>
    );
}