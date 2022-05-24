import { DotIcon } from '@primer/octicons-react';
import { HStack } from 'reaction';
import ArrayUtils from '../utils/ArrayUtils';
import './PaginationController.css';

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

    if (props.currentPage > 5) start = props.currentPage - 3;
    if (props.currentPage + 10 < props.lastPage) stop = start + 9;
    else stop = props.lastPage;

    return (
        <HStack className='page-controller'>
            {start !== 1 && (
                <>
                    <PaginationControllerNumberButton
                        page={1}
                        active={props.currentPage === 1}
                        onClick={props.onPageChange}
                    />
                    <DotIcon fill='gray' />
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
                    <DotIcon fill='gray' />
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
