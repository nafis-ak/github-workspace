import React, { useState } from 'react';
import { GitHubRepo } from '../../types';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { Heart, Star, GitFork, AlertCircle, FolderPlus, Check, Plus, FolderSync } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RepoCardProps {
  repo: GitHubRepo;
  key?: string | number;
}

export default function RepoCard({ repo }: RepoCardProps) {
  const { navigate } = useRouter();
  const { 
    isFavorite, 
    addFavorite, 
    removeFavorite, 
    collections, 
    addRepoToCollection, 
    removeRepoFromCollection,
    createCollection,
    logActivity 
  } = useApp();

  const [showCollectionsDropdown, setShowCollectionsDropdown] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [showCreateInline, setShowCreateInline] = useState(false);

  const fullName = repo.full_name;
  const isFav = isFavorite(`repo:${fullName}`);

  // Find collections this repo belongs to
  const itemInCollections = collections.filter((c) => c.repoFullNames.includes(fullName));

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(`repo:${fullName}`);
    } else {
      addFavorite({
        id: `repo:${fullName}`,
        type: 'repo',
        owner: repo.owner.login,
        name: repo.name,
        avatarUrl: repo.owner.avatar_url,
        description: repo.description || 'GitHub Code Repository',
        stars: repo.stargazers_count,
        language: repo.language || 'Code',
      });
    }
  };

  const handleCollectionToggle = (e: React.MouseEvent, colId: string, belongs: boolean) => {
    e.stopPropagation();
    if (belongs) {
      removeRepoFromCollection(colId, fullName);
    } else {
      addRepoToCollection(colId, fullName);
    }
  };

  const handleCreateCollectionInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColName.trim()) {
      createCollection(newColName.trim(), 'Created from Repository Explorer card');
      setNewColName('');
      setShowCreateInline(false);
    }
  };

  const handleCardClick = () => {
    logActivity('view_repo', `Viewed Repo: ${fullName}`, fullName);
    navigate(`/repos/${repo.owner.login}/${repo.name}`);
  };

  // Color mapping for popular GitHub languages
  const getLanguageColor = (lang: string | null) => {
    if (!lang) return 'bg-gray-400';
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-400',
      typescript: 'bg-blue-500',
      python: 'bg-emerald-500',
      java: 'bg-amber-600',
      c: 'bg-gray-500',
      'c++': 'bg-pink-500',
      'c#': 'bg-green-600',
      html: 'bg-orange-500',
      css: 'bg-indigo-500',
      ruby: 'bg-red-500',
      go: 'bg-cyan-500',
      rust: 'bg-orange-700',
      php: 'bg-indigo-400',
      shell: 'bg-green-400',
    };
    return colors[lang.toLowerCase()] || 'bg-blue-400';
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ duration: 0.15 }}
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative"
    >
      <div>
        {/* Header Block: Owner Avatar and Repo Name */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-800 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-gray-400 block truncate leading-tight">
                {repo.owner.login} /
              </span>
              <h3 className="font-sans font-bold text-gray-950 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {repo.name}
              </h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Collection Add Button */}
            <div className="relative">
              <button
                onClick={() => setShowCollectionsDropdown(!showCollectionsDropdown)}
                className={`p-2 rounded-xl transition-all duration-200 border ${
                  itemInCollections.length > 0
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border-indigo-100 dark:border-indigo-900/40'
                    : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                title="Manage Collections"
                id={`repo-${repo.id}-collection-btn`}
              >
                <FolderPlus className="w-4 h-4" />
              </button>

              {/* Collections drop dropdown list */}
              <AnimatePresence>
                {showCollectionsDropdown && (
                  <>
                    <div className="fixed inset-0 z-45" onClick={() => setShowCollectionsDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl shadow-xl z-50 p-3.5 space-y-3 cursor-default"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 pb-2">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <FolderSync className="w-3.5 h-3.5" /> Collections
                        </span>
                        <button
                          onClick={() => setShowCreateInline(!showCreateInline)}
                          className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                        >
                          {showCreateInline ? 'Cancel' : 'New +'}
                        </button>
                      </div>

                      {/* Create collection inside card dropdown */}
                      {showCreateInline ? (
                        <form onSubmit={handleCreateCollectionInline} className="space-y-2">
                          <input
                            type="text"
                            placeholder="Collection name..."
                            value={newColName}
                            onChange={(e) => setNewColName(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
                            autoFocus
                          />
                          <button
                            type="submit"
                            disabled={!newColName.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Create
                          </button>
                        </form>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                          {collections.length === 0 ? (
                            <p className="text-[10px] text-gray-400 text-center py-4">
                              No collections created yet.
                            </p>
                          ) : (
                            collections.map((col) => {
                              const belongs = col.repoFullNames.includes(fullName);
                              return (
                                <button
                                  key={col.id}
                                  onClick={(e) => handleCollectionToggle(e, col.id, belongs)}
                                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                                    belongs
                                      ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                                      : 'text-gray-600 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                  }`}
                                >
                                  <span className="truncate pr-2">{col.name}</span>
                                  {belongs && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Favorite Star Button */}
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isFav
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-100 dark:border-rose-900/40'
                  : 'text-gray-400 dark:text-gray-500 hover:text-rose-500 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
              }`}
              title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
              id={`repo-${repo.id}-fav-btn`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Repository Description */}
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 h-8">
          {repo.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Strip: Language, Stars, Forks */}
      <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-3.5">
          {/* Main Programming Language */}
          {repo.language && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-sans font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`} />
              <span>{repo.language}</span>
            </div>
          )}

          {/* Stars */}
          <div className="flex items-center gap-1 hover:text-amber-500 transition-colors" title="Stars">
            <Star className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {repo.stargazers_count.toLocaleString()}
            </span>
          </div>

          {/* Forks */}
          <div className="flex items-center gap-1 hover:text-blue-500 transition-colors" title="Forks">
            <GitFork className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {repo.forks_count.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Open Issues Count */}
        {repo.open_issues_count > 0 && (
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 font-sans font-medium" title="Open Issues">
            <AlertCircle className="w-3 h-3" />
            <span>{repo.open_issues_count}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
