"use client";

import { useState, useEffect } from 'react';
import { Message, ChatResponse } from '@/lib/types';
import { chatAPI } from '@/lib/api-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatInterfaceProps {
  userId: string;
  conversationId?: number | null;
  onConversationCreated?: (conversationId: number) => void;
}

export default function ChatInterface({
  userId,
  conversationId: initialConversationId = null,
  onConversationCreated
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(initialConversationId);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversation history when conversation ID changes
  useEffect(() => {
    if (conversationId) {
      loadConversationHistory(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadConversationHistory = async (convId: number) => {
    try {
      setIsLoadingHistory(true);
      setError(null);

      const response = await chatAPI.getConversation(userId, convId);

      if (response.messages) {
        setMessages(response.messages);
      }
    } catch (err: any) {
      console.error('Error loading conversation history:', err);
      setError('Failed to load conversation history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message to UI immediately (optimistic update)
    const tempUserMessage: Message = {
      id: Date.now(), // Temporary ID
      user_id: userId,
      conversation_id: conversationId || 0,
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    setIsLoading(true);
    setError(null);

    try {
      // Send message to backend
      const response: ChatResponse = await chatAPI.sendMessage(userId, {
        conversation_id: conversationId,
        message: messageText
      });

      // Update conversation ID if this was the first message
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
        onConversationCreated?.(response.conversation_id);
      }

      // Add assistant response to messages
      const assistantMessage: Message = {
        id: Date.now() + 1, // Temporary ID (will be replaced when fetching history)
        user_id: userId,
        conversation_id: response.conversation_id,
        role: 'assistant',
        content: response.response,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err: any) {
      console.error('Error sending message:', err);

      // Extract meaningful error message
      let errorMsg = 'Failed to send message. Please try again.';
      if (err.message) {
        errorMsg = err.message;
      } else if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      }

      setError(errorMsg);

      // Show error in chat with helpful message
      const errorMessage: Message = {
        id: Date.now() + 1,
        user_id: userId,
        conversation_id: conversationId || 0,
        role: 'assistant',
        content: `❌ ${errorMsg}\n\n💡 Tip: If you see this error repeatedly, try:\n- Starting a new conversation\n- Checking your internet connection\n- Refreshing the page`,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);

      // If it's a conversation-related error, reset conversation state
      if (errorMsg.includes('not found') || errorMsg.includes('does not belong')) {
        setConversationId(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">AI Todo Assistant</h2>
          {conversationId && (
            <p className="text-xs text-[#6B7280]">Conversation #{conversationId}</p>
          )}
        </div>
        <button
          onClick={handleNewConversation}
          className="h-8 px-3 text-xs font-medium text-[#2563EB] border border-[#2563EB] rounded-[8px] hover:bg-blue-50 transition-colors"
        >
          New Chat
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 m-4 rounded-[10px]">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
