import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { FavoriteItem, RepoCollection, ActivityItem, AppNotification } from '../types';
import { setGitHubToken } from '../services/githubApi';

interface AppContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  collections: RepoCollection[];
  createCollection: (name: string, description: string) => void;
  deleteCollection: (id: string) => void;
  addRepoToCollection: (collectionId: string, repoFullName: string) => void;
  removeRepoFromCollection: (collectionId: string, repoFullName: string) => void;

  activityFeed: ActivityItem[];
  logActivity: (type: 'view_user' | 'view_repo' | 'search', title: string, targetId: string) => void;
  clearActivityFeed: () => void;

  notifications: AppNotification[];
  addNotification: (title: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;

  apiToken: string;
  saveApiToken: (token: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Define Reducer Actions for Favorites, Collections, Activities, and Notifications
type Action =
  | { type: 'SET_FAVORITES'; payload: FavoriteItem[] }
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_COLLECTIONS'; payload: RepoCollection[] }
  | { type: 'CREATE_COLLECTION'; payload: RepoCollection }
  | { type: 'DELETE_COLLECTION'; payload: string }
  | { type: 'ADD_TO_COLLECTION'; payload: { collectionId: string; repoFullName: string } }
  | { type: 'REMOVE_FROM_COLLECTION'; payload: { collectionId: string; repoFullName: string } }
  | { type: 'SET_ACTIVITY'; payload: ActivityItem[] }
  | { type: 'LOG_ACTIVITY'; payload: ActivityItem }
  | { type: 'CLEAR_ACTIVITY' }
  | { type: 'SET_NOTIFICATIONS'; payload: AppNotification[] }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'MARK_READ'; payload: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

interface State {
  favorites: FavoriteItem[];
  collections: RepoCollection[];
  activityFeed: ActivityItem[];
  notifications: AppNotification[];
}

const initialState: State = {
  favorites: [],
  collections: [],
  activityFeed: [],
  notifications: [],
};

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'ADD_FAVORITE':
      // Prevent duplicates
      if (state.favorites.some((fav) => fav.id === action.payload.id)) return state;
      return { ...state, favorites: [action.payload, ...state.favorites] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter((fav) => fav.id !== action.payload) };

    case 'SET_COLLECTIONS':
      return { ...state, collections: action.payload };
    case 'CREATE_COLLECTION':
      return { ...state, collections: [action.payload, ...state.collections] };
    case 'DELETE_COLLECTION':
      return { ...state, collections: state.collections.filter((col) => col.id !== action.payload) };
    case 'ADD_TO_COLLECTION':
      return {
        ...state,
        collections: state.collections.map((col) => {
          if (col.id === action.payload.collectionId) {
            if (col.repoFullNames.includes(action.payload.repoFullName)) return col;
            return { ...col, repoFullNames: [...col.repoFullNames, action.payload.repoFullName] };
          }
          return col;
        }),
      };
    case 'REMOVE_FROM_COLLECTION':
      return {
        ...state,
        collections: state.collections.map((col) => {
          if (col.id === action.payload.collectionId) {
            return {
              ...col,
              repoFullNames: col.repoFullNames.filter((name) => name !== action.payload.repoFullName),
            };
          }
          return col;
        }),
      };

    case 'SET_ACTIVITY':
      return { ...state, activityFeed: action.payload };
    case 'LOG_ACTIVITY':
      // Keep only last 30 items
      return {
        ...state,
        activityFeed: [action.payload, ...state.activityFeed.filter(act => act.targetId !== action.payload.targetId || act.type !== action.payload.type)].slice(0, 30),
      };
    case 'CLEAR_ACTIVITY':
      return { ...state, activityFeed: [] };

    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) };
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, isRead: true } : n)),
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };
    case 'DELETE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.payload) };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [apiToken, setApiToken] = useState<string>(() => {
    return localStorage.getItem('ghw_api_token') || '';
  });

  // Sync state with local API service on startup
  useEffect(() => {
    if (apiToken) {
      setGitHubToken(apiToken);
    }
  }, [apiToken]);

  // Load from local storage
  useEffect(() => {
    const favs = localStorage.getItem('ghw_favorites');
    if (favs) dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(favs) });

    const cols = localStorage.getItem('ghw_collections');
    if (cols) dispatch({ type: 'SET_COLLECTIONS', payload: JSON.parse(cols) });

    const acts = localStorage.getItem('ghw_activity');
    if (acts) dispatch({ type: 'SET_ACTIVITY', payload: JSON.parse(acts) });

    const nots = localStorage.getItem('ghw_notifications');
    if (nots) dispatch({ type: 'SET_NOTIFICATIONS', payload: JSON.parse(nots) });
  }, []);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('ghw_favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    localStorage.setItem('ghw_collections', JSON.stringify(state.collections));
  }, [state.collections]);

  useEffect(() => {
    localStorage.setItem('ghw_activity', JSON.stringify(state.activityFeed));
  }, [state.activityFeed]);

  useEffect(() => {
    localStorage.setItem('ghw_notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  // Actions
  const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const newItem: FavoriteItem = { ...item, addedAt: new Date().toISOString() };
    dispatch({ type: 'ADD_FAVORITE', payload: newItem });
    addNotification(
      'Added to Favorites',
      `"${item.name || item.login}" has been successfully added to your favorites.`
    );
  };

  const removeFavorite = (id: string) => {
    const item = state.favorites.find((fav) => fav.id === id);
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
    if (item) {
      addNotification(
        'Removed from Favorites',
        `"${item.name || item.login}" has been removed from your favorites.`
      );
    }
  };

  const isFavorite = (id: string) => {
    return state.favorites.some((fav) => fav.id === id);
  };

  const createCollection = (name: string, description: string) => {
    const newCol: RepoCollection = {
      id: `col_${Date.now()}`,
      name,
      description,
      repoFullNames: [],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'CREATE_COLLECTION', payload: newCol });
    addNotification(
      'Collection Created',
      `Your custom repo collection "${name}" has been created successfully.`
    );
  };

  const deleteCollection = (id: string) => {
    const col = state.collections.find((c) => c.id === id);
    dispatch({ type: 'DELETE_COLLECTION', payload: id });
    if (col) {
      addNotification(
        'Collection Deleted',
        `The collection "${col.name}" has been deleted.`
      );
    }
  };

  const addRepoToCollection = (collectionId: string, repoFullName: string) => {
    dispatch({ type: 'ADD_TO_COLLECTION', payload: { collectionId, repoFullName } });
    const col = state.collections.find((c) => c.id === collectionId);
    if (col) {
      addNotification(
        'Repository Added to Collection',
        `"${repoFullName}" added to collection "${col.name}".`
      );
    }
  };

  const removeRepoFromCollection = (collectionId: string, repoFullName: string) => {
    dispatch({ type: 'REMOVE_FROM_COLLECTION', payload: { collectionId, repoFullName } });
    const col = state.collections.find((c) => c.id === collectionId);
    if (col) {
      addNotification(
        'Repository Removed',
        `"${repoFullName}" removed from collection "${col.name}".`
      );
    }
  };

  const logActivity = (type: 'view_user' | 'view_repo' | 'search', title: string, targetId: string) => {
    const newAct: ActivityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      title,
      targetId,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'LOG_ACTIVITY', payload: newAct });
  };

  const clearActivityFeed = () => {
    dispatch({ type: 'CLEAR_ACTIVITY' });
    addNotification('Activity Cleared', 'Your workspace activity feed history has been cleared.');
  };

  const addNotification = (title: string, message: string) => {
    const newNot: AppNotification = {
      id: `not_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNot });
  };

  const markNotificationAsRead = (id: string) => {
    dispatch({ type: 'MARK_READ', payload: id });
  };

  const markAllNotificationsAsRead = () => {
    dispatch({ type: 'MARK_ALL_READ' });
  };

  const deleteNotification = (id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const saveApiToken = (token: string) => {
    setApiToken(token);
    setGitHubToken(token);
    if (token) {
      localStorage.setItem('ghw_api_token', token);
      addNotification('API Token Configured', 'Your custom GitHub Personal Access Token has been saved.');
    } else {
      localStorage.removeItem('ghw_api_token');
      addNotification('API Token Removed', 'Your custom GitHub Personal Access Token was removed. Using public rate limit.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        favorites: state.favorites,
        addFavorite,
        removeFavorite,
        isFavorite,

        collections: state.collections,
        createCollection,
        deleteCollection,
        addRepoToCollection,
        removeRepoFromCollection,

        activityFeed: state.activityFeed,
        logActivity,
        clearActivityFeed,

        notifications: state.notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,

        apiToken,
        saveApiToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
