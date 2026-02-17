/**
 * Dashboard Page
 * Protected page for managing tasks
 */

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
  const [formKey, setFormKey] = useState(0); // Add form key to force reset
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTask } = useTasks(filter);

  useEffect(() => {
    // Small delay to ensure token is loaded from localStorage
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));

      // Check authentication
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      // Get user info
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

  const handleCreateTask = async (data: TaskCreateRequest) => {
    try {
      await createTask(data);
      // Force form reset by changing key
      setFormKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to create task:', error);
      // Still increment key to reset form even on error
      setFormKey(prev => prev + 1);
    }
  };

  const handleEditTask = async (id: number, title: string) => {
    try {
      await updateTask(id, { title });
      // Task list will update automatically via the hook
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handlePrintTasks = () => {
    // Create printable content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Tasks - DO IT</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #3B82F6;
              border-bottom: 3px solid #3B82F6;
              padding-bottom: 10px;
            }
            .task {
              border: 1px solid #E5E7EB;
              padding: 15px;
              margin: 10px 0;
              border-radius: 8px;
              background: #F9FAFB;
            }
            .task.completed {
              background: #E0F2FE;
              text-decoration: line-through;
              opacity: 0.7;
            }
            .task-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
            }
            .task-meta {
              color: #6B7280;
              font-size: 14px;
            }
            .print-date {
              text-align: right;
              color: #6B7280;
              margin-top: 20px;
            }
            @media print {
              button { display: none; }
            }
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
          <div class="print-date">
            <p>Printed on: ${new Date().toLocaleString()}</p>
          </div>
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #3B82F6; color: white; border: none; border-radius: 8px; cursor: pointer;">Print</button>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white h-[72px] border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-[#111827]">✓ DO IT</h1>
              <nav className="hidden sm:flex items-center gap-1">
                <Link
                  href="/chat"
                  className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-[10px] transition-colors"
                >
                  AI Chat
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-[#2563EB] bg-blue-50 rounded-[10px]"
                >
                  Tasks
                </Link>
                <button
                  onClick={handlePrintTasks}
                  className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-[10px] transition-colors"
                >
                  Print List
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280] hidden md:inline">{user.email}</span>
              <button
                onClick={handlePrintTasks}
                className="sm:hidden h-8 px-3 text-xs font-medium text-[#6B7280] bg-[#F3F4F6] rounded-[8px] hover:bg-gray-200 transition-colors"
                title="Print Tasks"
              >
                Print
              </button>
              <button
                onClick={handleLogout}
                className="h-8 px-3 text-xs sm:text-sm font-medium text-[#111827] bg-white border border-[#E5E7EB] rounded-[8px] hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-[1200px] mx-auto px-8">
          {/* Task Creation Form Card */}
          <div className="bg-white rounded-[20px] p-8 mb-6 border border-[#E5E7EB] shadow-sm">
            <h2 className="text-lg font-semibold text-[#111827] mb-6 text-center">Add New Task</h2>
            <TaskFormComponent key={formKey} onSubmit={handleCreateTask} />
          </div>

          {/* Task Filters */}
          <div className="mb-6 flex justify-center">
            <TaskFilter activeFilter={filter} onFilterChange={setFilter} />
          </div>

          {/* Task List Card */}
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold text-[#111827] text-center">
                {filter === 'all' && 'All Tasks'}
                {filter === 'active' && 'Active Tasks'}
                {filter === 'completed' && 'Completed Tasks'}
                <span className="ml-2 text-sm font-normal text-[#6B7280]">
                  ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
                </span>
              </h2>
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
        </div>
      </main>
    </div>
  );
}
