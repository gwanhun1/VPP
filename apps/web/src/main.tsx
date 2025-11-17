import { StrictMode, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@vpp/shared-ui';
import App from './app/app';
import './styles.css';

type ThemeMode = 'light' | 'dark';

declare global {
  interface Window {
    vppSetThemeMode?: (mode: ThemeMode) => void;
  }
}

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }
  try {
    const stored = window.localStorage.getItem('vpp:web-theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
  } catch {
    // ignore
  }
  return 'light';
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function Root() {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialThemeMode());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.vppSetThemeMode = (nextMode: ThemeMode) => {
      setMode(nextMode);
    };
    return () => {
      if (window.vppSetThemeMode) {
        delete window.vppSetThemeMode;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const rootEl = document.documentElement;
    if (mode === 'dark') {
      rootEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('vpp:web-theme', mode);
    } catch {
      // ignore
    }
  }, [mode]);

  return (
    <ThemeProvider mode={mode}>
      <BrowserRouter
        basename="/"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);
