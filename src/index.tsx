import React from 'react';
import ReactDOM from 'react-dom/client';
import TwentyTwentyTwenty from './components/TwentyTwentyTwenty';
import { GlobalStyle } from './styles/GlobalStyledComponents';
import { SettingsProvider } from './components/SettingsContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <>
    <GlobalStyle />
    <SettingsProvider>
      <TwentyTwentyTwenty />
    </SettingsProvider>
  </>
);
