/**
 * @author Huy Le (hl9082)
 * @description Entry point for react app
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Import global CSS styles (if any)
import App from './App';  // Import the root App component
import reportWebVitals from './reportWebVitals';  // Optional for measuring performance (if needed)

// The root of the application where the React app will be rendered
ReactDOM.createRoot(
  document.getElementById('root')
).render(
  //<React.StrictMode> remove temporarily for debugging
    <App />
  //</React.StrictMode>
);

// Optional: Log performance metrics (for debugging or optimization)
reportWebVitals();
