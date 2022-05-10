import { HStack } from 'reaction';
import './ProductComponents.css';

function ProductSectionTitle(props: { icon: JSX.Element; label: string }) {
    return (
        <HStack className='product-section-title' justify='start' width='100%'>
            <span className='product-section-icon'>{props.icon}</span>
            <span className='product-section-label'>{props.label}</span>
        </HStack>
    );
}

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
