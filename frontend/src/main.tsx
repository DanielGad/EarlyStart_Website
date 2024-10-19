import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from './Context/Context';

// Place this in your main app file
window.addEventListener('offline', () => {
  displayNetworkStatus(false);
});

window.addEventListener('online', () => {
  displayNetworkStatus(true);
});

function displayNetworkStatus(isOnline: boolean) {
  const messageDiv = document.getElementById('network-status-message');

  // Check if the messageDiv exists on the page
  if (!messageDiv) {
    console.warn('No element with id "network-status-message" found.');
    return;
  }

  if (isOnline) {
    messageDiv.innerText = '';
    messageDiv.style.display = 'none';  // Hide the message when back online
  } else {
    messageDiv.innerText = 'You are offline. Please check your internet connection.';
    messageDiv.style.display = 'block';  // Show the message when offline
  }
}



const root = document.getElementById('root')!;
const rootElement = createRoot(root);

rootElement.render(
  <StrictMode>
    <Provider>
    <BrowserRouter>
      <App />
      </BrowserRouter>,
    </Provider>
  </StrictMode>
);
