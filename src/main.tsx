import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PrintView from './PrintView.tsx'

function Router() {
  const [view, setView] = useState(() =>
    window.location.hash === '#print' ? 'print' : 'app'
  );

  useEffect(() => {
    const handler = () => setView(window.location.hash === '#print' ? 'print' : 'app');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return view === 'print' ? <PrintView /> : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
