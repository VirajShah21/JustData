import { useEffect, useState } from 'react';
import { HStack, VStack } from 'reaction';
import LoadingAnimation from 'src/components/LoadingAnimation';
import { FBIKit } from 'src/utils/JustSDK';
import FugitiveListItem from '../../components/JustFugitives/FugitiveListItem';

export interface TenMostWantedListProps {
    filter: string;
}

let allFugitives: SimpleFugitiveData[] = [];

async function downloadFugitives() {
    try {
        allFugitives = await FBIKit.requestTenMostWantedFugitives();
    } catch (err) {
        // TODO: Error handling
    }
}

/**
 * This React component displays a list of the ten most wanted fugitives. It simply
 * uses the fugitives name and when their image is hovered, it also shows an option
 * to view their wanted poster.
 *
 * @returns The ten most wanted fugitives list.
 */
export default function TenMostWantedList({ filter }: TenMostWantedListProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        downloadFugitives().then(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <VStack>
            {isLoading && (
                <VStack>
                    <LoadingAnimation />
                </VStack>
            )}

            <HStack scroll='vertical' wrap>
                {allFugitives
                    .filter(fugitive => fugitive.name.toLowerCase().includes(filter.trim()))
                    .map(fugitive => (
                        <FugitiveListItem key={fugitive.name} {...fugitive} opensProfile={false} />
                    ))}
            </HStack>
        </VStack>
    );
}
