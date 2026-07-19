import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('ghw_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!username.trim() || !password.trim()) {
      return { success: false, error: 'All fields are required.' };
    }

    // Retrieve registered users
    const registeredUsersStr = localStorage.getItem('ghw_registered_users') || '[]';
    const registeredUsers = JSON.parse(registeredUsersStr) as Array<{ username: string; email: string; passwordStr: string }>;

    // Check pre-registered default or newly registered users
    // Default account: admin / admin123
    let foundUser = registeredUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.passwordStr === password
    );

    if (!foundUser && username.toLowerCase() === 'admin' && password === 'password') {
      foundUser = { username: 'Admin', email: 'admin@github-workspace.io', passwordStr: 'password' };
    }

    if (foundUser) {
      const session: UserSession = {
        username: foundUser.username,
        email: foundUser.email,
        createdAt: new Date().toISOString(),
      };
      setUser(session);
      localStorage.setItem('ghw_current_user', JSON.stringify(session));
      return { success: true };
    }

    return { success: false, error: 'Invalid username or password. (Hint: use admin / password)' };
  };

  const register = async (username: string, email: string, passwordStr: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!username.trim() || !email.trim() || !passwordStr.trim()) {
      return { success: false, error: 'All fields are required.' };
    }

    if (passwordStr.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const registeredUsersStr = localStorage.getItem('ghw_registered_users') || '[]';
    const registeredUsers = JSON.parse(registeredUsersStr) as Array<{ username: string; email: string; passwordStr: string }>;

    if (
      registeredUsers.some((u) => u.username.toLowerCase() === username.toLowerCase()) ||
      username.toLowerCase() === 'admin'
    ) {
      return { success: false, error: 'Username is already taken.' };
    }

    const newUser = { username, email, passwordStr };
    registeredUsers.push(newUser);
    localStorage.setItem('ghw_registered_users', JSON.stringify(registeredUsers));

    const session: UserSession = {
      username,
      email,
      createdAt: new Date().toISOString(),
    };
    setUser(session);
    localStorage.setItem('ghw_current_user', JSON.stringify(session));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ghw_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
