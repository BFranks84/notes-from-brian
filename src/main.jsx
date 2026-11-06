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
// Brian's own visits: open any page once with ?notrack on each browser/device to stop counting
// that browser (stored in localStorage); ?track turns counting back on.
const OPT_OUT_KEY = 'nfb-notrack';
const optedOut = (() => {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.has('notrack')) localStorage.setItem(OPT_OUT_KEY, '1');
    if (q.has('track')) localStorage.removeItem(OPT_OUT_KEY);
    if (q.has('notrack') || q.has('track')) {
      q.delete('notrack'); q.delete('track');
      const rest = q.toString();
      window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : '') + window.location.hash);
    }
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
})();
inject({ beforeSend: (event) => (optedOut ? null : event) });

createRoot(document.getElementById('root')).render(<App />);
