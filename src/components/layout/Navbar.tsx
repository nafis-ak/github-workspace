import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Github, Bell, Sun, Moon, LogOut, Search, Laptop } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();
  const { notifications } = useApp();
  const { theme, setTheme } = useTheme();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />;
    if (theme === 'dark') return <Moon className="w-5 h-5 text-indigo-400" />;
    return <Laptop className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand logo */}
        <div 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          id="nav-logo"
        >
          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200 group-hover:scale-105">
            <Github className="w-6 h-6" />
          </div>
          <span className="font-sans font-semibold tracking-tight text-lg text-gray-950 dark:text-white">
            GitHub <span className="text-blue-600 dark:text-blue-400 font-mono text-sm font-medium bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900">Workspace</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative group"
            title={`Theme: ${theme}`}
            id="nav-theme-toggle"
          >
            {getThemeIcon()}
            <span className="absolute hidden group-hover:block top-12 right-0 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-55">
              Theme: {theme}
            </span>
          </button>

          {/* Notifications Center Quick Link */}
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative"
            id="nav-notifications-link"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800" />

          {/* User Profile display & Logout */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.username}
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  {user.email}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-sans font-bold text-xs shadow-inner">
                {user.username.charAt(0).toUpperCase()}
              </div>
              
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-lg text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                title="Log Out"
                id="nav-logout-btn"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
