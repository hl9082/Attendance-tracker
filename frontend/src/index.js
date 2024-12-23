/**
 * @author Huy Le (hl9082)
 * @description Entry point for react app
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Import global CSS styles (if any)
import App from './App';  // Import the root App component
import reportWebVitals from './reportWebVitals';  // Optional for measuring performance (if needed)

// The root of the application where the React app will be rendered
ReactDOM.render(
  <React.StrictMode>
    <App />  {/* The root App component */}
  </React.StrictMode>,
  document.getElementById('root') // This is where the React app will mount in index.html
);

// Optional: Log performance metrics (for debugging or optimization)
reportWebVitals();
