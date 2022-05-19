import { HStack } from 'reaction';
import './ProductComponents.css';

/**
 * @param props - The icon and label to be displayed for the section title
 * @returns A simple section title component with an icon and a label.
 */
function ProductSectionTitle(props: { icon: JSX.Element; label: string }) {
    return (
        <HStack className='product-section-title' justify='start' width='100%'>
            <span className='product-section-icon'>{props.icon}</span>
            <span className='product-section-label'>{props.label}</span>
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
            className='product-result'
            onClick={() => {
                window.location.href = props.url;
            }}>
            <HStack className='product-result' justify='start' width='100%'>
                <span className='product-icon'>
                    <img src={props.icon} alt={props.label} height='50' />
                </span>
                <span className='product-label'>{props.label}</span>
            </HStack>
        </button>
    );
}

export { ProductSectionTitle, ProductResult };
