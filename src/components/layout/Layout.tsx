import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Search, Heart, FolderKanban, Bell, Settings } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { path, navigate } = useRouter();
  const { notifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const mobileNavItems = [
    { label: 'Home', icon: LayoutDashboard, route: '/dashboard' },
    { label: 'Search', icon: Search, route: '/search' },
    { label: 'Collections', icon: FolderKanban, route: '/collections' },
    { label: 'Favorites', icon: Heart, route: '/favorites' },
    { label: 'Alerts', icon: Bell, route: '/notifications', badge: unreadCount > 0 },
    { label: 'Settings', icon: Settings, route: '/settings' },
  ];

  const isActive = (itemRoute: string) => {
    if (itemRoute === '/dashboard' && path === '/dashboard') return true;
    if (itemRoute !== '/dashboard' && path.startsWith(itemRoute)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <Navbar />

      <div className="flex-1 flex">
        {/* Left Sidebar on desktop */}
        <Sidebar />

        {/* Main Workspace Frame */}
        <main className="flex-1 w-full md:pl-64 pb-20 md:pb-6 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile / Tablet screens */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 backdrop-blur px-2 py-1.5 flex items-center justify-around transition-all duration-200">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2.5 py-1 rounded-xl relative transition-all duration-200 ${
                active 
                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'scale-105' : 'scale-95'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 flex h-2 w-2 rounded-full bg-red-500" />
                )}
              </div>
              <span className="text-[9px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
