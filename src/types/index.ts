export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
  size: number;
  default_branch: string;
}

export interface RepoCollection {
  id: string;
  name: string;
  description: string;
  repoFullNames: string[]; // e.g., ["facebook/react", "vuejs/core"]
  createdAt: string;
}

export interface FavoriteItem {
  id: string; // e.g., "user:torvalds" or "repo:facebook/react"
  type: 'user' | 'repo';
  login?: string; // for user
  owner?: string; // for repo
  name?: string; // for repo name or user full name
  avatarUrl?: string;
  description?: string;
  stars?: number;
  language?: string;
  addedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'view_user' | 'view_repo' | 'search';
  title: string;
  targetId: string; // username, repo full name, or search query
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SearchFilters {
  language: string;
  stars: string; // e.g., ">500" or minimum number
  forks: string;
  sort: string;
  order: 'desc' | 'asc';
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: string;
  user: {
    login: string;
  };
  created_at: string;
}

export interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  author: {
    avatar_url: string;
  } | null;
}

export interface Branch {
  name: string;
  protected: boolean;
}
