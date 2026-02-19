/**
 * Homepage - Modern landing page with design system
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
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#E5E7EB] shadow-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-full flex items-center justify-center">
                <span className="text-base text-white font-bold">✓</span>
              </div>
              <span className="text-xl font-bold text-[#111827]">DO IT</span>
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="h-[48px] px-5 text-sm font-semibold bg-white border border-[#E5E7EB] text-[#111827] rounded-[14px] hover:bg-[#F3F4F6] transition-colors flex items-center gap-2"
              >
                <span className="text-base">🖨️</span>
                Print List
              </Link>
              <Link
                href="/chat"
                className="h-[48px] px-5 text-sm font-semibold bg-white border border-[#E5E7EB] text-[#111827] rounded-[14px] hover:bg-[#F3F4F6] transition-colors flex items-center gap-2"
              >
                <span className="text-base">🤖</span>
                AI Assistant
              </Link>
              <Link
                href="/register"
                className="h-[48px] px-5 text-sm font-semibold bg-[#2563EB] text-white rounded-[14px] hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-20 sm:py-28 animate-fade-in">
        <div className="w-full max-w-[1200px] mx-auto text-center">

          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-3xl shadow-lg">
              <span className="text-4xl">📝</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-[48px] font-bold text-[#111827] mb-5 leading-tight">
            Your Smart Todo App
          </h1>

          {/* Subtext */}
          <p className="text-[18px] text-[#6B7280] mb-12 max-w-[600px] mx-auto leading-relaxed">
            Organize tasks, set priorities, and boost productivity — with a built-in AI Assistant that helps you manage your todo list through natural conversation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
            <Link
              href="/register"
              className="w-full sm:w-auto h-[52px] px-10 bg-[#2563EB] text-white text-base font-semibold rounded-[16px] hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>🚀</span> Get Started Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto h-[52px] px-10 bg-white border border-[#E5E7EB] text-[#111827] text-base font-semibold rounded-[16px] hover:bg-[#F3F4F6] transition-all flex items-center justify-center gap-2"
            >
              <span>🔐</span> Sign In
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-50 rounded-[14px] flex items-center justify-center mb-4">
                <span className="text-2xl">📌</span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">Create Tasks</h3>
              <p className="text-sm text-[#6B7280]">Add tasks quickly with title, priority and due date</p>
            </div>

            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">AI Assistant</h3>
              <p className="text-sm text-[#6B7280]">Chat naturally to manage your tasks hands-free</p>
            </div>

            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-green-50 rounded-[14px] flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-2">Track Progress</h3>
              <p className="text-sm text-[#6B7280]">Mark tasks complete and see your achievements</p>
            </div>

            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
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
      <footer className="text-center py-8 text-[#6B7280] text-sm border-t border-[#E5E7EB]">
        <p>Made with love for productivity enthusiasts</p>
      </footer>
    </div>
  );
}
