import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { githubApi } from '../services/githubApi';
import { useFetch } from '../hooks';
import { 
  ArrowLeft, 
  Star, 
  GitFork, 
  AlertCircle, 
  ExternalLink, 
  GitBranch, 
  Users, 
  GitCommit, 
  BookOpen, 
  FolderSync, 
  ShieldCheck, 
  Calendar,
  Loader2,
  Lock,
  Globe,
  FileCode
} from 'lucide-react';
import { motion } from 'motion/react';

type TabType = 'overview' | 'contributors' | 'issues' | 'branches' | 'commits';

export default function RepositoryDetails() {
  const { params, navigate } = useRouter();
  const { isFavorite, addFavorite, removeFavorite, collections, addRepoToCollection, removeRepoFromCollection } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const owner = params.owner || '';
  const repo = params.repo || '';
  const fullName = `${owner}/${repo}`;

  // 1. Fetch Repository profile
  const fetchRepo = async () => {
    if (!owner || !repo) throw new Error('Repository parameters not specified.');
    return await githubApi.getRepoDetails(owner, repo);
  };
  const { data: repoData, loading: repoLoading, error: repoError } = useFetch(fetchRepo, [owner, repo]);

  // 2. Fetch Contributors
  const fetchContribs = async () => {
    if (!owner || !repo) return [];
    return await githubApi.getRepoContributors(owner, repo);
  };
  const { data: contributors, loading: contribsLoading } = useFetch(fetchContribs, [owner, repo]);

  // 3. Fetch Issues
  const fetchIssues = async () => {
    if (!owner || !repo) return [];
    return await githubApi.getRepoIssues(owner, repo);
  };
  const { data: issues, loading: issuesLoading } = useFetch(fetchIssues, [owner, repo]);

  // 4. Fetch Branches
  const fetchBranches = async () => {
    if (!owner || !repo) return [];
    return await githubApi.getRepoBranches(owner, repo);
  };
  const { data: branches, loading: branchesLoading } = useFetch(fetchBranches, [owner, repo]);

  // 5. Fetch Commits
  const fetchCommits = async () => {
    if (!owner || !repo) return [];
    return await githubApi.getRepoCommits(owner, repo);
  };
  const { data: commits, loading: commitsLoading } = useFetch(fetchCommits, [owner, repo]);

  const isFav = isFavorite(`repo:${fullName}`);

  const handleFavoriteToggle = () => {
    if (!repoData) return;
    const key = `repo:${fullName}`;
    if (isFav) {
      removeFavorite(key);
    } else {
      addFavorite({
        id: key,
        type: 'repo',
        owner: repoData.owner.login,
        name: repoData.name,
        avatarUrl: repoData.owner.avatar_url,
        description: repoData.description || 'GitHub Code Repository',
        stars: repoData.stargazers_count,
        language: repoData.language || 'Code',
      });
    }
  };

  // Find collections this repo belongs to
  const itemInCollections = collections.filter((c) => c.repoFullNames.includes(fullName));

  const handleCollectionToggle = (colId: string, belongs: boolean) => {
    if (belongs) {
      removeRepoFromCollection(colId, fullName);
    } else {
      addRepoToCollection(colId, fullName);
    }
  };

  if (repoLoading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
        <p className="text-xs text-gray-400 mt-3 font-medium">Downloading repository statistics...</p>
      </div>
    );
  }

  if (repoError || !repoData) {
    return (
      <div className="bg-red-50 dark:bg-red-950/15 border border-red-100 dark:border-red-900/40 p-5 rounded-2xl flex gap-3 text-red-600 dark:text-red-400">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">Failed to Load Repository</h4>
          <p className="text-xs mt-1 leading-relaxed">{repoError || 'Codebase properties could not be loaded.'}</p>
          <button
            onClick={() => navigate('/search')}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
          >
            <ArrowLeft className="w-4.5 h-4.5" /> Return to Advanced Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Return Navigation */}
      <button
        onClick={() => navigate('/search')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        id="repo-details-back-btn"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      {/* 1. Header Information Block */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-850 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={repoData.owner.avatar_url}
              alt={repoData.owner.login}
              className="w-12 h-12 rounded-full border border-gray-150 dark:border-gray-800 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <span className="text-xs font-mono text-gray-400 block leading-tight">
                {repoData.owner.login} /
              </span>
              <h2 className="font-sans font-bold tracking-tight text-xl sm:text-2xl text-gray-950 dark:text-white truncate mt-0.5 leading-tight">
                {repoData.name}
              </h2>
            </div>
          </div>

          {/* Core Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleFavoriteToggle}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isFav
                  ? 'bg-rose-50 border-rose-150 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900/40'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 dark:bg-gray-850 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-750'
              }`}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              <span>{isFav ? 'Favorited' : 'Add Favorite'}</span>
            </button>

            <a
              href={repoData.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border bg-white border-gray-200 hover:bg-gray-50 text-gray-600 dark:bg-gray-850 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-750 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>GitHub API Link</span>
            </a>
          </div>
        </div>

        {repoData.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 font-sans leading-relaxed max-w-3xl">
            {repoData.description}
          </p>
        )}

        {/* Counts strip */}
        <div className="flex flex-wrap gap-5 text-xs font-mono text-gray-400 dark:text-gray-500 border-t border-gray-50 dark:border-gray-800/85 pt-4">
          <div className="flex items-center gap-1.5" title="Stars count">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {repoData.stargazers_count.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Forks count">
            <GitFork className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {repoData.forks_count.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Open issues count">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {repoData.open_issues_count} Open Issues
            </span>
          </div>

          {repoData.language && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
              <span className="font-sans font-medium text-gray-700 dark:text-gray-300">
                {repoData.language}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <FileCode className="w-4 h-4" />
            <span>Size: {Math.round(repoData.size / 1024)} MB</span>
          </div>

          <div className="flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" />
            <span>Default: {repoData.default_branch}</span>
          </div>
        </div>
      </div>

      {/* 2. Collections Integration Strip */}
      {collections.length > 0 && (
        <div className="bg-indigo-500/5 dark:bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase font-mono">
            <FolderSync className="w-4 h-4" /> Manage Personal Collections
          </div>
          <div className="flex flex-wrap gap-2">
            {collections.map((col) => {
              const belongs = col.repoFullNames.includes(fullName);
              return (
                <button
                  key={col.id}
                  onClick={() => handleCollectionToggle(col.id, belongs)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    belongs
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-750'
                  }`}
                >
                  {belongs ? `✓ ${col.name}` : `+ Add to ${col.name}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Panel navigation tab headers */}
      <div className="border-b border-gray-250 dark:border-gray-800 flex items-center overflow-x-auto gap-1">
        {[
          { key: 'overview', label: 'Overview', icon: BookOpen },
          { key: 'contributors', label: 'Contributors', icon: Users },
          { key: 'issues', label: 'Issues', icon: AlertCircle },
          { key: 'branches', label: 'Branches', icon: GitBranch },
          { key: 'commits', label: 'Commits', icon: GitCommit },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 flex-shrink-0 relative ${
                active
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              id={`repo-details-tab-${tab.key}`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Panel display contents */}
      <div className="pt-2">
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-500" /> Repository Overview & Security
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
              This repository is protected and authenticated under the standard GitHub Workspace protocol. Direct commits to the <span className="font-mono bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded text-red-500 font-semibold">{repoData.default_branch}</span> branch are strictly monitored via custom workflows.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-50 dark:border-gray-800/60 pt-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Workspace Status</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 block mt-1">Ready for inspection</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Last Synchronized</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 block mt-1">Today, {new Date(repoData.updated_at).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* CONTRIBUTORS PANEL */}
        {activeTab === 'contributors' && (
          <div>
            {contribsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
              </div>
            ) : !contributors || contributors.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">No contributors found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="repo-contribs-grid">
                {contributors.map((c) => (
                  <div
                    key={c.login}
                    onClick={() => navigate(`/users/${c.login}`)}
                    className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <img
                      src={c.avatar_url}
                      alt={c.login}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-gray-800 dark:text-white block truncate">
                        {c.login}
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-medium block mt-0.5">
                        {c.contributions} commits
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ISSUES PANEL */}
        {activeTab === 'issues' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 overflow-hidden shadow-sm">
            {issuesLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
              </div>
            ) : !issues || issues.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">No issues parsed in workspace.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800" id="repo-issues-list">
                {issues.map((issue) => (
                  <div key={issue.id} className="p-4 flex items-start justify-between gap-4">
                    <div className="flex gap-3 min-w-0">
                      <div className="mt-0.5">
                        <AlertCircle className={`w-4.5 h-4.5 ${issue.state === 'open' ? 'text-green-500' : 'text-purple-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 dark:text-white truncate">
                          {issue.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          #{issue.number} opened on {new Date(issue.created_at).toLocaleDateString()} by @{issue.user.login}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                      issue.state === 'open' 
                        ? 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400' 
                        : 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
                    }`}>
                      {issue.state}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BRANCHES PANEL */}
        {activeTab === 'branches' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 overflow-hidden shadow-sm">
            {branchesLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
              </div>
            ) : !branches || branches.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">No branches found.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800" id="repo-branches-list">
                {branches.map((b) => (
                  <div key={b.name} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-mono font-bold text-gray-800 dark:text-white">
                        {b.name}
                      </span>
                    </div>
                    {b.protected && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                        <Lock className="w-3 h-3" /> Protected Branch
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMMITS PANEL */}
        {activeTab === 'commits' && (
          <div className="space-y-4">
            {commitsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
              </div>
            ) : !commits || commits.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">No commits recorded.</p>
            ) : (
              <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-gray-800" id="repo-commits-list">
                {commits.map((c) => (
                  <div key={c.sha} className="relative flex gap-4">
                    {/* Circle timeline dot */}
                    <div className="absolute -left-[20px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-950 z-10" />

                    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 dark:text-white leading-relaxed">
                          {c.commit.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                          {c.author && (
                            <img
                              src={c.author.avatar_url}
                              alt={c.commit.author.name}
                              className="w-4 h-4 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span className="font-semibold text-gray-600 dark:text-gray-300">
                            {c.commit.author.name}
                          </span>
                          <span>committed on {new Date(c.commit.author.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-xl text-gray-500 font-bold self-start sm:self-auto flex-shrink-0 border border-gray-100 dark:border-gray-700">
                        {c.sha.slice(0, 7)}
                      </span>
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
