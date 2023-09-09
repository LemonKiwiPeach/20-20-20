import React from 'react';
import ReactDOM from 'react-dom/client';
import TwentyTwentyTwenty from './components/TwentyTwentyTwenty';
import './styles/global.css';
import { SettingsProvider } from './components/SettingsContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <SettingsProvider>
    <TwentyTwentyTwenty />
  </SettingsProvider>
);
