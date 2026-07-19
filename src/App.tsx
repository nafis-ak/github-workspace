import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import UserDetails from './pages/UserDetails';
import RepositoryDetails from './pages/RepositoryDetails';
import Favorites from './pages/Favorites';
import Collections from './pages/Collections';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function AppContent() {
  const { path, navigate } = useRouter();
  const { isAuthenticated } = useAuth();

  // Authentication Route Guard protection (Module 1)
  useEffect(() => {
    if (!isAuthenticated && path !== '/login' && path !== '/register') {
      navigate('/login');
    } else if (isAuthenticated && (path === '/login' || path === '/register')) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, path, navigate]);

  // Route router mapping
  const renderActiveRoute = () => {
    // Unprotected Routes
    if (path === '/login') return <Login />;
    if (path === '/register') return <Register />;

    // Protected Routes
    switch (true) {
      case path === '/dashboard':
        return (
          <Layout>
            <Dashboard />
          </Layout>
        );
      case path === '/search':
        return (
          <Layout>
            <Search />
          </Layout>
        );
      case path.startsWith('/users/'):
        return (
          <Layout>
            <UserDetails />
          </Layout>
        );
      case path.startsWith('/repos/'):
        return (
          <Layout>
            <RepositoryDetails />
          </Layout>
        );
      case path === '/favorites':
        return (
          <Layout>
            <Favorites />
          </Layout>
        );
      case path === '/collections':
        return (
          <Layout>
            <Collections />
          </Layout>
        );
      case path === '/notifications':
        return (
          <Layout>
            <Notifications />
          </Layout>
        );
      case path === '/settings':
        return (
          <Layout>
            <Settings />
          </Layout>
        );
      default:
        // Fallback for unmatched hashes, redirecting back home
        return (
          <Layout>
            <Dashboard />
          </Layout>
        );
    }
  };

  return <>{renderActiveRoute()}</>;
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </ThemeProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
