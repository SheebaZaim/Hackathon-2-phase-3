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
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-xl font-extrabold text-[#111827]">DO IT</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="h-[40px] px-5 text-sm font-semibold text-[#374151] bg-white border border-[#E5E7EB] rounded-[10px] hover:bg-[#F9FAFB] transition-colors flex items-center">
                Sign In
              </Link>
              <Link href="/register" className="h-[40px] px-5 text-sm font-semibold text-white rounded-[10px] hover:opacity-90 transition-opacity flex items-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero — deep blue gradient */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #3B82F6 100%)' }} className="py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-14">

            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-7">
                ✦ AI-Powered Productivity
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                Get Things Done
                <br />
                <span className="text-blue-200">Smarter, Faster.</span>
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed max-w-[480px] mx-auto lg:mx-0 mb-10">
                A clean task manager with a built-in AI assistant. Organize, prioritize, and complete your todos through natural conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register" className="h-[52px] px-10 bg-white text-[#1D4ED8] text-base font-bold rounded-[14px] hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center">
                  Get Started Free
                </Link>
                <Link href="/login" className="h-[52px] px-10 bg-white/15 border border-white/30 text-white text-base font-semibold rounded-[14px] hover:bg-white/25 transition-all flex items-center justify-center">
                  Sign In
                </Link>
              </div>
              <p className="mt-5 text-sm text-blue-200">Free to use — no credit card required</p>
            </div>

            {/* Right: App mockup */}
            <div className="flex-1 w-full max-w-[420px]">
              <div className="bg-white rounded-[20px] shadow-2xl overflow-hidden">
                {/* Browser bar */}
                <div className="h-[44px] bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-[#6B7280] font-medium ml-2">My Tasks</span>
                </div>
                {/* Tasks */}
                <div className="p-4 space-y-2.5">
                  {[
                    { label: 'Review project proposal', done: true, priority: 'High', color: 'bg-red-50 text-red-500' },
                    { label: 'Schedule team standup', done: true, priority: 'Medium', color: 'bg-yellow-50 text-yellow-600' },
                    { label: 'Write unit tests', done: false, priority: 'High', color: 'bg-red-50 text-red-500' },
                    { label: 'Update API documentation', done: false, priority: 'Low', color: 'bg-green-50 text-green-600' },
                  ].map((task, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-[10px] border ${task.done ? 'bg-[#F9FAFB] border-[#E5E7EB] opacity-60' : 'bg-white border-[#E5E7EB]'}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#D1D5DB]'}`}>
                        {task.done && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm flex-1 ${task.done ? 'line-through text-[#9CA3AF]' : 'text-[#111827]'}`}>{task.label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${task.color}`}>{task.priority}</span>
                    </div>
                  ))}
                  {/* AI bubble */}
                  <div className="mt-1 bg-blue-50 border border-blue-100 rounded-[10px] p-3 flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
                      AI
                    </div>
                    <p className="text-xs text-[#374151] leading-relaxed">You have 2 high-priority tasks. Want me to help break them down?</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#F9FAFB] py-20 px-6 border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-extrabold text-[#111827]">Everything you need to stay on track</h2>
            <p className="mt-3 text-lg text-[#6B7280] max-w-[480px] mx-auto">A focused set of tools to help you capture, prioritize, and complete work efficiently.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📌', bg: 'bg-blue-50', title: 'Create Tasks', desc: 'Add tasks instantly with title, priority, and due date.' },
              { icon: '🤖', bg: 'bg-blue-50', title: 'AI Assistant', desc: 'Chat naturally to manage your tasks hands-free.' },
              { icon: '✅', bg: 'bg-green-50', title: 'Track Progress', desc: 'Mark tasks complete and see your achievements.' },
              { icon: '🖨️', bg: 'bg-orange-50', title: 'Print & Export', desc: 'Print your task list anytime, anywhere.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-[20px] p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 ${f.bg} rounded-[14px] flex items-center justify-center mb-4 text-2xl`}>{f.icon}</div>
                <h3 className="text-base font-bold text-[#111827] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 px-6 border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#2563EB] uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl font-extrabold text-[#111827]">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[44px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-[#E5E7EB]" />
            {[
              { n: '1', title: 'Create an Account', desc: 'Sign up in seconds. No credit card required.', active: false },
              { n: '2', title: 'Add Your Tasks', desc: 'Use the dashboard or type naturally in the AI chat.', active: true },
              { n: '3', title: 'Let AI Help', desc: 'Ask your AI assistant to prioritize and summarize tasks.', active: false },
            ].map((step) => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div
                  className={`relative z-10 w-[80px] h-[80px] rounded-full flex items-center justify-center mb-5`}
                  style={step.active ? { background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' } : { background: 'white', border: '2px solid #2563EB' }}
                >
                  <span className={`text-2xl font-extrabold ${step.active ? 'text-white' : 'text-[#2563EB]'}`}>{step.n}</span>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2">{step.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}>
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-[#1E40AF] mb-4">Ready to get things done?</h2>
          <p className="text-lg text-[#3B82F6] mb-8">Start managing your tasks smarter today. Free forever.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="h-[52px] px-10 text-white text-base font-bold rounded-[14px] hover:opacity-90 transition-all shadow-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
              Get Started Free
            </Link>
            <Link href="/login" className="h-[52px] px-10 bg-white border border-[#BFDBFE] text-[#2563EB] text-base font-semibold rounded-[14px] hover:bg-blue-50 transition-all flex items-center justify-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
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
