import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from './Context/Context';

const root = document.getElementById('root')!;
const rootElement = createRoot(root);

rootElement.render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
