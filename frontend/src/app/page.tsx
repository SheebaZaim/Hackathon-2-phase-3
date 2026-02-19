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
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-xl font-bold text-purple-600 tracking-tight">DO IT</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="h-10 px-6 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex items-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="h-10 px-6 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-full hover:bg-purple-700 transition-colors flex items-center shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-purple-700 py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                ✦ AI-Powered Productivity
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-5">
                Get Things Done
                <br />
                <span className="text-blue-200">Smarter, Faster.</span>
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8">
                A clean task manager with a built-in AI assistant. Organize, prioritize, and complete your todos through natural conversation.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center h-11 px-8 bg-white text-purple-700 text-sm font-semibold rounded-full hover:bg-blue-50 transition-all shadow-md border border-white"
              >
                Get Started Free — it&apos;s free
              </Link>
              <p className="mt-4 text-sm text-blue-200">No credit card required</p>
            </div>

            {/* Right: App mockup */}
            <div className="flex-1 w-full max-w-[420px]">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-white/20">
                <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium ml-2">My Tasks</span>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { label: 'Review project proposal', done: true, priority: 'High', color: 'bg-red-50 text-red-500' },
                    { label: 'Schedule team standup', done: true, priority: 'Medium', color: 'bg-yellow-50 text-yellow-600' },
                    { label: 'Write unit tests', done: false, priority: 'High', color: 'bg-red-50 text-red-500' },
                    { label: 'Update API documentation', done: false, priority: 'Low', color: 'bg-green-50 text-green-600' },
                  ].map((task, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${task.done ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200'}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                        {task.done && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm flex-1 ${task.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${task.color}`}>{task.priority}</span>
                    </div>
                  ))}
                  <div className="mt-2 bg-purple-50 border border-purple-100 rounded-lg p-3 flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-white">
                      AI
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">You have 2 high-priority tasks today. Want me to help break them down?</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">Features</p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Everything you need to stay on track</h2>
            <p className="mt-2 text-base text-gray-600 max-w-md mx-auto">A focused set of tools to help you capture, prioritize, and complete work efficiently.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '📌', bg: 'bg-purple-50', title: 'Create Tasks', desc: 'Add tasks instantly with title, priority, and due date.' },
              { icon: '🤖', bg: 'bg-blue-50', title: 'AI Assistant', desc: 'Chat naturally to manage your tasks hands-free.' },
              { icon: '✅', bg: 'bg-green-50', title: 'Track Progress', desc: 'Mark tasks complete and see your achievements.' },
              { icon: '🖨️', bg: 'bg-orange-50', title: 'Print & Export', desc: 'Print your task list anytime, anywhere.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4 text-xl`}>{f.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[40px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gray-200" />
            {[
              { n: '1', title: 'Create an Account', desc: 'Sign up in seconds with your email. No credit card required.', active: false },
              { n: '2', title: 'Add Your Tasks', desc: 'Use the dashboard or type naturally in the AI chat.', active: true },
              { n: '3', title: 'Let AI Help', desc: 'Ask your AI assistant to prioritize, complete, or summarize tasks.', active: false },
            ].map((step) => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-5 ${step.active ? 'bg-purple-600 shadow-md' : 'bg-white border-2 border-purple-600'}`}>
                  <span className={`text-2xl font-bold ${step.active ? 'text-white' : 'text-purple-600'}`}>{step.n}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-xs text-white font-bold">✓</span>
            </div>
            <span className="text-sm font-bold text-gray-900">DO IT</span>
          </div>
          <p className="text-sm text-gray-500">Smart Todo App with AI Assistant</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Register</Link>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
