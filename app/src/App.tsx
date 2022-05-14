import './App.css';
import JustStocks from './pages/JustStocks';
import LandingPage from './pages/LandingPage';

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
