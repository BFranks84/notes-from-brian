import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './fonts.css';
import '@frontify/fondue-tokens/styles';
import './styles.css';
import './ds.css';
import './phone.css';
import { App } from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
