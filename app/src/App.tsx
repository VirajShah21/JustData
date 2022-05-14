import { useLoadingScreen, useWaitForImagesToLoad } from './components/LoadingScreen';
import './App.css';
import JustStocks from './pages/JustStocks';
import LandingPage from './pages/LandingPage';

function App() {
    const page = usePage(window.location.pathname);
    const [loadingPage, closeLoadingPage] = useLoadingScreen({
        title: 'Loading',
        message: 'Please wait while we load the page.',
    });
    useWaitForImagesToLoad(() => closeLoadingPage());

    return (
        <div style={{ minWidth: '100vw', minHeight: '100vh' }}>
            {loadingPage}
            {page}
        </div>
    );
}

function usePage(pathname: string) {
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
