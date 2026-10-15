import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error('Global Error:', msg, { url, lineNo, columnNo, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled Rejection:', event.reason);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
