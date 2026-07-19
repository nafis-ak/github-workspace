import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { Github, KeyRound, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { login } = useAuth();
  const { navigate } = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all credentials fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(username.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const loadDemoUser = () => {
    setUsername('admin');
    setPassword('password');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 shadow-sm text-gray-900 dark:text-white mb-4">
            <Github className="w-8 h-8" />
          </div>
          <h1 className="font-sans font-bold tracking-tight text-3xl text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-sans">
            Sign in to access your secure GitHub Developer Workspace.
          </p>
        </div>

        {/* Card Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-850 p-8 shadow-md"
        >
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Workspace Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-white"
                  id="login-username-input"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-white"
                  id="login-password-input"
                />
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-75 flex items-center justify-center gap-2"
              id="login-submit-btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo auto fill helper */}
          <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-5 text-center">
            <button
              onClick={loadDemoUser}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 mx-auto"
              id="login-demo-btn"
            >
              <KeyRound className="w-3.5 h-3.5" /> Fast Demo Access (admin / password)
            </button>
          </div>
        </motion.div>

        {/* Footnote toggling to Register */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            id="login-register-link"
          >
            Create Workspace Account
          </button>
        </p>
      </div>
    </div>
  );
}
