import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { Github, User, Mail, Lock, CheckSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const { register } = useAuth();
  const { navigate } = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all requested fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const res = await register(username.trim(), email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to register account.');
    }
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
            Create account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-sans">
            Register your developer identity to start saving workspaces.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. janesmith"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-white"
                  id="register-username-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-white"
                  id="register-email-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password (min 6 characters)
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
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-white"
                  id="register-password-input"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <CheckSquare className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-white"
                  id="register-confirm-password-input"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-75 flex items-center justify-center gap-2 mt-2"
              id="register-submit-btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register Workspace <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footnote toggling to Login */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            id="register-login-link"
          >
            Sign In Instead
          </button>
        </p>
      </div>
    </div>
  );
}
