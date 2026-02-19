/**
 * AI Chat Page
 * AI-powered todo management — sidebar conversations + chat panel
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout, isAuthenticated } from '@/lib/auth';
import ChatInterface from '@/components/chat/ChatInterface';
import ConversationList from '@/components/chat/ConversationList';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      const currentUser = getCurrentUser();
      if (currentUser) setUser(currentUser);
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Top Navbar — 72px with blue gradient */}
      <header className="h-[72px] flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4F8CFF, #3A6EDC)' }}>
        <div className="px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <span className="text-sm text-white font-bold">✓</span>
            </div>
            <span className="text-xl font-bold text-white">DO IT</span>
          </div>

          {/* Center nav */}
          <nav className="hidden sm:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/20 rounded-[10px] transition-colors"
            >
              Tasks
            </Link>
            <Link
              href="/chat"
              className="px-4 py-2 text-sm font-semibold text-white bg-white/25 border border-white/30 rounded-[10px]"
            >
              AI Assistant
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/80 hidden md:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="h-[40px] px-5 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-[12px] hover:bg-white/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content: Sidebar + Chat Panel */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 'calc(100vh - 72px)' }}>

        {/* Conversation Sidebar — 280px, hidden on small screens */}
        <aside className="hidden md:flex w-[280px] bg-white border-r border-[#E5E7EB] flex-shrink-0 flex-col overflow-hidden">
          <ConversationList
            userId={user.id}
            activeConversationId={activeConversationId}
            onConversationSelect={(id) => setActiveConversationId(id)}
          />
        </aside>

        {/* Chat Panel */}
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex-1 max-w-[800px] mx-auto w-full flex flex-col overflow-hidden">
            <ChatInterface
              userId={user.id}
              conversationId={activeConversationId}
              onConversationCreated={(id) => {
                setActiveConversationId(id);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
