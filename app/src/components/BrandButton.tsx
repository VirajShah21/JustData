import logo from '../logo-alt.png';
import './BrandButton.css';

function BrandButton() {
    return (
        <a href='/' className='brand-button'>
            <img src={logo} alt='Brand' className='brand-button-brand' />
        </a>
    );
}

export default BrandButton;
