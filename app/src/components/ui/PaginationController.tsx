import { IonIcon } from '@ionic/react';
import { ellipsisHorizontalOutline } from 'ionicons/icons';
import { HStack } from 'reaction';
import ArrayUtils from 'src/utils/ArrayUtils';
import './PaginationController.css';

const MAX_PAGES_TO_SHOW = 10;
const MIN_PREVIOUS_PAGES_TO_SHOW = 3;

/**
 * @param props - Takes three non-optional props:
 * - `lastPage` - The last page of the pagination.
 * - `currentPage` - The currently active page of the pagination.
 * - `onPageChange` - A function that will be called when the user changes the page
 * by clicking on a page number.
 * @returns The pagination controller component.
 */
function PaginationController(props: {
    lastPage: number;
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
}) {
    let start = 1;
    let stop: number;

    if (props.currentPage > MAX_PAGES_TO_SHOW - MIN_PREVIOUS_PAGES_TO_SHOW) {
        start = props.currentPage - MIN_PREVIOUS_PAGES_TO_SHOW;
    }

    if (props.currentPage + MAX_PAGES_TO_SHOW < props.lastPage) {
        stop = start + MAX_PAGES_TO_SHOW - 1;
    } else {
        stop = props.lastPage;
    }

    return (
        <HStack className='page-controller'>
            {start !== 1 && (
                <>
                    <PaginationControllerNumberButton
                        page={1}
                        active={props.currentPage === 1}
                        onClick={props.onPageChange}
                    />
                    <IonIcon icon={ellipsisHorizontalOutline} color='gray' />
                </>
            )}

            {ArrayUtils.enumerate(start, stop + 1).map(num => (
                <PaginationControllerNumberButton
                    page={num}
                    active={num === props.currentPage}
                    onClick={page => props.onPageChange(page)}
                />
            ))}

            {stop !== props.lastPage && (
                <>
                    <IonIcon icon={ellipsisHorizontalOutline} color='gray' />
                    <PaginationControllerNumberButton
                        page={props.lastPage}
                        active={props.currentPage === props.lastPage}
                        onClick={props.onPageChange}
                    />
                </>
            )}
        </HStack>
    );
}

/**
 * @param props - Takes three props:
 * - `page` - The page number to be displayed on the button
 * - `active` - Whether this page is the current page
 * - `onClick` - A callback to be called when the page number button is clicked
 * @returns A pagination controller button
 */
function PaginationControllerNumberButton(props: {
    page: number;
    active?: boolean;
    onClick: (pageNumber: number) => void;
}) {
    return (
        <button
            className={`page-controller-number-button${props.active ? ' active' : ''}`}
            onClick={() => props.onClick(props.page)}>
            {props.page}
        </button>
    );
}

export default PaginationController;
