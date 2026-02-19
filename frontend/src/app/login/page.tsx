'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
              <span className="text-purple-600 text-lg font-bold">✓</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">DO IT</span>
          </Link>
          <p className="text-blue-200 text-sm">Sign in to access your tasks</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-400/30 p-3">
                <p className="text-sm text-red-100">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 bg-white/10 border border-white/30 placeholder-blue-300 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 bg-white/10 border border-white/30 placeholder-blue-300 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all"
                placeholder="Enter your password"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-11 bg-white text-blue-700 font-semibold rounded-full text-sm transition-all hover:bg-blue-50 shadow-sm border border-white ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-blue-200">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-white hover:text-blue-100 underline underline-offset-2 transition-colors">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
