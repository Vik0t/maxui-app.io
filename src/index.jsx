import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18+
import { BrowserRouter } from 'react-router-dom';
import App from "./App";

// Create root and render (React 18+ syntax)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);