import { HStack } from 'reaction';
import ArrayUtils from '../utils/ArrayUtils';
import './PageController.css';

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
    return (
        <HStack className='page-controller'>
            {ArrayUtils.enumerate(1, props.lastPage).map(num => (
                <PaginationControllerNumberButton
                    page={num}
                    active={num === props.currentPage}
                    onClick={page => props.onPageChange(page)}
                />
            ))}
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
