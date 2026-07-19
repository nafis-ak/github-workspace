import { GitHubUser, GitHubRepo, Contributor, Issue, Commit, Branch } from '../types';

// Let's hold custom API token in-memory, synchronized from AppContext or settings
let githubToken: string | null = null;

export function setGitHubToken(token: string | null) {
  githubToken = token;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  const token = githubToken || localStorage.getItem('ghw_api_token');
  if (token && token.trim()) {
    headers['Authorization'] = `token ${token.trim()}`;
  }
  return headers;
}

async function fetchWithFallback<T>(url: string, mockFallback: () => T): Promise<T> {
  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (res.status === 403 || res.status === 429) {
      console.warn(`GitHub API Rate limited (Status: ${res.status}). Using high-fidelity mock fallback data.`);
      return mockFallback();
    }
    if (!res.ok) {
      throw new Error(`GitHub API returned error: ${res.statusText}`);
    }
    return await res.json() as T;
  } catch (error) {
    console.error(`Fetch failed for URL: ${url}. Fallback to offline mock data.`, error);
    return mockFallback();
  }
}

// HIGH-FIDELITY OFFLINE MOCK DATA FOR THE DEMO USERS
export const MOCK_USERS: Record<string, GitHubUser> = {
  'nafis-ak': {
    login: 'nafis-ak',
    id: 196431252,
    avatar_url: 'https://avatars.githubusercontent.com/u/196431252?v=4',
    name: 'Md. Asif Khandoker',
    company: 'Daffodil International University',
    blog: 'https://github.com/nafis-ak',
    location: 'Dhaka, Bangladesh',
    email: 'asif.khandoker.dev@gmail.com',
    bio: 'Aspiring AI & Data Science learner. Deeply passionate about Explainable AI (XAI), automated pipeline agents, and data science research.',
    public_repos: 11,
    followers: 124,
    following: 34,
    created_at: '2024-05-10T12:00:00Z',
    html_url: 'https://github.com/nafis-ak',
  },
  'tahmid-rahman': {
    login: 'tahmid-rahman',
    id: 810438,
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=tahmid-rahman',
    name: 'Tahmid Rahman',
    company: 'Tech BD Ltd',
    blog: 'https://tahmid-rahman.dev',
    location: 'Dhaka, Bangladesh',
    email: 'tahmid@techbd.dev',
    bio: 'MERN Stack Engineer & Open Source enthusiast. Building scalable web APIs and localized solutions.',
    public_repos: 45,
    followers: 1240,
    following: 140,
    created_at: '2019-05-25T14:32:00Z',
    html_url: 'https://github.com/tahmid-rahman',
  },
  'anika-tabassum': {
    login: 'anika-tabassum',
    id: 499550,
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=anika-tabassum',
    name: 'Anika Tabassum',
    company: 'DataCraft Bangladesh',
    blog: 'https://anika-tabassum.dev',
    location: 'Sylhet, Bangladesh',
    email: 'anika@datacraft.bd',
    bio: 'Data Analyst & NLP Researcher. Exploring LLMs, sentiment mining, and agricultural crop prediction models.',
    public_repos: 28,
    followers: 850,
    following: 95,
    created_at: '2020-11-28T05:00:00Z',
    html_url: 'https://github.com/anika-tabassum',
  },
  'farhan-tanvir': {
    login: 'farhan-tanvir',
    id: 501024,
    avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=farhan-tanvir',
    name: 'Farhan Tanvir',
    company: 'Brain Station 23',
    blog: 'https://farhan.dev',
    location: 'Chittagong, Bangladesh',
    email: 'farhan@brainstation23.com',
    bio: 'DevOps Engineer & Kubernetes practitioner. Automating continuous workflows and container scaling pipelines.',
    public_repos: 34,
    followers: 560,
    following: 110,
    created_at: '2018-02-12T10:14:00Z',
    html_url: 'https://github.com/farhan-tanvir',
  },
};

export const MOCK_REPOS: Record<string, GitHubRepo[]> = {
  'nafis-ak': [
    {
      id: 1297767741,
      name: 'AI-Based-Anemia-Detection-System',
      full_name: 'nafis-ak/AI-Based-Anemia-Detection-System',
      owner: { login: 'nafis-ak', avatar_url: 'https://avatars.githubusercontent.com/u/196431252?v=4' },
      html_url: 'https://github.com/nafis-ak/AI-Based-Anemia-Detection-System',
      description: 'An Explainable AI (XAI)-Driven Clinical Decision Support System for interpretable anemia classification using raw hematological parameters. Powered by Random Forest, SHAP explainability, and a real-time interactive dashboard, achieving 98.98% accuracy for transparent and trustworthy clinical decision-making.',
      stargazers_count: 14,
      forks_count: 2,
      open_issues_count: 0,
      language: 'TypeScript',
      updated_at: '2026-07-11T21:19:58Z',
      size: 61,
      default_branch: 'main',
    },
    {
      id: 1232852969,
      name: 'asif-portfolio',
      full_name: 'nafis-ak/asif-portfolio',
      owner: { login: 'nafis-ak', avatar_url: 'https://avatars.githubusercontent.com/u/196431252?v=4' },
      html_url: 'https://github.com/nafis-ak/asif-portfolio',
      description: 'Aspiring AI & Data Science learner building foundational skills in Python, machine learning, and data analysis.',
      stargazers_count: 8,
      forks_count: 1,
      open_issues_count: 0,
      language: 'HTML',
      updated_at: '2026-07-10T12:00:00Z',
      size: 45,
      default_branch: 'main',
    },
    {
      id: 1232852970,
      name: 'DeadlineSyncAI',
      full_name: 'nafis-ak/DeadlineSyncAI',
      owner: { login: 'nafis-ak', avatar_url: 'https://avatars.githubusercontent.com/u/196431252?v=4' },
      html_url: 'https://github.com/nafis-ak/DeadlineSyncAI',
      description: 'AI-powered Telegram bot for automatic deadline detection and Google Calendar synchronization.',
      stargazers_count: 12,
      forks_count: 3,
      open_issues_count: 1,
      language: 'Python',
      updated_at: '2026-07-09T18:30:00Z',
      size: 120,
      default_branch: 'main',
    },
    {
      id: 1232852971,
      name: 'LogicScript-Compiler',
      full_name: 'nafis-ak/LogicScript-Compiler',
      owner: { login: 'nafis-ak', avatar_url: 'https://avatars.githubusercontent.com/u/196431252?v=4' },
      html_url: 'https://github.com/nafis-ak/LogicScript-Compiler',
      description: 'Developed a custom compiler using Lex and Yacc for a logic-based scripting language. The project implements lexical analysis, syntax parsing, and code execution, demonstrating core concepts of compiler design and language processing.',
      stargazers_count: 15,
      forks_count: 2,
      open_issues_count: 0,
      language: 'C',
      updated_at: '2026-06-25T11:45:00Z',
      size: 250,
      default_branch: 'main',
    },
    {
      id: 1232852972,
      name: 'symptom-based-stroke-risk-prediction',
      full_name: 'nafis-ak/symptom-based-stroke-risk-prediction',
      owner: { login: 'nafis-ak', avatar_url: 'https://avatars.githubusercontent.com/u/196431252?v=4' },
      html_url: 'https://github.com/nafis-ak/symptom-based-stroke-risk-prediction',
      description: 'AI-powered symptom-based early stroke risk prediction system using Ensemble Learning and Explainable AI (XAI).',
      stargazers_count: 22,
      forks_count: 4,
      open_issues_count: 0,
      language: 'Python',
      updated_at: '2026-07-01T15:20:00Z',
      size: 85,
      default_branch: 'main',
    },
    {
      id: 1232852973,
      name: 'Shell-System-Admin-Toolkit',
      full_name: 'nafis-ak/Shell-System-Admin-Toolkit',
      owner: { login: 'nafis-ak', avatar_url: 'https://avatars.githubusercontent.com/u/196431252?v=4' },
      html_url: 'https://github.com/nafis-ak/Shell-System-Admin-Toolkit',
      description: 'A Bash-based system administration toolkit for Linux that automates tasks like user monitoring, disk cleanup, backup management, system health analysis, and student data handling with logging and CSV export.',
      stargazers_count: 18,
      forks_count: 2,
      open_issues_count: 0,
      language: 'Shell',
      updated_at: '2026-07-11T20:38:00Z',
      size: 35,
      default_branch: 'main',
    }
  ],
  'tahmid-rahman': [
    {
      id: 201,
      name: 'bazaar-backend',
      full_name: 'tahmid-rahman/bazaar-backend',
      owner: { login: 'tahmid-rahman', avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=tahmid-rahman' },
      html_url: 'https://github.com/tahmid-rahman/bazaar-backend',
      description: 'MERN stack e-commerce backend with multi-vendor support, Redis caching, and Stripe payment gateway.',
      stargazers_count: 128,
      forks_count: 24,
      open_issues_count: 3,
      language: 'TypeScript',
      updated_at: '2026-07-15T09:12:00Z',
      size: 24500,
      default_branch: 'master',
    },
    {
      id: 202,
      name: 'bd-district-api',
      full_name: 'tahmid-rahman/bd-district-api',
      owner: { login: 'tahmid-rahman', avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=tahmid-rahman' },
      html_url: 'https://github.com/tahmid-rahman/bd-district-api',
      description: 'A lightweight, production-ready REST API returning administrative division and demographic data of Bangladesh.',
      stargazers_count: 45,
      forks_count: 12,
      open_issues_count: 0,
      language: 'JavaScript',
      updated_at: '2026-07-10T14:45:00Z',
      size: 5310,
      default_branch: 'main',
    },
  ],
  'anika-tabassum': [
    {
      id: 301,
      name: 'bangla-sentiment-analyzer',
      full_name: 'anika-tabassum/bangla-sentiment-analyzer',
      owner: { login: 'anika-tabassum', avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=anika-tabassum' },
      html_url: 'https://github.com/anika-tabassum/bangla-sentiment-analyzer',
      description: 'NLP sentiment mining system for Bangla social media feedback using fine-tuned BERT models.',
      stargazers_count: 142,
      forks_count: 31,
      open_issues_count: 4,
      language: 'Python',
      updated_at: '2026-07-17T23:50:00Z',
      size: 32000,
      default_branch: 'main',
    },
    {
      id: 302,
      name: 'agriculture-crop-recommender',
      full_name: 'anika-tabassum/agriculture-crop-recommender',
      owner: { login: 'anika-tabassum', avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=anika-tabassum' },
      html_url: 'https://github.com/anika-tabassum/agriculture-crop-recommender',
      description: 'Machine learning crop yield prediction based on regional Bangladeshi soil properties and historical weather patterns.',
      stargazers_count: 67,
      forks_count: 14,
      open_issues_count: 2,
      language: 'TypeScript',
      updated_at: '2026-07-18T13:00:00Z',
      size: 18500,
      default_branch: 'main',
    }
  ],
  'farhan-tanvir': [
    {
      id: 401,
      name: 'kubernetes-k3s-bangla-guide',
      full_name: 'farhan-tanvir/kubernetes-k3s-bangla-guide',
      owner: { login: 'farhan-tanvir', avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=farhan-tanvir' },
      html_url: 'https://github.com/farhan-tanvir/kubernetes-k3s-bangla-guide',
      description: 'A comprehensive developer pipeline guide for deploying k3s light-weight clusters in container environments with local configurations.',
      stargazers_count: 98,
      forks_count: 15,
      open_issues_count: 1,
      language: 'Shell',
      updated_at: '2026-07-12T11:20:00Z',
      size: 1200,
      default_branch: 'main',
    },
    {
      id: 402,
      name: 'automated-postgres-backup',
      full_name: 'farhan-tanvir/automated-postgres-backup',
      owner: { login: 'farhan-tanvir', avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=farhan-tanvir' },
      html_url: 'https://github.com/farhan-tanvir/automated-postgres-backup',
      description: 'DevOps automated shell daemon for scheduling periodic encrypted database backups to S3 securely.',
      stargazers_count: 54,
      forks_count: 6,
      open_issues_count: 0,
      language: 'Go',
      updated_at: '2026-07-14T09:30:00Z',
      size: 480,
      default_branch: 'main',
    },
  ]
};

const defaultContributors: Contributor[] = [
  { login: 'contributor-one', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100', contributions: 240 },
  { login: 'contributor-two', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', contributions: 180 },
  { login: 'contributor-three', avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100', contributions: 95 },
  { login: 'contributor-four', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100', contributions: 42 },
];

const defaultIssues: Issue[] = [
  { id: 101, number: 412, title: 'Fix hydration failure in server side render', state: 'open', user: { login: 'dev-star' }, created_at: '2026-07-17T08:00:00Z' },
  { id: 102, number: 411, title: 'Feature request: Add custom configuration for esbuild plugins', state: 'open', user: { login: 'architect-bob' }, created_at: '2026-07-15T12:30:00Z' },
  { id: 103, number: 410, title: 'Improve bundle analyzer visual design and responsiveness', state: 'closed', user: { login: 'designer-alice' }, created_at: '2026-07-14T10:15:00Z' },
  { id: 104, number: 409, title: 'Memory leak detected in long-running watch processes', state: 'open', user: { login: 'hacker-xyz' }, created_at: '2026-07-13T19:40:00Z' },
];

const defaultCommits: Commit[] = [
  { sha: 'f93dca23', commit: { author: { name: 'Lead Dev', date: '2026-07-18T12:30:00Z' }, message: 'feat: Release production-ready builds with sourcemaps enabled' }, author: { avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' } },
  { sha: 'e2910ba1', commit: { author: { name: 'Main Maintainer', date: '2026-07-17T15:20:00Z' }, message: 'fix: Resolve memory leak on context teardown processes' }, author: { avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' } },
  { sha: 'd483bda4', commit: { author: { name: 'Junior Dev', date: '2026-07-16T10:45:00Z' }, message: 'docs: Update installation guide and add environment variables section' }, author: { avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' } },
];

const defaultBranches: Branch[] = [
  { name: 'main', protected: true },
  { name: 'develop', protected: false },
  { name: 'feature/workspace-integration', protected: false },
  { name: 'release-v3.0.0', protected: true },
];

// GITHUB SERVICE EXPORTS
export const githubApi = {
  async getUser(username: string): Promise<GitHubUser> {
    const formattedUser = username.trim().toLowerCase();
    const mockUser = MOCK_USERS[formattedUser] || {
      login: username,
      id: Math.floor(Math.random() * 100000),
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      company: 'Indie Developer',
      blog: 'https://dev.to/' + username,
      location: 'Earth',
      email: `${username}@gmail.com`,
      bio: `Highly motivated open source contributor building cool things. Looking up to other community giants!`,
      public_repos: 15,
      followers: 124,
      following: 88,
      created_at: '2018-06-12T10:14:00Z',
      html_url: `https://github.com/${username}`,
    };

    return fetchWithFallback<GitHubUser>(
      `https://api.github.com/users/${username}`,
      () => mockUser
    );
  },

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    const formattedUser = username.trim().toLowerCase();
    const mockRepos = MOCK_REPOS[formattedUser] || [
      {
        id: Math.floor(Math.random() * 100000),
        name: 'awesome-project',
        full_name: `${username}/awesome-project`,
        owner: { login: username, avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}` },
        html_url: `https://github.com/${username}/awesome-project`,
        description: 'A completely customized developer repository containing advanced utilities, styled components, and configurations.',
        stargazers_count: 85,
        forks_count: 14,
        open_issues_count: 2,
        language: 'TypeScript',
        updated_at: '2026-07-18T10:00:00Z',
        size: 1240,
        default_branch: 'main',
      },
      {
        id: Math.floor(Math.random() * 100000),
        name: 'dotfiles',
        full_name: `${username}/dotfiles`,
        owner: { login: username, avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}` },
        html_url: `https://github.com/${username}/dotfiles`,
        description: 'My custom developer workspace layouts, zsh themes, and environment overrides.',
        stargazers_count: 18,
        forks_count: 3,
        open_issues_count: 0,
        language: 'Shell',
        updated_at: '2026-07-12T04:20:00Z',
        size: 150,
        default_branch: 'main',
      },
    ];

    return fetchWithFallback<GitHubRepo[]>(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      () => mockRepos
    );
  },

  async getUserFollowers(username: string): Promise<Partial<GitHubUser>[]> {
    const defaultFollowers = Object.values(MOCK_USERS).filter(u => u.login !== username).map(u => ({
      login: u.login,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
      id: u.id
    }));
    
    return fetchWithFallback<Partial<GitHubUser>[]>(
      `https://api.github.com/users/${username}/followers`,
      () => defaultFollowers.length > 0 ? defaultFollowers : [{
        login: 'nafis-ak',
        avatar_url: MOCK_USERS['nafis-ak'].avatar_url,
        html_url: MOCK_USERS['nafis-ak'].html_url,
        id: MOCK_USERS['nafis-ak'].id
      }]
    );
  },

  async getUserFollowing(username: string): Promise<Partial<GitHubUser>[]> {
    const defaultFollowing = Object.values(MOCK_USERS).filter(u => u.login !== username).map(u => ({
      login: u.login,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
      id: u.id
    }));

    return fetchWithFallback<Partial<GitHubUser>[]>(
      `https://api.github.com/users/${username}/following`,
      () => defaultFollowing.length > 0 ? defaultFollowing : [{
        login: 'nafis-ak',
        avatar_url: MOCK_USERS['nafis-ak'].avatar_url,
        html_url: MOCK_USERS['nafis-ak'].html_url,
        id: MOCK_USERS['nafis-ak'].id
      }]
    );
  },

  async getRepoDetails(owner: string, repo: string): Promise<GitHubRepo> {
    const searchName = `${owner}/${repo}`.toLowerCase();
    let mockRepo: GitHubRepo | undefined;
    
    for (const repoList of Object.values(MOCK_REPOS)) {
      const match = repoList.find(r => r.full_name.toLowerCase() === searchName);
      if (match) {
        mockRepo = match;
        break;
      }
    }

    if (!mockRepo) {
      mockRepo = {
        id: Math.floor(Math.random() * 100000),
        name: repo,
        full_name: `${owner}/${repo}`,
        owner: { login: owner, avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${owner}` },
        html_url: `https://github.com/${owner}/${repo}`,
        description: `This is a high-fidelity dynamic fallback placeholder for repository ${owner}/${repo}. Explore files, issues, and statistics of the codebase.`,
        stargazers_count: 420,
        forks_count: 65,
        open_issues_count: 12,
        language: 'TypeScript',
        updated_at: '2026-07-18T11:00:00Z',
        size: 4500,
        default_branch: 'main',
      };
    }

    return fetchWithFallback<GitHubRepo>(
      `https://api.github.com/repos/${owner}/${repo}`,
      () => mockRepo!
    );
  },

  async getRepoContributors(owner: string, repo: string): Promise<Contributor[]> {
    return fetchWithFallback<Contributor[]>(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      () => defaultContributors
    );
  },

  async getRepoIssues(owner: string, repo: string): Promise<Issue[]> {
    return fetchWithFallback<Issue[]>(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all`,
      () => defaultIssues
    );
  },

  async getRepoCommits(owner: string, repo: string): Promise<Commit[]> {
    return fetchWithFallback<Commit[]>(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      () => defaultCommits
    );
  },

  async getRepoBranches(owner: string, repo: string): Promise<Branch[]> {
    return fetchWithFallback<Branch[]>(
      `https://api.github.com/repos/${owner}/${repo}/branches`,
      () => defaultBranches
    );
  },

  async searchUsers(query: string): Promise<{ items: GitHubUser[] }> {
    return fetchWithFallback<{ items: GitHubUser[] }>(
      `https://api.github.com/search/users?q=${encodeURIComponent(query)}`,
      () => {
        const matches = Object.values(MOCK_USERS).filter(
          u => u.login.toLowerCase().includes(query.toLowerCase()) || 
               (u.name && u.name.toLowerCase().includes(query.toLowerCase()))
        );
        // If there are no mock hits, generate an on-the-fly search results list to keep the interface functional
        if (matches.length === 0 && query.trim().length > 0) {
          const generated: GitHubUser = {
            login: query.toLowerCase().replace(/[^a-z0-9-]/g, ''),
            id: Math.floor(Math.random() * 100000),
            avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${query}`,
            name: query.charAt(0).toUpperCase() + query.slice(1),
            company: 'Independent Open Source',
            blog: null,
            location: 'Global',
            email: null,
            bio: `Developer matching the query '${query}'. Active on public packages and libraries.`,
            public_repos: 12,
            followers: 45,
            following: 30,
            created_at: new Date().toISOString(),
            html_url: `https://github.com/${query}`,
          };
          return { items: [generated] };
        }
        return { items: matches };
      }
    );
  },

  async searchRepos(query: string, filters?: { language?: string; stars?: string; forks?: string; sort?: string; order?: 'desc' | 'asc' }): Promise<{ items: GitHubRepo[] }> {
    // Construct search URL
    let q = query;
    if (filters?.language && filters.language !== 'all') {
      q += `+language:${filters.language}`;
    }
    if (filters?.stars) {
      q += `+stars:${filters.stars}`;
    }
    if (filters?.forks) {
      q += `+forks:${filters.forks}`;
    }
    
    const sortParam = filters?.sort ? `&sort=${filters.sort}` : '';
    const orderParam = filters?.order ? `&order=${filters.order}` : '';
    const fullUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}${sortParam}${orderParam}`;

    return fetchWithFallback<{ items: GitHubRepo[] }>(
      fullUrl,
      () => {
        let allRepos: GitHubRepo[] = [];
        Object.values(MOCK_REPOS).forEach(repos => {
          allRepos = allRepos.concat(repos);
        });

        let filtered = allRepos.filter(
          r => r.name.toLowerCase().includes(query.toLowerCase()) || 
               (r.description && r.description.toLowerCase().includes(query.toLowerCase()))
        );

        if (filters?.language && filters.language !== 'all') {
          filtered = filtered.filter(r => r.language?.toLowerCase() === filters.language?.toLowerCase());
        }

        // If nothing matches and there is a query, yield mock fallback
        if (filtered.length === 0 && query.trim().length > 0) {
          filtered.push({
            id: Math.floor(Math.random() * 100000),
            name: query.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            full_name: `mock-owner/${query.toLowerCase()}`,
            owner: { login: 'mock-owner', avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=mock-owner` },
            html_url: '#',
            description: `Dynamic offline search result matching "${query}". Implemented for testing and offline coverage.`,
            stargazers_count: filters?.stars?.includes('>') ? Number(filters.stars.replace('>', '')) + 150 : 1240,
            forks_count: 230,
            open_issues_count: 14,
            language: filters?.language && filters.language !== 'all' ? filters.language : 'TypeScript',
            updated_at: new Date().toISOString(),
            size: 3200,
            default_branch: 'main',
          });
        }

        // Sort results based on selected criteria
        if (filters?.sort) {
          const isAsc = filters.order === 'asc';
          filtered.sort((a, b) => {
            if (filters.sort === 'stars') {
              return isAsc ? a.stargazers_count - b.stargazers_count : b.stargazers_count - a.stargazers_count;
            }
            if (filters.sort === 'forks') {
              return isAsc ? a.forks_count - b.forks_count : b.forks_count - a.forks_count;
            }
            if (filters.sort === 'updated') {
              const timeA = new Date(a.updated_at).getTime();
              const timeB = new Date(b.updated_at).getTime();
              return isAsc ? timeA - timeB : timeB - timeA;
            }
            return 0;
          });
        }

        return { items: filtered };
      }
    );
  }
};
