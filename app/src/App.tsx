import FBIMostWanted from './pages/FBIMostWanted';
import JustStocks from './pages/JustStocks';
import LandingPage from './pages/LandingPage';

function App(): JSX.Element {
    return <>{getPage(window.location.pathname)}</>;
}

/**
 * Returns the correct page based on the pathname.
 *
 * @param pathname - The pathname of the current page.
 * @returns The correct JSX page.
 */
function getPage(pathname: string) {
    switch (pathname) {
        case '/':
            return <LandingPage />;
        case '/stocks':
            return <JustStocks />;
        case '/most-wanted':
            return <FBIMostWanted />;
        default:
            return <div>404</div>;
    }
}

export default App;
