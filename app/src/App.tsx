import './App.css';
import JustStocks from './pages/JustStocks';
import LandingPage from './pages/LandingPage';

function App() {
    const page = getPage(window.location.pathname);
    return page;
}

function getPage(pathname: string) {
    switch (pathname) {
        case '/':
            return <LandingPage />;
        case '/stocks':
            return <JustStocks />;
        default:
            return <div>404</div>;
    }
}

export default App;
