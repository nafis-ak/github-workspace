import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  params: Record<string, string>;
  queryParams: URLSearchParams;
  navigate: (toPath: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

const routeTemplates = [
  '/login',
  '/register',
  '/dashboard',
  '/users/:username',
  '/repos/:owner/:repo',
  '/favorites',
  '/collections',
  '/notifications',
  '/settings',
  '/search',
];

// Helper to parse route template matching and capture route params
function matchRoute(currentPath: string, template: string): Record<string, string> | null {
  const currentParts = currentPath.split('/').filter(Boolean);
  const templateParts = template.split('/').filter(Boolean);

  if (currentParts.length !== templateParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < templateParts.length; i++) {
    if (templateParts[i].startsWith(':')) {
      const paramName = templateParts[i].slice(1);
      params[paramName] = currentParts[i];
    } else if (templateParts[i].toLowerCase() !== currentParts[i].toLowerCase()) {
      return null;
    }
  }
  return params;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  // Parse initial hash or fallback to /dashboard
  const getHashParts = () => {
    const rawHash = window.location.hash || '#/dashboard';
    const [rawPath, rawQuery] = rawHash.replace(/^#/, '').split('?');
    return {
      path: rawPath || '/dashboard',
      queryParams: new URLSearchParams(rawQuery || ''),
    };
  };

  const [state, setState] = useState(() => {
    const { path, queryParams } = getHashParts();
    return { path, queryParams };
  });

  useEffect(() => {
    const handleHashChange = () => {
      const { path, queryParams } = getHashParts();
      setState({ path, queryParams });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Ensure initial routing hash is set in the URL if it was empty
    if (!window.location.hash) {
      window.location.hash = '#/dashboard';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = (toPath: string) => {
    window.location.hash = toPath.startsWith('/') ? `#${toPath}` : `#/${toPath}`;
  };

  // Find matching template and extract params
  let matchedParams: Record<string, string> = {};
  for (const template of routeTemplates) {
    const match = matchRoute(state.path, template);
    if (match) {
      matchedParams = match;
      break;
    }
  }

  return (
    <RouterContext.Provider
      value={{
        path: state.path,
        params: matchedParams,
        queryParams: state.queryParams,
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
