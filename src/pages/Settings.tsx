import React, { useState } from 'react';
import { useTheme, ThemeType, PaginationSize, SearchType } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Laptop, 
  Sliders, 
  Layers, 
  Search, 
  Key, 
  Check, 
  Trash2,
  Lock,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  const { 
    theme, 
    setTheme, 
    paginationSize, 
    setPaginationSize, 
    defaultSearchType, 
    setDefaultSearchType 
  } = useTheme();

  const { apiToken, saveApiToken } = useApp();

  const [patInput, setPatInput] = useState(apiToken);
  const [showPat, setShowPat] = useState(false);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiToken(patInput.trim());
  };

  const handleRemoveToken = () => {
    saveApiToken('');
    setPatInput('');
  };

  const themes: { value: ThemeType; label: string; icon: any; desc: string }[] = [
    { value: 'light', label: 'Light Mode', icon: Sun, desc: 'Soft off-whites and dark text' },
    { value: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep charcoal and eye-safe blues' },
    { value: 'system', label: 'System Pref', icon: Laptop, desc: 'Match your operating system theme' }
  ];

  const paginationSizes: PaginationSize[] = [10, 20, 50];

  const searchTypes: { value: SearchType; label: string; icon: any; desc: string }[] = [
    { value: 'users', label: 'GitHub Users', icon: Search, desc: 'Query developer directories' },
    { value: 'repositories', label: 'Repositories', icon: Layers, desc: 'Browse public codebases' }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-sans font-bold tracking-tight text-2xl text-gray-900 dark:text-white">
          Workspace Settings
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Customize theme overrides, pagination offsets, and developer credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Theme Selector Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-850 p-6 shadow-sm space-y-4">
          <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-blue-500" /> Interface Theme
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="settings-theme-selector">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`p-4.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-blue-50/50 border-blue-600 text-blue-900 dark:bg-blue-950/20 dark:border-blue-400 dark:text-white ring-2 ring-blue-600/10'
                      : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    {isActive && <Check className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <span className="font-bold text-xs block">{t.label}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 block mt-1">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Pagination Size selector */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-850 p-6 shadow-sm space-y-4">
          <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-blue-500" /> Pagination Limits
          </h3>
          <p className="text-xs text-gray-400 max-w-xl">
            Choose the amount of items to list per search or collection page.
          </p>
          <div className="flex items-center gap-3 pt-2" id="settings-pagination-selector">
            {paginationSizes.map((size) => {
              const isActive = paginationSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setPaginationSize(size)}
                  className={`w-14 h-11 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Default Search type */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-850 p-6 shadow-sm space-y-4">
          <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white flex items-center gap-2">
            <Search className="w-4.5 h-4.5 text-blue-500" /> Default Search Module
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="settings-search-selector">
            {searchTypes.map((st) => {
              const Icon = st.icon;
              const isActive = defaultSearchType === st.value;
              return (
                <button
                  key={st.value}
                  onClick={() => setDefaultSearchType(st.value)}
                  className={`p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-blue-50/50 border-blue-600 text-blue-900 dark:bg-blue-950/20 dark:border-blue-400 dark:text-white ring-2 ring-blue-600/10'
                      : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs block">{st.label}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block mt-0.5">{st.desc}</span>
                    </div>
                  </div>
                  {isActive && <Check className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. GitHub API Personal Access Token Setting */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-850 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-3">
            <h3 className="font-sans font-bold text-sm text-gray-950 dark:text-white flex items-center gap-2">
              <Key className="w-4.5 h-4.5 text-blue-500" /> GitHub Personal Access Token (PAT)
            </h3>
            {apiToken ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-950/40 dark:text-green-400 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                <Lock className="w-3.5 h-3.5" /> Activated (5,000 req/hr)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">
                Public Rate Limit (60 req/hr)
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans max-w-2xl">
            To query any custom profiles unthrottled, input a personal developer token (`ghp_...`). Tokens are stored entirely in your local browser cache and never sent to any third-party databases.
          </p>

          <form onSubmit={handleSaveToken} className="space-y-3 pt-2" id="settings-pat-form">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type={showPat ? 'text' : 'password'}
                  placeholder="Paste ghp_... token"
                  value={patInput}
                  onChange={(e) => setPatInput(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-950 text-xs font-mono dark:text-white focus:outline-none"
                  id="settings-pat-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPat(!showPat)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!patInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 rounded-xl transition-all disabled:opacity-50"
              >
                Save
              </button>

              {apiToken && (
                <button
                  type="button"
                  onClick={handleRemoveToken}
                  className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 hover:bg-red-100/50 transition-colors"
                  title="Remove Token"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
