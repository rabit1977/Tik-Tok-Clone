import '@draft-js-plugins/mention/lib/plugin.css';
import AppProviders from './components/AppProviders';

import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
