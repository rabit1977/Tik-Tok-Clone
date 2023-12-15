// Import the required modules from React 18
import '@draft-js-plugins/mention/lib/plugin.css';
import AppProviders from './components/AppProviders';
import { createRoot } from 'react-dom/client'; // Import the createRoot function
import App from './App.jsx';
import './index.scss';
import React from 'react';

// Use the createRoot function to create a root object
const root = createRoot(document.getElementById('root'));
// Use the root.render method to render your component tree
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
