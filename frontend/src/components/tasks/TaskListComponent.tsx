/**
 * TaskList Component - Table Format
 * Displays tasks in a clean, organized table
 */

'use client';

import React, { useState } from 'react';
import type { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, title: string) => Promise<void>;
}

export default function TaskListComponent({
  tasks,
  loading,
  error,
  onToggle,
  onDelete,
  onEdit,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPriorityBadge = (priority: string | null | undefined) => {
    const p = priority || 'medium';
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${colors[p as keyof typeof colors] || colors.medium}`}>
        {p.charAt(0).toUpperCase() + p.slice(1)}
      </span>
    );
  };

  const handleToggle = async (id: string) => {
    setActionLoading(id);
    try {
      await onToggle(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setActionLoading(id);
      try {
        await onDelete(id);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleEditStart = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const handleEditSave = async (id: string) => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      alert('Task title cannot be empty');
      return;
    }

    setActionLoading(id);
    try {
      await onEdit(id, trimmedTitle);
      setEditingId(null);
    } catch (err) {
      alert('Failed to update task');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 bg-red-50 rounded-[14px] p-4 border border-red-200">
          <p className="font-medium">Error loading tasks</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-[#6B7280] text-lg font-medium">No tasks found</p>
        <p className="text-[#6B7280] text-sm mt-2 opacity-70">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table (md and above) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-12">Done</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Description</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-24">Priority</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-28">Due Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-28">Category</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wide w-36">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E5E7EB]">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]">
                <td className="px-4 py-4 text-center">
                  <input type="checkbox" checked={task.completed} onChange={() => handleToggle(task.id)}
                    disabled={actionLoading === task.id}
                    className="w-5 h-5 text-[#2563EB] rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed" />
                </td>
                <td className="px-4 py-4">
                  {editingId === task.id ? (
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(task.id); if (e.key === 'Escape') handleEditCancel(); }}
                      disabled={actionLoading === task.id}
                      className="w-full h-[50px] px-4 border border-[#E5E7EB] rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]" autoFocus />
                  ) : (
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-[#6B7280]' : 'text-[#111827]'}`}>{task.title}</p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <p className={`text-sm max-w-xs truncate ${task.completed ? 'text-[#6B7280] opacity-60' : 'text-[#6B7280]'}`}>{task.description || '-'}</p>
                </td>
                <td className="px-4 py-4 text-center">{getPriorityBadge(task.priority)}</td>
                <td className="px-4 py-4 text-center text-sm text-[#6B7280]">{formatDate(task.due_date)}</td>
                <td className="px-4 py-4 text-center">
                  {task.category
                    ? <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">{task.category}</span>
                    : <span className="text-[#6B7280] opacity-50">-</span>}
                </td>
                <td className="px-4 py-4 text-center">
                  {editingId === task.id ? (
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleEditSave(task.id)} disabled={actionLoading === task.id}
                        className="h-8 px-3 text-xs bg-[#2563EB] text-white rounded-[8px] hover:bg-blue-700 disabled:bg-gray-300 transition-colors">Save</button>
                      <button onClick={handleEditCancel} disabled={actionLoading === task.id}
                        className="h-8 px-3 text-xs bg-white border border-[#E5E7EB] text-[#111827] rounded-[8px] hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleEditStart(task)} disabled={actionLoading === task.id}
                        className="h-8 px-3 text-xs bg-blue-50 text-[#2563EB] rounded-[8px] hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(task.id)} disabled={actionLoading === task.id}
                        className="h-8 px-3 text-xs bg-red-50 text-red-700 rounded-[8px] hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400 transition-colors">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (below md) */}
      <div className="md:hidden divide-y divide-[#E5E7EB]">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-[16px] border border-[#E5E7EB] p-4 m-3 shadow-sm bg-white">
            {/* Top row: checkbox + title */}
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={task.completed} onChange={() => handleToggle(task.id)}
                disabled={actionLoading === task.id}
                className="mt-1 w-5 h-5 text-[#2563EB] rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(task.id); if (e.key === 'Escape') handleEditCancel(); }}
                    className="w-full h-[50px] px-4 border border-[#E5E7EB] rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]" autoFocus />
                ) : (
                  <p className={`font-semibold text-sm ${task.completed ? 'line-through text-[#6B7280]' : 'text-[#111827]'}`}>{task.title}</p>
                )}
                {task.description && (
                  <p className="text-xs text-[#6B7280] mt-0.5 truncate">{task.description}</p>
                )}
              </div>
            </div>

            {/* Meta row: priority, due date, category */}
            <div className="flex flex-wrap gap-2 mt-2 ml-8">
              {getPriorityBadge(task.priority)}
              {task.due_date && (
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-[#6B7280]">{formatDate(task.due_date)}</span>
              )}
              {task.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">{task.category}</span>
              )}
            </div>

            {/* Action row */}
            <div className="flex gap-2 mt-3 ml-8">
              {editingId === task.id ? (
                <>
                  <button onClick={() => handleEditSave(task.id)} disabled={actionLoading === task.id}
                    className="h-8 px-3 text-xs bg-[#2563EB] text-white rounded-[8px] hover:bg-blue-700 disabled:bg-gray-300 transition-colors">Save</button>
                  <button onClick={handleEditCancel}
                    className="h-8 px-3 text-xs bg-white border border-[#E5E7EB] text-[#111827] rounded-[8px] hover:bg-gray-50 transition-colors">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditStart(task)} disabled={actionLoading === task.id}
                    className="h-8 px-3 text-xs bg-blue-50 text-[#2563EB] rounded-[8px] hover:bg-blue-100 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(task.id)} disabled={actionLoading === task.id}
                    className="h-8 px-3 text-xs bg-red-50 text-red-700 rounded-[8px] hover:bg-red-100 transition-colors">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
