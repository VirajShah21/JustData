import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import LoadingAnimation from 'src/components/LoadingAnimation';
import { FBIKit } from 'src/utils/JustSDK';
import FugitiveListItem from './FugitiveListItem';

/**
 * This React component displays a list of the ten most wanted fugitives. It simply
 * uses the fugitives name and when their image is hovered, it also shows an option
 * to view their wanted poster.
 *
 * @returns The ten most wanted fugitives list.
 */
export default function TenMostWantedList() {
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

    loadFugitives();

    return (
        <VStack>
            {isLoading && <LoadingAnimation />}
            <HStack className='fugitives-list'>
                {fugitives.map(fugitive => (
                    <FugitiveListItem {...fugitive} opensProfile={false} />
                ))}
            </HStack>
        </VStack>
    );
}
