import logo from '../resources/images/icons/logo-alt.png';
import './BrandButton.css';

/**
 * React component with the alternative branding icon. Once the button is clicked,
 * the site will navigate to the homepage (/).
 *
 * @returns A React component that renders the JustData icon (not the actual logo).
 */
function BrandButton() {
    return (
        <a href='/' className='brand-button'>
            <img src={logo} alt='Brand' className='brand-button-brand' />
        </a>
    );
}

export default BrandButton;
