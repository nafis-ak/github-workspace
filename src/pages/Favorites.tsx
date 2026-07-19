import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import { Heart, Users, BookOpen, Trash2, ExternalLink, Calendar, Search, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Favorites() {
  const { favorites, removeFavorite } = useApp();
  const { navigate } = useRouter();
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'repos'>('users');

  const favUsers = favorites.filter((f) => f.type === 'user');
  const favRepos = favorites.filter((f) => f.type === 'repo');

  const handleUserJump = (login: string) => {
    navigate(`/users/${login}`);
  };

  const handleRepoJump = (owner: string, name: string) => {
    navigate(`/repos/${owner}/${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-sans font-bold tracking-tight text-2xl text-gray-900 dark:text-white">
          Favorites Workspace
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Instant access to your cataloged developers and codebases.
        </p>
      </div>

      {/* Tabs list */}
      <div className="border-b border-gray-250 dark:border-gray-855 flex items-center gap-1">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition-all relative ${
            activeSubTab === 'users'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="favorites-tab-users"
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-4.5 h-4.5" /> Favorite Developers ({favUsers.length})
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('repos')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition-all relative ${
            activeSubTab === 'repos'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="favorites-tab-repos"
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4.5 h-4.5" /> Favorite Repositories ({favRepos.length})
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div>
        {activeSubTab === 'users' ? (
          <div>
            {favUsers.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-6 rounded-3xl shadow-sm space-y-2">
                <Users className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No favorite developers</p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  When searching or viewing a developer profile, toggle the heart icon to list them here.
                </p>
                <button
                  onClick={() => navigate('/search')}
                  className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" /> Search Developers
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="fav-users-grid">
                {favUsers.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleUserJump(item.login!)}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.avatarUrl}
                            alt={item.login}
                            className="w-12 h-12 rounded-full border border-gray-150 dark:border-gray-800 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h3 className="font-sans font-bold text-gray-950 dark:text-white truncate group-hover:text-blue-600 transition-colors leading-tight">
                              {item.name || item.login}
                            </h3>
                            <span className="font-mono text-[11px] text-gray-400 leading-none">
                              @{item.login}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(item.id);
                          }}
                          className="p-2 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/40 hover:bg-rose-100 transition-colors"
                          title="Remove Favorite"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.description && (
                        <p className="mt-3.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800/60 flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Saved {new Date(item.addedAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-sans font-semibold group-hover:translate-x-0.5 transition-transform">
                        Explore Profile →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {favRepos.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-6 rounded-3xl shadow-sm space-y-2">
                <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No favorite repositories</p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  When browsing public repositories, click the heart icon on cards to save records here.
                </p>
                <button
                  onClick={() => navigate('/search?type=repositories')}
                  className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" /> Browse Repositories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="fav-repos-grid">
                {favRepos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleRepoJump(item.owner!, item.name!)}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatarUrl}
                            alt={item.owner}
                            className="w-8 h-8 rounded-full border border-gray-150 dark:border-gray-800 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-gray-400 block truncate leading-none">
                              {item.owner} /
                            </span>
                            <h3 className="font-sans font-bold text-gray-950 dark:text-white truncate mt-1 group-hover:text-blue-600 transition-colors leading-tight">
                              {item.name}
                            </h3>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(item.id);
                          }}
                          className="p-2 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/40 hover:bg-rose-100 transition-colors"
                          title="Remove Favorite"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.description && (
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed h-8">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <div className="flex items-center gap-3">
                        {item.language && (
                          <span className="font-sans font-medium text-gray-700 dark:text-gray-300">
                            {item.language}
                          </span>
                        )}
                        {item.stars !== undefined && (
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                            <span>{item.stars.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Saved {new Date(item.addedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
