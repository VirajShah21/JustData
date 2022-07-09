import { useState } from 'react';
import { HStack, VStack } from 'reaction';
import LoadingAnimation from 'src/components/LoadingAnimation';
import { FBIKit } from 'src/utils/JustSDK';
import FugitiveListItem from '../../components/JustFugitives/FugitiveListItem';

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
            {isLoading && (
                <VStack>
                    <LoadingAnimation />
                </VStack>
            )}
            <HStack scroll='vertical' wrap>
                {fugitives.map(fugitive => (
                    <FugitiveListItem key={fugitive.name} {...fugitive} opensProfile={false} />
                ))}
            </HStack>
        </VStack>
    );
}
