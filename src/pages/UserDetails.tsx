import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { githubApi } from '../services/githubApi';
import { useFetch } from '../hooks';
import RepoCard from '../components/repositories/RepoCard';
import { 
  Building, 
  MapPin, 
  Link as LinkIcon, 
  Mail, 
  Calendar, 
  BookOpen, 
  Users, 
  ArrowLeft, 
  Heart,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function UserDetails() {
  const { params, navigate } = useRouter();
  const { isFavorite, addFavorite, removeFavorite, logActivity } = useApp();
  const [activeTab, setActiveTab] = useState<'repos' | 'followers' | 'following'>('repos');

  const username = params.username || '';

  // 1. Fetch User Profile
  const fetchProfile = async () => {
    if (!username) throw new Error('No username supplied.');
    return await githubApi.getUser(username);
  };
  const { data: profile, loading: profileLoading, error: profileError } = useFetch(fetchProfile, [username]);

  // 2. Fetch User Repositories
  const fetchRepos = async () => {
    if (!username) return [];
    return await githubApi.getUserRepos(username);
  };
  const { data: repos, loading: reposLoading } = useFetch(fetchRepos, [username]);

  // 3. Fetch Followers list
  const fetchFollowers = async () => {
    if (!username) return [];
    return await githubApi.getUserFollowers(username);
  };
  const { data: followers, loading: followersLoading } = useFetch(fetchFollowers, [username]);

  // 4. Fetch Following list
  const fetchFollowing = async () => {
    if (!username) return [];
    return await githubApi.getUserFollowing(username);
  };
  const { data: following, loading: followingLoading } = useFetch(fetchFollowing, [username]);

  const isFav = isFavorite(`user:${username}`);

  const handleFavoriteToggle = () => {
    if (!profile) return;
    const key = `user:${profile.login}`;
    if (isFav) {
      removeFavorite(key);
    } else {
      addFavorite({
        id: key,
        type: 'user',
        login: profile.login,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        description: profile.bio || 'GitHub Profile',
      });
    }
  };

  const handleUserJump = (login: string) => {
    logActivity('view_user', `Viewed Profile: @${login}`, login);
    navigate(`/users/${login}`);
    setActiveTab('repos');
  };

  if (profileLoading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
        <p className="text-xs text-gray-400 mt-3 font-medium">Resolving developer profile...</p>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="bg-red-50 dark:bg-red-950/15 border border-red-100 dark:border-red-900/40 p-5 rounded-2xl flex gap-3 text-red-600 dark:text-red-400">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">Failed to Load User</h4>
          <p className="text-xs mt-1 leading-relaxed">{profileError || 'User profile could not be loaded.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
          >
            <ArrowLeft className="w-4.5 h-4.5" /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Return Link */}
      <button
        onClick={() => navigate('/search')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        id="user-details-back-btn"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      {/* 1. Profile Summary Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-850 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between relative overflow-hidden">
        {/* Profile Avatar and Bio */}
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center min-w-0">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-100 dark:border-gray-800 object-cover shadow-sm flex-shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 space-y-2">
            <div>
              <h2 className="font-sans font-bold tracking-tight text-2xl sm:text-3xl text-gray-950 dark:text-white">
                {profile.name || profile.login}
              </h2>
              <span className="font-mono text-sm text-gray-400 block mt-0.5">
                @{profile.login}
              </span>
            </div>

            {profile.bio && (
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans max-w-xl">
                {profile.bio}
              </p>
            )}

            {/* Profile Metadata Strip */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1.5 text-[11px] font-medium text-gray-400">
              {profile.company && (
                <div className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.blog && (
                <a
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline truncate max-w-xs"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{profile.blog}</span>
                </a>
              )}
              {profile.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{profile.email}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(profile.created_at).toLocaleDateString([], { year: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite heart toggle button */}
        <button
          onClick={handleFavoriteToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isFav
              ? 'bg-rose-50 border-rose-150 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900/40'
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-750'
          }`}
          id="user-details-fav-btn"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          <span>{isFav ? 'Favorited' : 'Add Favorite'}</span>
        </button>
      </div>

      {/* 2. User Subpanels - Tab Headers */}
      <div className="border-b border-gray-250 dark:border-gray-800 flex items-center gap-1">
        <button
          onClick={() => setActiveTab('repos')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition-all relative ${
            activeTab === 'repos'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="user-tab-repos"
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Repositories ({profile.public_repos})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('followers')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition-all relative ${
            activeTab === 'followers'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="user-tab-followers"
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Followers ({profile.followers})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('following')}
          className={`px-4.5 py-3 text-xs font-semibold border-b-2 transition-all relative ${
            activeTab === 'following'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="user-tab-following"
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Following ({profile.following})
          </span>
        </button>
      </div>

      {/* 3. Panel Content */}
      <div className="pt-2">
        {/* REPOSITORIES TAB */}
        {activeTab === 'repos' && (
          <div>
            {reposLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
                <p className="text-xs text-gray-400 mt-2">Loading user codebases...</p>
              </div>
            ) : !repos || repos.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">
                No public repositories found for this developer.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="user-repos-grid">
                {repos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* FOLLOWERS TAB */}
        {activeTab === 'followers' && (
          <div>
            {followersLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
              </div>
            ) : !followers || followers.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">
                This user has no followers.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="user-followers-grid">
                {followers.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => handleUserJump(f.login!)}
                    className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/55 transition-all group"
                  >
                    <img
                      src={f.avatar_url}
                      alt={f.login}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-gray-800 dark:text-white block group-hover:text-blue-500 transition-colors truncate">
                        {f.login}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block">
                        View profile →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FOLLOWING TAB */}
        {activeTab === 'following' && (
          <div>
            {followingLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
              </div>
            ) : !following || following.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">
                This user is not following anyone.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="user-following-grid">
                {following.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => handleUserJump(f.login!)}
                    className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/55 transition-all group"
                  >
                    <img
                      src={f.avatar_url}
                      alt={f.login}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-gray-800 dark:text-white block group-hover:text-blue-500 transition-colors truncate">
                        {f.login}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block">
                        View profile →
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
