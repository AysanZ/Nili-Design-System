import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppShell } from './ui/AppShell';
// Order matters: globals.css declares Tailwind's layer order, and styles.css
// appends its reset into `@layer base`. Reversed, the reset would land in an
// anonymous layer and outrank every utility class the components rely on.
import '@nili/ui/styles/globals.css';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root.');

// No NiliProvider at the root: the studio chrome is not a Nili surface, and a
// document-scoped provider would write `dir` onto <html> and flip the whole
// editor whenever the canvas locale changed.
/* `?app` runs the document instead of editing it. Same bundle, same autosaved
   document, no build step between pressing Run and clicking around the thing
   you drew — which is the shortest path from "I made a screen" to "does it
   actually work". */
const runsTheApp = new URLSearchParams(window.location.search).has('app');

createRoot(container).render(
  <StrictMode>{runsTheApp ? <AppShell /> : <App />}</StrictMode>,
);
