import React, { createContext, useContext } from 'react';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
};

const ThemeModeContext = createContext<ThemeContextValue>({ mode: 'light' });

type ThemeProviderProps = {
  mode: ThemeMode;
  children: React.ReactNode;
};

export function ThemeProvider({ mode, children }: ThemeProviderProps) {
  return (
    <ThemeModeContext.Provider value={{ mode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeMode {
  return useContext(ThemeModeContext).mode;
}

export function useIsDarkMode(): boolean {
  return useThemeMode() === 'dark';
}
