/**
 * Phase III: AI Chat Page
 * AI-powered todo management through natural language conversation
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
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));

      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
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
      {/* Header */}
      <header className="bg-white h-[72px] border-b border-[#E5E7EB] shadow-sm flex-shrink-0">
        <div className="max-w-[1200px] mx-auto px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-[#111827]">AI Todo Assistant</h1>
              <nav className="flex items-center gap-1">
                <Link
                  href="/chat"
                  className="px-4 py-2 text-sm font-medium text-[#2563EB] bg-blue-50 rounded-[10px]"
                >
                  AI Chat
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-[10px] transition-colors"
                >
                  Task List
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280] hidden md:inline">{user.email}</span>
              <button
                onClick={handleLogout}
                className="h-8 px-3 text-sm font-medium text-[#111827] bg-white border border-[#E5E7EB] rounded-[8px] hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Sidebar - Conversation List */}
          {showSidebar && (
            <div className="w-72 bg-white border-r border-[#E5E7EB] flex-shrink-0">
              <ConversationList
                userId={user.id}
                activeConversationId={activeConversationId}
                onConversationSelect={(id) => setActiveConversationId(id)}
              />
            </div>
          )}

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-3 border-b border-[#E5E7EB] bg-white flex justify-between items-center">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="h-8 px-3 text-xs font-medium text-[#6B7280] bg-[#F3F4F6] hover:bg-gray-200 rounded-[8px] transition-colors"
              >
                {showSidebar ? 'Hide Conversations' : 'Show Conversations'}
              </button>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <div className="h-full">
                <ChatInterface
                  userId={user.id}
                  conversationId={activeConversationId}
                  onConversationCreated={(id) => {
                    setActiveConversationId(id);
                    console.log('Conversation created:', id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with instructions */}
      <footer className="bg-white border-t border-[#E5E7EB] py-4 flex-shrink-0">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="text-xs text-center text-[#6B7280]">
            Tip: You can manage tasks naturally - try "add task buy milk", "show my tasks", "complete task 5", or "update task 2 to call dentist"
          </p>
        </div>
      </footer>
    </div>
  );
}
