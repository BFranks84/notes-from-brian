import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './fonts.css';
import '@frontify/fondue-tokens/styles';
import './styles.css';
import { App } from './App.jsx';
import { inject } from '@vercel/analytics';

// Vercel Web Analytics: counts page views per page (and utm_source, e.g. postcard vs. share).
inject();

createRoot(document.getElementById('root')).render(<App />);
