import { VStack } from 'reaction';
import styles from './SearchResult.module.css';

/**
 * A component to display a search result using the Just Data design guidelines.
 *
 * @param props - Accepts only children elements.
 * @returns The search result component.
 */
function SearchResult(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <VStack className={styles.result} width='50%' align='start' height='auto'>
            <VStack className={styles.inner} align='start' width='100%'>
                {props.children}
            </VStack>
        </VStack>
    );
}

export default SearchResult;
