'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout, isAuthenticated } from '@/lib/auth';
import { useTasks } from '@/hooks/useTasks';
import type { TaskCreateRequest } from '@/lib/types';
import TaskListComponent from '@/components/tasks/TaskListComponent';
import TaskFormComponent from '@/components/tasks/TaskFormComponent';
import TaskFilter from '@/components/tasks/TaskFilter';

type FilterType = 'all' | 'active' | 'completed';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [formKey, setFormKey] = useState(0);
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTask } = useTasks(filter);

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

  const handleCreateTask = async (data: TaskCreateRequest) => {
    try {
      await createTask(data);
      setFormKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to create task:', error);
      setFormKey(prev => prev + 1);
    }
  };

  const handleEditTask = async (id: number, title: string) => {
    try {
      await updateTask(id, { title });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handlePrintTasks = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Tasks - DO IT</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #9333ea; border-bottom: 3px solid #9333ea; padding-bottom: 10px; }
            .task { border: 1px solid #E5E7EB; padding: 15px; margin: 10px 0; border-radius: 8px; background: #F9FAFB; }
            .task.completed { background: #f3e8ff; text-decoration: line-through; opacity: 0.7; }
            .task-title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            .task-meta { color: #6B7280; font-size: 14px; }
            .print-date { text-align: right; color: #6B7280; margin-top: 20px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>✓ DO IT - My Tasks</h1>
          <p><strong>Total Tasks:</strong> ${tasks.length}</p>
          <p><strong>Filter:</strong> ${filter === 'all' ? 'All Tasks' : filter === 'active' ? 'Active Tasks' : 'Completed Tasks'}</p>
          <hr/>
          ${tasks.map(task => `
            <div class="task ${task.completed ? 'completed' : ''}">
              <div class="task-title">${task.completed ? '✓' : '○'} ${task.title}</div>
              ${task.description ? `<div class="task-meta">Description: ${task.description}</div>` : ''}
              ${task.priority ? `<div class="task-meta">Priority: ${task.priority}</div>` : ''}
              ${task.due_date ? `<div class="task-meta">Due: ${new Date(task.due_date).toLocaleDateString()}</div>` : ''}
            </div>
          `).join('')}
          <div class="print-date"><p>Printed on: ${new Date().toLocaleString()}</p></div>
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #9333ea; color: white; border: none; border-radius: 8px; cursor: pointer;">Print</button>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
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
              className="px-4 py-2 text-sm font-semibold text-purple-600 bg-purple-50 rounded-full transition-colors"
            >
              Tasks
            </Link>
            <Link
              href="/chat"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
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

      {/* Content: Sidebar + Main */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-[260px] bg-white border-r border-gray-200 flex-shrink-0 flex-col">
          <div className="px-4 py-4 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
          </div>
          <nav className="p-3 flex flex-col gap-1 pt-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 h-10 px-4 text-sm font-semibold text-purple-600 bg-purple-50 rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              Tasks
            </Link>

            <Link
              href="/chat"
              className="flex items-center gap-3 h-10 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              AI Assistant
            </Link>

            <button
              onClick={handlePrintTasks}
              className="flex items-center gap-3 h-10 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors w-full text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
              Print List
            </button>
          </nav>

          <div className="mt-auto p-3 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-3 h-10 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">

          {/* Add Task Card */}
          <div className="max-w-[600px] mx-auto bg-white rounded-xl mb-6 border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
              <h2 className="text-lg font-semibold text-purple-700">Add New Task</h2>
              <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to create a task</p>
            </div>
            <div className="p-6">
              <TaskFormComponent key={formKey} onSubmit={handleCreateTask} />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-5 flex justify-center">
            <TaskFilter activeFilter={filter} onFilterChange={setFilter} />
          </div>

          {/* Task List Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                {filter === 'all' && 'All Tasks'}
                {filter === 'active' && 'Active Tasks'}
                {filter === 'completed' && 'Completed Tasks'}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
                </span>
              </h2>
              <button
                onClick={handlePrintTasks}
                className="h-9 px-4 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                </svg>
                Print
              </button>
            </div>
            <TaskListComponent
              tasks={tasks}
              loading={loading}
              error={error}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={handleEditTask}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
