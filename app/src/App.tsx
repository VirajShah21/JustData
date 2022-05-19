import FBIMostWanted from './pages/FBIMostWanted';
import JustStocks from './pages/JustStocks';
import LandingPage from './pages/LandingPage';

function App() {
    return <>{getPage(window.location.pathname)}</>;
}

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
