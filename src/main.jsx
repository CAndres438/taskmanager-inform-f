import React from 'react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './i18n';

//Polyfill for SockJS + Stomp
import process from 'process';
import { Buffer } from 'buffer';

window.global = window;
window.process = process;
window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
