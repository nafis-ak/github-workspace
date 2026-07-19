import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { githubApi } from '../services/githubApi';
import { useFetch, useDebounce, usePagination } from '../hooks';
import UserCard from '../components/users/UserCard';
import RepoCard from '../components/repositories/RepoCard';
import { GitHubUser, GitHubRepo } from '../types';
import { 
  Search as SearchIcon, 
  SlidersHorizontal, 
  Users, 
  BookOpen, 
  ArrowLeftRight, 
  AlertCircle,
  TrendingDown,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Search() {
  const { queryParams, navigate } = useRouter();
  const { logActivity } = useApp();
  const { paginationSize, defaultSearchType } = useTheme();

  // Extract filter states from URL query parameter or fallback
  const urlQ = queryParams.get('q') || '';
  const urlType = (queryParams.get('type') || defaultSearchType) as 'users' | 'repositories';
  const urlLang = queryParams.get('language') || 'all';
  const urlStars = queryParams.get('stars') || '';
  const urlForks = queryParams.get('forks') || '';
  const urlSort = queryParams.get('sort') || 'best-match';
  const urlOrder = (queryParams.get('order') || 'desc') as 'desc' | 'asc';

  // Local state initialized with URL values
  const [qInput, setQInput] = useState(urlQ);
  const [searchType, setSearchType] = useState<'users' | 'repositories'>(urlType);
  const [language, setLanguage] = useState(urlLang);
  const [stars, setStars] = useState(urlStars);
  const [forks, setForks] = useState(urlForks);
  const [sort, setSort] = useState(urlSort);
  const [order, setOrder] = useState<'desc' | 'asc'>(urlOrder);

  const [expandedFilters, setExpandedFilters] = useState(false);

  // Synchronize state with URL changes (e.g. if back button or side navigation clicked)
  useEffect(() => {
    setQInput(urlQ);
    setSearchType(urlType);
    setLanguage(urlLang);
    setStars(urlStars);
    setForks(urlForks);
    setSort(urlSort);
    setOrder(urlOrder);
  }, [urlQ, urlType, urlLang, urlStars, urlForks, urlSort, urlOrder]);

  // Push filter adjustments to the URL query string
  const applyFiltersToUrl = (newQ = qInput, customType = searchType) => {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set('q', newQ.trim());
    params.set('type', customType);
    if (language !== 'all') params.set('language', language);
    if (stars) params.set('stars', stars);
    if (forks) params.set('forks', forks);
    if (sort !== 'best-match') params.set('sort', sort);
    if (order !== 'desc') params.set('order', order);

    navigate(`/search?${params.toString()}`);
  };

  // Submit trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qInput.trim()) {
      logActivity('search', `Searched query: "${qInput.trim()}"`, qInput.trim());
    }
    applyFiltersToUrl();
  };

  // Data fetching trigger dependent on URL variables
  const fetchResults = async () => {
    if (!urlQ.trim()) return { users: [], repos: [] };

    if (urlType === 'users') {
      const res = await githubApi.searchUsers(urlQ);
      // Fetch details of each user to show public_repos and followers in cards
      const userDetails = await Promise.all(
        res.items.slice(0, 30).map(async (u) => {
          try {
            return await githubApi.getUser(u.login);
          } catch {
            return u as GitHubUser;
          }
        })
      );
      return { users: userDetails, repos: [] };
    } else {
      const starsFilter = urlStars ? (urlStars.startsWith('>') || urlStars.startsWith('<') ? urlStars : `>=${urlStars}`) : undefined;
      const forksFilter = urlForks ? (urlForks.startsWith('>') || urlForks.startsWith('<') ? urlForks : `>=${urlForks}`) : undefined;
      const res = await githubApi.searchRepos(urlQ, {
        language: urlLang,
        stars: starsFilter,
        forks: forksFilter,
        sort: urlSort,
        order: urlOrder,
      });
      return { users: [], repos: res.items };
    }
  };

  const { data, loading, error } = useFetch(fetchResults, [
    urlQ,
    urlType,
    urlLang,
    urlStars,
    urlForks,
    urlSort,
    urlOrder,
  ]);

  const rawResults = urlType === 'users' ? data?.users || [] : data?.repos || [];

  // Pagination hook
  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    setPage,
    startIndex,
    endIndex,
  } = usePagination(rawResults.length, paginationSize);

  const paginatedItems = rawResults.slice(startIndex, endIndex);

  const popularLanguages = [
    { label: 'All Languages', value: 'all' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' },
    { label: 'C++', value: 'c++' },
    { label: 'C', value: 'c' },
    { label: 'HTML/CSS', value: 'html' },
    { label: 'Ruby', value: 'ruby' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-bold tracking-tight text-2xl text-gray-900 dark:text-white">
            Advanced Code Search
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Build robust filters to parse developer directories and popular codebases.
          </p>
        </div>

        {/* Search Type Selector Tab */}
        <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => {
              setSearchType('users');
              applyFiltersToUrl(qInput, 'users');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              searchType === 'users'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Users
          </button>
          <button
            onClick={() => {
              setSearchType('repositories');
              applyFiltersToUrl(qInput, 'repositories');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              searchType === 'repositories'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Repositories
          </button>
        </div>
      </div>

      {/* Advanced Filters Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <SearchIcon className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder={searchType === 'users' ? "Search username or bio... (e.g. nafis-ak)" : "Search repository name... (e.g. react)"}
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-white"
              id="search-input-field"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setExpandedFilters(!expandedFilters)}
            className={`p-2.5 rounded-xl border transition-all ${
              expandedFilters || language !== 'all' || stars || forks
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-500 border-blue-100 dark:border-blue-900/40'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            title="Expand Advanced Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm shadow-sm flex-shrink-0"
            id="search-submit-btn"
          >
            Submit
          </button>
        </form>

        {/* Expanded filter panel with animation */}
        {expandedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-gray-100 dark:border-gray-800 pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Language filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none"
              >
                {popularLanguages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stars Minimum */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Stars Min</label>
              <input
                type="text"
                placeholder="e.g. 1000 or >500"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Forks Minimum */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Forks Min</label>
              <input
                type="text"
                placeholder="e.g. 250 or >100"
                value={forks}
                onChange={(e) => setForks(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Sorting criteria */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Sort By</label>
              <div className="flex gap-1.5">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="best-match">Best Match</option>
                  <option value="stars">Stars</option>
                  <option value="forks">Forks</option>
                  <option value="updated">Recently Updated</option>
                </select>
                <button
                  type="button"
                  onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
                  className="px-2.5 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 rounded-xl text-xs transition-colors"
                  title="Toggle Asc/Desc Order"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search results rendering block */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          <p className="text-xs text-gray-400 mt-3 font-medium">Parsing GitHub workspace directory...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/15 border border-red-100 dark:border-red-900/40 p-5 rounded-2xl flex gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Failed to Fetch Results</h4>
            <p className="text-xs mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      ) : !urlQ.trim() ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 shadow-sm space-y-2">
          <SlidersHorizontal className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto" />
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Start a new query</p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Input a keyword above and filter by your preferred coding standard to explore.
          </p>
        </div>
      ) : rawResults.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 shadow-sm space-y-2">
          <AlertCircle className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto" />
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">No results found</p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            We couldn't locate any items matching your query. Adjust filters and retry.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>
              Showing {startIndex + 1}-{endIndex} of {rawResults.length} matches
            </span>
            <span>Sorted by: {sort}</span>
          </div>

          {/* Cards list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="search-results-grid">
            {urlType === 'users'
              ? paginatedItems.map((u) => <UserCard key={u.login} user={u} />)
              : paginatedItems.map((r) => <RepoCard key={(r as GitHubRepo).id} repo={r as GitHubRepo} />)}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-5">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-750 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                id="search-prev-page-btn"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all ${
                      currentPage === p
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-750 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                id="search-next-page-btn"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
