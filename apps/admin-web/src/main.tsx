// import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-reflex/styles.css';
import './styles.scss';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // Strict mode renders everything 2x in dev mode which can be confusing when troubleshooting why useEffect is called 2x to fire API calls
  // <StrictMode>
  <App />
  // </StrictMode>
);
