import JustBanksy from './layout/JustBanksy';
import JustFugitives from './layout/JustFugitives';
import JustPlaces from './layout/JustPlaces';
import JustSCOTUS from './layout/JustSCOTUS';
import JustSecurities from './layout/JustSecurities';
import LandingPage from './layout/LandingPage';
import SearchEngine from './layout/SearchEngine';

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
        case '/banksy':
            return <JustBanksy />;
        default:
            return <div>404</div>;
    }
}

export default App;
