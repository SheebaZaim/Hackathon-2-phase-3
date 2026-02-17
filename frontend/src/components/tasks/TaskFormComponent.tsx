/**
 * TaskForm Component
 * Form for creating new tasks
 */

'use client';

import React, { useState, FormEvent } from 'react';
import type { TaskCreateRequest } from '@/lib/types';

interface TaskFormProps {
  onSubmit: (data: TaskCreateRequest) => Promise<void>;
}

export default function TaskFormComponent({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title cannot be empty');
      return;
    }

    if (trimmedTitle.length > 500) {
      setError('Task title is too long (max 500 characters)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const taskData: TaskCreateRequest = {
        title: trimmedTitle,
      };

      // Only add optional fields if they have values
      if (description.trim()) {
        taskData.description = description.trim();
      }
      if (priority) {
        taskData.priority = priority;
      }
      if (dueDate) {
        // HTML5 date input returns YYYY-MM-DD, convert to MM/DD/YYYY for consistent storage
        const [year, month, day] = dueDate.split('-');
        if (year && month && day) {
          taskData.due_date = `${month}/${day}/${year}`;
        }
      }
      if (category.trim()) {
        taskData.category = category.trim();
      }

      await onSubmit(taskData);

      // Clear inputs on success
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategory('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex flex-col gap-5">

        {/* Task Title — full width */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title *"
            disabled={loading}
            className="w-full h-[50px] px-4 border border-[#E5E7EB] rounded-[14px] text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            maxLength={500}
            required
          />
        </div>

        {/* Description — full width */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            disabled={loading}
            className="w-full min-h-[80px] p-4 border border-[#E5E7EB] rounded-[14px] text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-all"
            rows={2}
            maxLength={1000}
          />
        </div>

        {/* Priority + Due Date — 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
              className="w-full h-[50px] px-4 border border-[#E5E7EB] rounded-[14px] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
              className="w-full h-[50px] px-4 border border-[#E5E7EB] rounded-[14px] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            />
          </div>
        </div>

        {/* Category + Add Task Button — 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (optional)"
              disabled={loading}
              className="w-full h-[50px] px-4 border border-[#E5E7EB] rounded-[14px] text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              maxLength={100}
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full h-[48px] bg-[#2563EB] text-white rounded-[14px] text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>

      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}
    </form>
  );
}
