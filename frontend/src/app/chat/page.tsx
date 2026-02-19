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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Navbar ── */}
      <header className="h-[64px] flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 h-full flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-sm text-white font-bold">✓</span>
            </div>
            <span className="text-lg font-bold text-purple-600 tracking-tight">DO IT</span>
          </div>

          {/* Center nav */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              Tasks
            </Link>
            <Link
              href="/chat"
              className="px-4 py-2 text-sm font-semibold text-purple-600 bg-purple-50 rounded-full transition-colors"
            >
              AI Assistant
            </Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden md:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="h-9 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content: Sidebar + Chat Panel */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* Conversation Sidebar */}
        <aside className="hidden md:flex w-[260px] bg-white border-r border-gray-200 flex-shrink-0 flex-col overflow-hidden">
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
