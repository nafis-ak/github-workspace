import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import { githubApi } from '../services/githubApi';
import { useFetch } from '../hooks';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  FolderOpen, 
  BookOpen, 
  ExternalLink,
  Calendar,
  X,
  AlertCircle,
  FolderPlus,
  Loader2,
  FolderCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Collections() {
  const { navigate } = useRouter();
  const { collections, createCollection, deleteCollection, removeRepoFromCollection } = useApp();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedColId, setSelectedColId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const selectedCol = collections.find((c) => c.id === selectedColId);

  // Dynamic fetcher to load the profile/repositories contained inside the selected collection
  const fetchCollectionRepos = async () => {
    if (!selectedCol || selectedCol.repoFullNames.length === 0) return [];

    // Fetch details for each repo in parallel
    const details = await Promise.all(
      selectedCol.repoFullNames.map(async (fullName) => {
        try {
          const [owner, repoName] = fullName.split('/');
          return await githubApi.getRepoDetails(owner, repoName);
        } catch {
          return null;
        }
      })
    );
    return details.filter(Boolean);
  };

  const { data: colRepos, loading: colReposLoading } = useFetch(
    fetchCollectionRepos,
    [selectedColId, selectedCol?.repoFullNames]
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createCollection(name.trim(), desc.trim() || 'Custom Repository Workspace');
      setName('');
      setDesc('');
      setShowCreateModal(false);
    }
  };

  const handleDeleteCollection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCollection(id);
    if (selectedColId === id) {
      setSelectedColId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold tracking-tight text-2xl text-gray-900 dark:text-white">
            Repository Collections
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Group relevant frameworks and repositories into custom folders for project indexing.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm self-start sm:self-auto"
          id="collections-new-btn"
        >
          <Plus className="w-4 h-4" /> Create Collection
        </button>
      </div>

      {/* Grid: Collections Sidebar & Active Collection Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Collections index list */}
        <div className="space-y-3.5">
          <p className="text-[10px] font-bold text-gray-450 uppercase font-mono tracking-wider">
            Category Folder List
          </p>

          {collections.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-6 rounded-2xl shadow-sm text-center space-y-2">
              <FolderPlus className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto" />
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">No collections created yet</p>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                Create a collection index to start curating public repositories directly from explorer cards.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {collections.map((col) => {
                const isActive = selectedColId === col.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => setSelectedColId(isActive ? null : col.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 group ${
                      isActive
                        ? 'bg-blue-50/70 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-100 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50/50 dark:bg-gray-900 dark:border-gray-850 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex gap-3 min-w-0">
                      <div className={`p-2 rounded-xl mt-0.5 border ${
                        isActive 
                          ? 'bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-900' 
                          : 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-750 text-gray-400 group-hover:text-gray-600'
                      }`}>
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs truncate block">{col.name}</span>
                        <span className="text-[10px] text-gray-400 truncate block mt-0.5">{col.description}</span>
                        <span className="text-[10px] text-gray-450 font-mono font-medium block mt-2">
                          {col.repoFullNames.length} project codebases
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteCollection(col.id, e)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Collection Inspector panel */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-[10px] font-bold text-gray-455 uppercase font-mono tracking-wider">
            Collection Inspector Panel
          </p>

          {!selectedCol ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-12 rounded-3xl text-center space-y-2 shadow-sm min-h-64 flex flex-col justify-center items-center">
              <FolderKanban className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No collection selected</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Select a collection index category on the left to inspect its cataloged repositories and manage files.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-6 rounded-3xl shadow-sm space-y-6">
              
              {/* Active Header */}
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-gray-950 dark:text-white">
                      {selectedCol.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {selectedCol.description}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
                    ID: {selectedCol.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-450 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created {new Date(selectedCol.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Repos list */}
              {selectedCol.repoFullNames.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto" />
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Empty Collection Folder</p>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                    Go to search or repository details and click "Manage Collections" to add repository records.
                  </p>
                </div>
              ) : colReposLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
                  <p className="text-xs text-gray-400 mt-2">Opening repository files...</p>
                </div>
              ) : (
                <div className="space-y-3.5" id="collections-repos-list">
                  {colRepos?.map((repo) => {
                    if (!repo) return null;
                    return (
                      <div
                        key={repo.id}
                        onClick={() => navigate(`/repos/${repo.owner.login}/${repo.name}`)}
                        className="bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex items-start justify-between gap-4 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer transition-all group"
                      >
                        <div className="flex gap-3.5 min-w-0">
                          <img
                            src={repo.owner.avatar_url}
                            alt={repo.owner.login}
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-gray-400 block leading-tight">
                              {repo.owner.login} /
                            </span>
                            <span className="font-sans font-bold text-xs text-gray-950 dark:text-white truncate block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {repo.name}
                            </span>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {repo.description || 'No description provided.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => removeRepoFromCollection(selectedCol.id, repo.full_name)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                            title="Remove from Collection"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. Create Collection Modal Popup */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen */}
          <div className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-xl relative z-55 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-sans font-bold text-base text-gray-950 dark:text-white flex items-center gap-1.5">
                <FolderCheck className="w-5 h-5 text-blue-500" /> New Collection Index
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-350">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Frameworks"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white focus:outline-none"
                  id="collections-modal-name-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-350">
                  Description
                </label>
                <textarea
                  placeholder="Index categories, project boundaries or target stacks."
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-white focus:outline-none"
                  id="collections-modal-desc-input"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm"
                id="collections-modal-submit"
              >
                Create Collection Index
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
