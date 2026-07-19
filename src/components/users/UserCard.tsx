import React from 'react';
import { GitHubUser } from '../../types';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { Heart, Users, BookOpen, MapPin, Building, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface UserCardProps {
  user: GitHubUser | Partial<GitHubUser>;
  key?: string | number;
}

export default function UserCard({ user }: UserCardProps) {
  const { navigate } = useRouter();
  const { isFavorite, addFavorite, removeFavorite, logActivity } = useApp();

  const login = user.login || '';
  const avatarUrl = user.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${login}`;
  const name = user.name || login;
  const isFav = isFavorite(`user:${login}`);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(`user:${login}`);
    } else {
      addFavorite({
        id: `user:${login}`,
        type: 'user',
        login,
        name,
        avatarUrl,
        description: user.bio || 'GitHub Developer Profile',
      });
    }
  };

  const handleCardClick = () => {
    logActivity('view_user', `Viewed Profile: @${login}`, login);
    navigate(`/users/${login}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-850 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Decorative accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div>
        <div className="flex items-start justify-between gap-3">
          {/* Avatar and Main Info */}
          <div className="flex items-center gap-3.5">
            <img
              src={avatarUrl}
              alt={login}
              className="w-12 h-12 rounded-full border border-gray-150 dark:border-gray-800 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h3 className="font-sans font-semibold text-gray-950 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {name}
              </h3>
              <p className="font-mono text-xs text-gray-400 truncate">
                @{login}
              </p>
            </div>
          </div>

          {/* Quick Favorite toggle */}
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isFav
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-100 dark:border-rose-900/40'
                : 'text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
            }`}
            title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* Optional Metadata rows */}
        <div className="mt-4 space-y-1.5 border-t border-gray-50 dark:border-gray-800/60 pt-3">
          {user.company && (
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <Building className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{user.company}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{user.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats counter strip */}
      <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3.5 text-xs font-mono">
          <div className="flex items-center gap-1.5" title="Public Repositories">
            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {user.public_repos ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5" title="Followers">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {user.followers ?? 0}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Profile <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
}
