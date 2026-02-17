/**
 * Homepage - Attractive landing page with navbar
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/chat');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-full flex items-center justify-center">
                <span className="text-lg text-white font-bold">✓</span>
              </div>
              <span className="text-xl font-bold text-[#111827]">DO IT</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="h-12 px-5 text-sm font-semibold bg-white border border-[#E5E7EB] text-[#111827] rounded-[14px] hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="h-12 px-5 text-sm font-semibold bg-[#2563EB] text-white rounded-[14px] hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-24 animate-fade-in">
        <div className="w-full max-w-[1200px] mx-auto text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-3xl shadow-lg">
              <span className="text-5xl sm:text-6xl">📝</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-[#111827] mb-4 sm:mb-6">
            Your Smart Todo App
          </h1>
          <p className="text-lg text-[#6B7280] mb-10 sm:mb-12 max-w-xl mx-auto">
            Organize tasks, set priorities, and boost productivity with AI assistance
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 sm:mb-20">
            <Link
              href="/register"
              className="w-full sm:w-auto h-[52px] px-10 bg-[#2563EB] text-white text-base font-semibold rounded-[16px] hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>🚀</span> Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto h-[52px] px-10 bg-white border border-[#E5E7EB] text-[#111827] text-base font-semibold rounded-[16px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <span>📋</span> Check Todo List
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
            {/* Card 1 - Create Tasks */}
            <div className="group bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-50 rounded-[14px] flex items-center justify-center mb-4">
                <span className="text-2xl">📌</span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">Create Tasks</h3>
              <p className="text-sm text-[#6B7280]">Add tasks quickly with title, priority and due date</p>
            </div>

            {/* Card 2 - AI Assistant */}
            <div className="group bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">AI Assistant</h3>
              <p className="text-sm text-[#6B7280]">Chat naturally to manage your tasks</p>
            </div>

            {/* Card 3 - Track Progress */}
            <div className="group bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-green-50 rounded-[14px] flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">Track Progress</h3>
              <p className="text-sm text-[#6B7280]">Mark tasks complete and see your achievements</p>
            </div>

            {/* Card 4 - Print & Export */}
            <div className="group bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-50 rounded-[14px] flex items-center justify-center mb-4">
                <span className="text-2xl">🖨️</span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">Print &amp; Export</h3>
              <p className="text-sm text-[#6B7280]">Print your task list anytime, anywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-[#6B7280] text-sm border-t border-[#E5E7EB]">
        <p>Made with love for productivity enthusiasts</p>
      </div>
    </div>
  );
}
