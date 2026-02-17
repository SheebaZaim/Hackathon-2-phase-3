"use client";

import { Message } from '@/lib/types';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-[#6B7280] mt-8">
          <p className="text-lg font-medium mb-2 text-[#111827]">Welcome to your AI Todo Assistant!</p>
          <p className="text-sm text-[#6B7280]">
            Try saying things like:
          </p>
          <ul className="text-sm mt-3 space-y-1.5 text-[#6B7280]">
            <li>"Add a task to buy groceries"</li>
            <li>"Show me all my tasks"</li>
            <li>"Mark task 5 as complete"</li>
            <li>"Update task 3 title to 'Call dentist'"</li>
          </ul>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[75%] px-4 py-2.5 text-sm ${
              message.role === 'user'
                ? 'bg-[#2563EB] text-white rounded-[18px] rounded-br-sm'
                : 'bg-[#F3F4F6] text-[#111827] rounded-[18px] rounded-bl-sm'
            }`}
          >
            <div className={`text-xs mb-1 ${message.role === 'user' ? 'opacity-70' : 'text-[#6B7280]'}`}>
              {message.role === 'user' ? 'You' : 'AI Assistant'}
            </div>
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
            <div className={`text-xs mt-1 ${message.role === 'user' ? 'opacity-50' : 'text-[#6B7280] opacity-60'}`}>
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[75%] bg-[#F3F4F6] text-[#111827] rounded-[18px] rounded-bl-sm px-4 py-2.5">
            <div className="text-xs text-[#6B7280] mb-1">AI Assistant</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
