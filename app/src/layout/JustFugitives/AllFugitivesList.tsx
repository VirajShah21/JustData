import { useEffect, useState } from 'react';
import { HStack, VStack } from 'reaction';
import LoadingAnimation from 'src/components/LoadingAnimation';
import PaginationController from 'src/components/ui/PaginationController';
import { FBIKit } from 'src/utils/JustSDK';
import FugitiveListItem from '../../components/JustFugitives/FugitiveListItem';

export interface AllFugitivesListProps {
    filter: string;
}

let allFugitives: SimpleFugitiveData[] = [];
let isDownloading = false;

async function downloadFugitives() {
    if (!isDownloading) {
        isDownloading = true;
        try {
            allFugitives = await FBIKit.requestAllFugitives();
        } catch (err) {
            // TODO: Error handling
        }
        isDownloading = false;
    }
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
export default function AllFugitivesList({ filter }: AllFugitivesListProps) {
    const pageSize = 20;
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [fugitives, setFugitives] = useState<SimpleFugitiveData[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('Filter', filter);
            console.log('Fugitives', fugitives);
        });

        if (allFugitives.length === 0) {
            setIsLoading(true);
            downloadFugitives().then(() => {
                setFugitives(allFugitives);
                setIsLoading(false);
            });
        }

        return clearInterval(timer);
    }, []);

    useEffect(() => {
        setFugitives(
            allFugitives.filter(fugitive => fugitive.name.toLowerCase().includes(filter.trim())),
        );
    }, [filter]);

    return (
        <VStack width='100%'>
            {isLoading && <LoadingAnimation />}
            <HStack scroll='vertical' wrap>
                {fugitives.slice(pageSize * (page - 1), pageSize * page).map(fugitive => (
                    <FugitiveListItem key={fugitive.name} {...fugitive} opensProfile={true} />
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
