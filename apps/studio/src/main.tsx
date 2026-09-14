import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
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
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
