/**
 * Register Page
 * Create new user account with backend API
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Register with backend (token is automatically stored)
      await register(email, password);

      // Small delay to ensure token is stored before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-full mb-4">
            <span className="text-xl text-white font-bold">✓</span>
          </div>
          <h2 className="text-2xl font-semibold text-[#111827]">
            Join DO IT
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Create your account to get started
          </p>
        </div>

        <div className="bg-white rounded-[24px] shadow-md border border-[#E5E7EB] p-10">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-[14px] bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="email-address" className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] px-4 border border-[#E5E7EB] placeholder-gray-400 text-[#111827] rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[50px] px-4 border border-[#E5E7EB] placeholder-gray-400 text-[#111827] rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all"
                placeholder="Create a password (min 8 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[50px] px-4 border border-[#E5E7EB] placeholder-gray-400 text-[#111827] rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/login" className="font-medium text-[#2563EB] hover:text-blue-700 hover:underline transition-colors">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-[48px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-[14px] text-sm transition-all duration-200 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating account...' : 'SIGN UP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
