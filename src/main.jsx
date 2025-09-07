// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Your main application component
import './index.css';        // Global styles
import { AuthProvider } from './context/AuthContext'; // <-- Import the AuthProvider

// Create a root for rendering the React app into the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application, wrapping App with AuthProvider
root.render(
  <React.StrictMode>
    {/* The AuthProvider makes the currentUser and authentication functions 
      available to any component within this tree via the useAuth hook.
    */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);