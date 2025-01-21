import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Import du service worker
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Activer le service worker pour transformer l'app en PWA
serviceWorkerRegistration.register();

// Si vous souhaitez commencer à mesurer la performance de votre app, passez une fonction à reportWebVitals.
// Par exemple : reportWebVitals(console.log)
reportWebVitals();
