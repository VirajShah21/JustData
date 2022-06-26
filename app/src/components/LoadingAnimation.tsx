import logo from 'src/resources/images/icons/logo-alt.png';
import './LoadingAnimation.css';

/**
 * A loading animation component. The loading animation is the alternative brand image that
 * rotates at a rate of 1 rotation per second, using the ease timing function.
 *
 * @returns The alternative brand image for JustData as a loading animation.
 */
export default function LoadingAnimation() {
    return <img src={logo} alt='Loading Animation' className='loading-animation' />;
}
