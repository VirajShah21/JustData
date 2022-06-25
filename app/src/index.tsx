import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'reaction/css/Stacks.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AppPreferences from './utils/AppPreferences';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

// When the page loads, set the appropriate color theme
document.querySelector('body')?.classList.add(AppPreferences.theme);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
