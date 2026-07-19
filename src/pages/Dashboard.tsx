import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  Heart, 
  FolderKanban, 
  Bell, 
  History, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  Github,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const { 
    favorites, 
    collections, 
    notifications, 
    activityFeed, 
    clearActivityFeed,
    logActivity 
  } = useApp();
  const { defaultSearchType } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = notifications.filter(n => !n.isRead).slice(0, 4);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      logActivity('search', `Searched query: "${searchQuery.trim()}"`, searchQuery.trim());
      
      // Navigate based on user preference or custom query param
      if (defaultSearchType === 'users') {
        navigate(`/search?type=users&q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/search?type=repos&q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const loadDeveloperShortcut = (username: string) => {
    logActivity('view_user', `Viewed Profile: @${username}`, username);
    navigate(`/users/${username}`);
  };

  const statsCards = [
    {
      title: 'Saved Favorites',
      count: favorites.length,
      icon: Heart,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40',
      route: '/favorites'
    },
    {
      title: 'Repo Collections',
      count: collections.length,
      icon: FolderKanban,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40',
      route: '/collections'
    },
    {
      title: 'Unread Alerts',
      count: notifications.filter(n => !n.isRead).length,
      icon: Bell,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40',
      route: '/notifications'
    }
  ];

  const featuredDevelopers = [
    { username: 'nafis-ak', label: 'Md. Asif Khandoker', desc: 'AI, Data Science & XAI Researcher', avatar: 'https://avatars.githubusercontent.com/u/196431252?v=4' },
    { username: 'tahmid-rahman', label: 'Tahmid Rahman', desc: 'MERN Stack Engineer', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=tahmid-rahman' },
    { username: 'anika-tabassum', label: 'Anika Tabassum', desc: 'NLP & Data Analyst', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=anika-tabassum' }
  ];

  return (
    <div className="space-y-8">
      {/* 1. Dashboard Greeting and Search Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Floating gradient decorative sphere */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-900/10 rounded-full blur-xl pointer-events-none -ml-10 -mb-10" />

        <div className="space-y-2.5 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium font-sans">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Environment Live
          </div>
          <h2 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl">
            Hello, {user?.username || 'Developer'}!
          </h2>
          <p className="text-blue-100 text-sm font-sans leading-relaxed">
            Welcome to your unified GitHub Client Workspace. Query users, inspect code repositories, curate custom project collections, and coordinate developers.
          </p>
        </div>

        {/* Unified Search Input form */}
        <form onSubmit={handleQuickSearch} className="w-full md:max-w-md z-10" id="dash-search-form">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Search className="w-5 h-5 text-gray-300" />
            </span>
            <input
              type="text"
              placeholder="Search developers or repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-3.5 bg-white text-gray-900 placeholder-gray-400 border border-transparent rounded-2xl shadow focus:outline-none focus:ring-4 focus:ring-white/15 text-sm"
              id="dash-search-input"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 rounded-xl transition-colors shadow-sm"
              id="dash-search-submit"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* 2. Quick Access Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.route)}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-4 group"
            >
              <div className={`p-3.5 rounded-2xl border ${card.color} group-hover:scale-105 transition-transform duration-200`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-wide text-gray-400 uppercase block">
                  {card.title}
                </span>
                <span className="font-sans font-bold text-2xl text-gray-950 dark:text-white block mt-0.5">
                  {card.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Bento Layout Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Bento: Quick Shortcuts */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-55 dark:border-gray-800 pb-3">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">
              Shortcut Developers
            </h3>
          </div>
          <div className="space-y-3">
            {featuredDevelopers.map((dev) => (
              <div
                key={dev.username}
                onClick={() => loadDeveloperShortcut(dev.username)}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={dev.avatar}
                    alt={dev.username}
                    className="w-9 h-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-gray-800 dark:text-white truncate">
                      {dev.label}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {dev.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Middle Bento: Personalized Activity Feed (Module 8) */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 p-6 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-55 dark:border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white">
                Workspace Activity Feed
              </h3>
            </div>
            {activityFeed.length > 0 && (
              <button
                onClick={clearActivityFeed}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline flex items-center gap-1"
                id="dash-clear-activity-btn"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
          </div>

          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            {activityFeed.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Clock className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto" />
                <p className="text-xs text-gray-400">
                  Your workspace is currently quiet.
                </p>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                  View profiles, repositories, or query search terms to begin tracking history!
                </p>
              </div>
            ) : (
              activityFeed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'view_user') navigate(`/users/${item.targetId}`);
                    else if (item.type === 'view_repo') navigate(`/repos/${item.targetId}`);
                    else if (item.type === 'search') navigate(`/search?q=${encodeURIComponent(item.targetId)}`);
                  }}
                  className="flex items-start justify-between p-3 rounded-xl border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-750 hover:bg-gray-50/50 dark:hover:bg-gray-800/10 cursor-pointer transition-colors"
                >
                  <div className="flex gap-3 min-w-0">
                    <div className="mt-0.5 p-1 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Target: {item.targetId}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Alert Updates Strip */}
      {unreadNotifications.length > 0 && (
        <div className="bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20 p-5 space-y-3">
          <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-sans">
            <Bell className="w-4 h-4" /> Active Workspace Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unreadNotifications.map((not) => (
              <div
                key={not.id}
                onClick={() => navigate('/notifications')}
                className="bg-white/80 dark:bg-gray-900/60 p-3 rounded-xl border border-amber-500/10 hover:border-amber-500/30 cursor-pointer flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 dark:text-white truncate">
                    {not.title}
                  </p>
                  <p className="text-[10px] text-gray-400 line-clamp-1">
                    {not.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
