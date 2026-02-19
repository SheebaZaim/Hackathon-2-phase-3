/**
 * ConversationList Component
 * Displays list of user's conversations with switching capability
 */

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface Conversation {
  id: number;
  created_at: string;
  updated_at: string;
  message_count: number;
}

interface ConversationListProps {
  userId: string;
  activeConversationId: number | null;
  onConversationSelect: (conversationId: number | null) => void;
}

export default function ConversationList({
  userId,
  activeConversationId,
  onConversationSelect
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, [userId]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(`/api/${userId}/conversations`);

      if (response.ok) {
        const data = await response.json();
        // Filter out empty conversations (0 messages) to keep the list clean
        // Filter empty conversations and show only last 5
        const nonEmpty = (data.conversations || [])
          .filter((c: Conversation) => c.message_count > 0)
          .slice(0, 2);
        setConversations(nonEmpty);
      } else {
        throw new Error('Failed to load conversations');
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-[#6B7280]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2563EB] mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadConversations}
          className="mt-2 text-sm text-[#2563EB] hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#111827]">Conversations</h2>
          <button
            onClick={() => onConversationSelect(null)}
            className="h-8 px-3 text-xs font-medium text-white bg-[#2563EB] rounded-[8px] hover:bg-blue-700 transition-colors"
            title="Start new conversation"
          >
            + New
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-[#6B7280]">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1 opacity-70">Start a new chat to begin!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onConversationSelect(conv.id)}
                className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] rounded-[10px] mx-2 transition-colors ${
                  activeConversationId === conv.id ? 'bg-blue-50 text-[#2563EB]' : 'text-[#111827]'
                }`}
                style={{ width: 'calc(100% - 16px)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${activeConversationId === conv.id ? 'text-[#2563EB]' : 'text-[#111827]'}`}>
                      Conversation #{conv.id}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {conv.message_count} messages
                    </p>
                  </div>
                  <span className="text-xs text-[#6B7280] ml-2 flex-shrink-0">
                    {formatDate(conv.updated_at)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
