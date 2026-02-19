/**
 * TaskItem Component - Design system compliant
 */

'use client';

import React, { useState } from 'react';
import type { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, title: string) => Promise<void>;
}

export default function TaskItemComponent({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try { await onToggle(task.id); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try { await onDelete(task.id); } finally { setLoading(false); }
    }
  };

  const handleEdit = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) { alert('Task title cannot be empty'); return; }
    if (trimmedTitle === task.title) { setIsEditing(false); return; }
    setLoading(true);
    try {
      await onEdit(task.id, trimmedTitle);
      setIsEditing(false);
    } catch { alert('Failed to update task'); }
    finally { setLoading(false); }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const formatDueDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPriorityStyle = (priority: string | null | undefined) => {
    switch (priority) {
      case 'high':   return 'bg-red-50 text-red-700 border border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'low':    return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:       return 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]';
    }
  };

  return (
    <div className={`flex items-start gap-4 p-5 bg-white border border-[#E5E7EB] rounded-[20px] shadow-sm hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-70' : ''}`}>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        disabled={loading}
        className="mt-1 w-5 h-5 text-[#2563EB] rounded-[6px] border-2 border-[#E5E7EB] focus:ring-2 focus:ring-blue-500/20 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit();
              if (e.key === 'Escape') handleCancelEdit();
            }}
            disabled={loading}
            className="w-full h-[50px] px-4 border border-[#E5E7EB] rounded-[14px] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all"
            autoFocus
          />
        ) : (
          <>
            <p className={`text-sm font-semibold ${task.completed ? 'line-through text-[#6B7280]' : 'text-[#111827]'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className={`text-sm mt-1 leading-relaxed ${task.completed ? 'text-[#6B7280] opacity-60' : 'text-[#6B7280]'}`}>
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {task.priority && (
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityStyle(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
              )}
              {task.due_date && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                  📅 {formatDueDate(task.due_date)}
                </span>
              )}
              {task.category && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                  {task.category}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleEdit}
              disabled={loading}
              className="h-[40px] px-5 text-xs font-semibold bg-[#2563EB] text-white rounded-[10px] border border-[#2563EB] hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={loading}
              className="h-[40px] px-5 text-xs font-semibold bg-white text-[#111827] rounded-[10px] border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="h-[40px] px-5 text-xs font-semibold bg-blue-50 text-[#2563EB] rounded-[10px] border border-blue-200 hover:bg-blue-100 disabled:opacity-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="h-[40px] px-5 text-xs font-semibold bg-red-50 text-red-700 rounded-[10px] border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
