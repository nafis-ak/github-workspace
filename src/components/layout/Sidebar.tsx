import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Search, 
  Heart, 
  FolderKanban, 
  Bell, 
  Settings, 
  UserSquare2,
  Code2
} from 'lucide-react';

export default function Sidebar() {
  const { path, navigate } = useRouter();
  const { favorites, collections, notifications } = useApp();

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/dashboard',
      badge: null
    },
    {
      label: 'Advanced Search',
      icon: Search,
      route: '/search',
      badge: null
    },
    {
      label: 'Repo Collections',
      icon: FolderKanban,
      route: '/collections',
      badge: collections.length > 0 ? collections.length : null,
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
    },
    {
      label: 'Favorites List',
      icon: Heart,
      route: '/favorites',
      badge: favorites.length > 0 ? favorites.length : null,
      badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
    },
    {
      label: 'Notifications',
      icon: Bell,
      route: '/notifications',
      badge: unreadNotifications > 0 ? unreadNotifications : null,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      label: 'Settings',
      icon: Settings,
      route: '/settings',
      badge: null
    }
  ];

  // Helper to determine if item is active
  const isActive = (itemRoute: string) => {
    if (itemRoute === '/dashboard' && path === '/dashboard') return true;
    if (itemRoute !== '/dashboard' && path.startsWith(itemRoute)) return true;
    return false;
  };

  return (
    <aside className="fixed bottom-0 left-0 z-20 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-6 md:flex flex-col justify-between transition-colors duration-200">
      {/* Primary Links */}
      <div className="space-y-1.5">
        <p className="px-3 mb-3 text-[10px] font-mono tracking-wider text-gray-400 uppercase dark:text-gray-500">
          Workspace Modules
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.route);

            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-sans text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm border-l-4 border-blue-600 dark:border-blue-400 pl-2.5'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                    active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-mono ${
                    item.badgeColor || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mini footer containing workspace credits */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 px-3 space-y-2 select-none">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-gray-400" />
          <span className="text-[10px] font-mono text-gray-400">API Standard: v3 REST</span>
        </div>
        <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
          Developed under Google AI Studio workspace container.
        </p>
      </div>
    </aside>
  );
}
