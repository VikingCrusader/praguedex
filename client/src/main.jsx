import React from 'react';
import ReactDOM from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import './styles/global.css';
import './styles/pixelart.css';
import './styles/history.css';
import './styles/achievements.css';
import './styles/packs.css';
import './styles/guide.css';
import App from './App';
import { startAutoUpdate } from './utils/autoUpdate';
import { applyAppMode } from './utils/appMode';
import { preloadPages, preloadStartPage } from './utils/lazyPage';
import { startEarlyFetches } from './utils/earlyFetch';

applyAppMode();
startEarlyFetches();
preloadStartPage();
// The other pages once start-up is over (index.html fires this after the splash).
window.addEventListener('bootsplashdone', () => setTimeout(preloadPages, 300), { once: true });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
startAutoUpdate();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
