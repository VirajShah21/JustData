import './App.css';
import JustStocks from './JustStocks';
import LandingPage from './LandingPage';

function App() {
    switch (window.location.pathname) {
        case '/':
            return <LandingPage />;
        case '/stocks':
            return <JustStocks />;
        default:
            return <div>404</div>;
    }
}

export default App;
