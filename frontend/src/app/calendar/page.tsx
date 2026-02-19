'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockTasks = [
  { id: 1, title: 'Team Meeting', date: '2026-02-15', completed: false, color: 'border-blue-500 bg-blue-50 text-blue-700' },
  { id: 2, title: 'Project Deadline', date: '2026-02-18', completed: false, color: 'border-red-500 bg-red-50 text-red-700' },
  { id: 3, title: 'Code Review', date: '2026-02-20', completed: false, color: 'border-green-500 bg-green-50 text-green-700' },
  { id: 4, title: 'Design Sprint', date: '2026-02-22', completed: false, color: 'border-purple-500 bg-purple-50 text-purple-700' },
  { id: 5, title: 'Client Call', date: '2026-02-25', completed: false, color: 'border-orange-500 bg-orange-50 text-orange-700' },
];

const dotColors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return mockTasks.filter(task => task.date === dateStr);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <header className="h-[64px] bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-xs text-white font-bold">✓</span>
              </div>
              <span className="text-base font-bold text-purple-600 tracking-tight">DO IT</span>
            </div>
          </div>
          <h1 className="text-base font-semibold text-gray-900">📅 Calendar</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={goToPreviousMonth}
                  className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <h2 className="text-base font-semibold text-gray-900">{monthName}</h2>
                <button
                  onClick={goToNextMonth}
                  className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  const hasTasks = getTasksForDate(date).length > 0;
                  const isTodayDate = isToday(date);
                  const isSelected = selectedDate?.toDateString() === date?.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => date && setSelectedDate(date)}
                      disabled={!date}
                      className={`
                        aspect-square p-1 rounded-full text-sm transition-all relative flex flex-col items-center justify-center
                        ${!date ? 'invisible' : ''}
                        ${isTodayDate ? 'bg-purple-600 text-white font-bold shadow-sm' : ''}
                        ${isSelected && !isTodayDate ? 'bg-purple-100 text-purple-700 font-semibold' : ''}
                        ${!isTodayDate && !isSelected ? 'hover:bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {date && (
                        <>
                          <span>{date.getDate()}</span>
                          {hasTasks && (
                            <div className="flex gap-0.5 mt-0.5">
                              {getTasksForDate(date).slice(0, 3).map((task, i) => (
                                <div
                                  key={i}
                                  className={`w-1 h-1 rounded-full ${isTodayDate || isSelected ? 'bg-white' : dotColors[mockTasks.indexOf(task) % dotColors.length]}`}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-purple-100 rounded-full border border-purple-300"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  <span>Has Tasks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-[80px]">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {selectedDate
                  ? selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })
                  : 'Select a date'}
              </h3>

              {selectedDate ? (
                <div className="space-y-2">
                  {getTasksForDate(selectedDate).length > 0 ? (
                    getTasksForDate(selectedDate).map(task => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border-l-4 text-sm ${task.color}`}
                      >
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs opacity-70 mt-0.5">{task.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <span className="text-3xl mb-2 block">📭</span>
                      <p className="text-sm">No tasks scheduled</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <span className="text-3xl mb-2 block">📅</span>
                  <p className="text-sm">Click a date to view tasks</p>
                </div>
              )}

              <Link
                href="/dashboard"
                className="mt-4 flex items-center justify-center h-10 px-4 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full border border-purple-600 transition-colors shadow-sm"
              >
                + Add Task
              </Link>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <span>⚡</span> Upcoming
              </h3>
              <div className="space-y-2">
                {mockTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{task.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
