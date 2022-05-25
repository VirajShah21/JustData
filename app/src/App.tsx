import JustFugitives from './pages/JustFugitives';
import JustPlaces from './pages/JustPlaces';
import JustSCOTUS from './pages/JustSCOTUS';
import JustSecurities from './pages/JustSecurities';
import LandingPage from './pages/LandingPage';
import SearchEngine from './pages/SearchEngine';

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
            return <JustSecurities />;
        case '/most-wanted':
            return <JustFugitives />;
        case '/search':
            return <SearchEngine />;
        case '/places':
            return <JustPlaces />;
        case '/scotus':
            return <JustSCOTUS />;
        default:
            return <div>404</div>;
    }
}

export default App;
