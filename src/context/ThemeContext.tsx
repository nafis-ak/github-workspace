import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'light' | 'dark' | 'system';
export type PaginationSize = 10 | 20 | 50;
export type SearchType = 'users' | 'repositories';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  paginationSize: PaginationSize;
  setPaginationSize: (size: PaginationSize) => void;
  defaultSearchType: SearchType;
  setDefaultSearchType: (type: SearchType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    return (localStorage.getItem('ghw_theme') as ThemeType) || 'system';
  });

  const [paginationSize, setPaginationSizeState] = useState<PaginationSize>(() => {
    return Number(localStorage.getItem('ghw_pagination_size')) as PaginationSize || 10;
  });

  const [defaultSearchType, setDefaultSearchTypeState] = useState<SearchType>(() => {
    return (localStorage.getItem('ghw_default_search_type') as SearchType) || 'users';
  });

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system theme changes if set to system
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('ghw_theme', newTheme);
  };

  const setPaginationSize = (newSize: PaginationSize) => {
    setPaginationSizeState(newSize);
    localStorage.setItem('ghw_pagination_size', String(newSize));
  };

  const setDefaultSearchType = (newType: SearchType) => {
    setDefaultSearchTypeState(newType);
    localStorage.setItem('ghw_default_search_type', newType);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        paginationSize,
        setPaginationSize,
        defaultSearchType,
        setDefaultSearchType,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
