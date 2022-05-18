import { HStack } from 'reaction';
import ArrayUtils from '../utils/ArrayUtils';
import './PageController.css';

function PageController(props: {
    lastPage: number;
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
}) {
    return (
        <HStack className='page-controller'>
            {ArrayUtils.enumerate(1, props.lastPage).map(num => (
                <PageControllerNumberButton
                    page={num}
                    active={num === props.currentPage}
                    onClick={page => props.onPageChange(page)}
                />
            ))}
        </HStack>
    );
}

function PageControllerNumberButton(props: {
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

export default PageController;
