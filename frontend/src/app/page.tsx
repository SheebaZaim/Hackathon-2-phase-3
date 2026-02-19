/**
 * Homepage — DO IT smart todo app landing page
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

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-[#E5E7EB] shadow-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-[15px] text-white font-bold leading-none">✓</span>
              </div>
              <span className="text-[20px] font-extrabold text-[#111827] tracking-tight">DO IT</span>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="h-[44px] px-6 text-sm font-semibold bg-white border border-[#E5E7EB] text-[#111827] rounded-[14px] hover:bg-[#F3F4F6] transition-colors flex items-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="h-[44px] px-6 text-sm font-semibold bg-[#2563EB] text-white rounded-[14px] hover:bg-blue-700 transition-colors flex items-center shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #3B82F6 100%)' }}
      >
        {/* Background decoration circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-white/5" />
          <div className="absolute bottom-0 -left-16 w-[360px] h-[360px] rounded-full bg-white/5" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-8">
                <span>✦</span>
                AI-Powered Productivity
              </div>

              <h1 className="text-[48px] sm:text-[60px] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                Get Things Done
                <br />
                <span className="text-blue-200">Smarter, Faster.</span>
              </h1>

              <p className="text-[18px] text-blue-100 leading-relaxed max-w-[500px] mx-auto lg:mx-0 mb-10">
                DO IT combines a clean task manager with a built-in AI assistant. Organize, prioritize, and complete your todos through natural conversation.
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="h-[52px] px-10 bg-white text-[#1D4ED8] text-base font-bold rounded-[14px] hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="h-[52px] px-10 bg-white/15 border border-white/30 text-white text-base font-semibold rounded-[14px] hover:bg-white/25 transition-all flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>

              <p className="mt-6 text-sm text-blue-200">Free to use — no credit card required</p>
            </div>

            {/* Right: App mockup */}
            <div className="flex-1 w-full max-w-[460px]">
              <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden">

                {/* Browser-style top bar */}
                <div className="h-[44px] bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4 h-6 bg-[#E5E7EB] rounded-[6px] flex items-center px-3">
                    <span className="text-[10px] text-[#9CA3AF] font-medium">do-it.app/dashboard</span>
                  </div>
                </div>

                {/* Task list body */}
                <div className="p-4 space-y-2.5">
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">My Tasks</p>

                  {[
                    { label: 'Review project proposal', done: true, priority: 'High', pColor: 'bg-red-50 text-red-500' },
                    { label: 'Schedule team standup', done: true, priority: 'Medium', pColor: 'bg-yellow-50 text-yellow-600' },
                    { label: 'Write unit tests for auth module', done: false, priority: 'High', pColor: 'bg-red-50 text-red-500' },
                    { label: 'Update API documentation', done: false, priority: 'Low', pColor: 'bg-green-50 text-green-600' },
                    { label: 'Deploy to staging environment', done: false, priority: 'Medium', pColor: 'bg-yellow-50 text-yellow-600' },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-[10px] border ${
                        task.done
                          ? 'bg-[#F9FAFB] border-[#E5E7EB] opacity-60'
                          : 'bg-white border-[#E5E7EB]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          task.done ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#D1D5DB]'
                        }`}
                      >
                        {task.done && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm flex-1 ${task.done ? 'line-through text-[#9CA3AF]' : 'text-[#111827]'}`}>
                        {task.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${task.pColor}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}

                  {/* AI chat bubble */}
                  <div className="mt-2 bg-blue-50 border border-blue-100 rounded-[10px] p-3 flex gap-2.5 items-start">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">AI</span>
                    </div>
                    <p className="text-xs text-[#374151] leading-relaxed">
                      You have 2 high-priority tasks pending. Want me to help break them down into smaller steps?
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="bg-white border-t border-b border-[#E5E7EB] py-20">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-[36px] sm:text-[42px] font-extrabold text-[#111827] leading-tight">
              Everything you need to stay on track
            </h2>
            <p className="mt-4 text-[17px] text-[#6B7280] max-w-[500px] mx-auto leading-relaxed">
              A focused set of tools designed to help you capture, prioritize, and complete work efficiently.
            </p>
          </div>

          {/* 4-column card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Create Tasks */}
            <div className="bg-[#F9FAFB] rounded-[20px] p-6 border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-100 rounded-[14px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">Create Tasks</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">Add tasks instantly with title, priority level, and due dates. Stay organized from day one.</p>
            </div>

            {/* AI Assistant */}
            <div className="bg-[#F9FAFB] rounded-[20px] p-6 border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-[14px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">AI Assistant</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">Chat naturally to add, update, or complete tasks. Your AI co-pilot handles the details.</p>
            </div>

            {/* Track Progress */}
            <div className="bg-[#F9FAFB] rounded-[20px] p-6 border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-100 rounded-[14px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">Track Progress</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">Mark tasks complete and watch your productivity grow. See what you have accomplished.</p>
            </div>

            {/* Print & Export */}
            <div className="bg-[#F9FAFB] rounded-[20px] p-6 border border-[#E5E7EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-orange-100 rounded-[14px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">Print &amp; Export</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">Print your full task list anytime. Take your todos offline or share with your team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-[36px] sm:text-[42px] font-extrabold text-[#111827] leading-tight">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-[17px] text-[#6B7280] max-w-[420px] mx-auto">
              Three simple steps to a more productive day.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-[44px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-[#E5E7EB]" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-[88px] h-[88px] bg-white border-2 border-[#2563EB] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <span className="text-[28px] font-extrabold text-[#2563EB]">1</span>
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-3">Create an Account</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-[220px]">
                Sign up in seconds with your email. No credit card required — start organizing immediately.
              </p>
            </div>

            {/* Step 2 — active/filled */}
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-[88px] h-[88px] bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-full flex items-center justify-center mb-6 shadow-md">
                <span className="text-[28px] font-extrabold text-white">2</span>
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-3">Add Your Tasks</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-[220px]">
                Use the dashboard to add tasks manually, or type naturally in the AI chat — it handles the rest.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative z-10 w-[88px] h-[88px] bg-white border-2 border-[#2563EB] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <span className="text-[28px] font-extrabold text-[#2563EB]">3</span>
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-3">Let AI Help</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-[220px]">
                Ask your AI assistant to prioritize, complete, or summarize tasks. Work smarter, not harder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-[760px] mx-auto bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-[28px] px-10 py-14 text-center shadow-lg">
          <h2 className="text-[32px] sm:text-[38px] font-extrabold text-white leading-tight mb-4">
            Ready to get things done?
          </h2>
          <p className="text-blue-100 text-[17px] mb-8 max-w-[420px] mx-auto leading-relaxed">
            Join and start managing your tasks smarter today. Free forever — no limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="h-[52px] px-10 bg-white text-[#2563EB] text-base font-bold rounded-[14px] hover:bg-blue-50 transition-all flex items-center justify-center shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="h-[52px] px-10 bg-white/10 border border-white/30 text-white text-base font-semibold rounded-[14px] hover:bg-white/20 transition-all flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E5E7EB] bg-white py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-[#4F8CFF] to-[#3A6EDC] rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">✓</span>
            </div>
            <span className="text-sm font-bold text-[#111827]">DO IT</span>
          </div>
          <p className="text-sm text-[#6B7280]">Smart Todo App with AI Assistant</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">Register</Link>
            <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
