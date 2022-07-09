import { useEffect, useState } from 'react';
import { HStack, VStack } from 'reaction';
import LoadingAnimation from 'src/components/LoadingAnimation';
import PaginationController from 'src/components/ui/PaginationController';
import { FBIKit } from 'src/utils/JustSDK';
import FugitiveListItem from '../../components/JustFugitives/FugitiveListItem';

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
export default function AllFugitivesList() {
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
