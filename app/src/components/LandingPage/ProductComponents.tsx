import { HStack } from 'reaction';
import styles from './ProductComponents.module.css';

/**
 * @param props - The icon and label to be displayed for the section title
 * @returns A simple section title component with an icon and a label.
 */
function ProductSectionTitle(props: { icon: JSX.Element; label: string }) {
    return (
        <HStack
            className={styles.product_section_title}
            justify='start'
            align='center'
            width='100%'>
            <span className={styles.icon}>{props.icon}</span>
            <span className={styles.label}>{props.label}</span>
        </HStack>
    );
}

/**
 * @param props - The icon, label, and url path for the product/service
 * @returns A button to be displayed on the home screen. Once clicked, it will
 * navigate to the correct product page.
 */
function ProductResult(props: { icon: string; label: string; url: string }) {
    return (
        <button
            className={styles.product_result}
            onClick={() => {
                window.location.href = props.url;
            }}>
            <img src={props.icon} alt={props.label} height='50' />
        </button>
    );
}

export { ProductSectionTitle, ProductResult };
