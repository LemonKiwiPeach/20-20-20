import React from 'react';
import ReactDOM from 'react-dom/client';
import TwentyTwentyTwenty from './components/TwentyTwentyTwenty';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <TwentyTwentyTwenty />
  </React.StrictMode>
);
