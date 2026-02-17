'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock tasks for calendar display
const mockTasks = [
  { id: 1, title: 'Team Meeting', date: '2026-02-15', completed: false, color: 'bg-blue-500' },
  { id: 2, title: 'Project Deadline', date: '2026-02-18', completed: false, color: 'bg-red-500' },
  { id: 3, title: 'Code Review', date: '2026-02-20', completed: false, color: 'bg-green-500' },
  { id: 4, title: 'Design Sprint', date: '2026-02-22', completed: false, color: 'bg-purple-500' },
  { id: 5, title: 'Client Call', date: '2026-02-25', completed: false, color: 'bg-cyan-500' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return mockTasks.filter(task => task.date === dateStr);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasTasksOnDate = (date: Date | null) => {
    if (!date) return false;
    return getTasksForDate(date).length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 py-8 px-4">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto mb-8 flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4">
        <Link href="/dashboard" className="text-white hover:text-blue-200 transition-colors">
          <span className="text-2xl">←</span>
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">📅</span>
          Calendar
        </h1>
        <div className="w-8"></div>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-6">

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-blue-600">←</span>
                </button>

                <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-blue-600">→</span>
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                  const hasTasks = hasTasksOnDate(date);
                  const isTodayDate = isToday(date);
                  const isSelected = selectedDate?.toDateString() === date?.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => date && setSelectedDate(date)}
                      disabled={!date}
                      className={`
                        aspect-square p-2 rounded-xl transition-all relative
                        ${!date ? 'invisible' : ''}
                        ${isTodayDate ? 'bg-blue-600 text-white font-bold shadow-lg' : ''}
                        ${isSelected && !isTodayDate ? 'bg-cyan-500 text-white font-semibold' : ''}
                        ${!isTodayDate && !isSelected ? 'hover:bg-blue-50 text-gray-700' : ''}
                        ${hasTasks && !isTodayDate && !isSelected ? 'font-semibold' : ''}
                      `}
                    >
                      {date && (
                        <>
                          <span className="text-sm sm:text-base">{date.getDate()}</span>
                          {hasTasks && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                              {getTasksForDate(date).slice(0, 3).map((task, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isTodayDate || isSelected ? 'bg-white' : task.color
                                  }`}
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
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                    <span>Has Tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedDate
                  ? `Tasks on ${selectedDate.toLocaleDateString()}`
                  : 'Select a date'}
              </h3>

              {selectedDate ? (
                <div className="space-y-3">
                  {getTasksForDate(selectedDate).length > 0 ? (
                    getTasksForDate(selectedDate).map(task => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border-l-4 ${task.color} bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer`}
                      >
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{task.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <span className="text-4xl mb-2 block">📭</span>
                      <p>No tasks scheduled</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-4xl mb-2 block">📅</span>
                  <p>Click a date to view tasks</p>
                </div>
              )}

              <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                + Add Task
              </button>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">⚡</span>
                Upcoming
              </h3>
              <div className="space-y-2">
                {mockTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.date}</p>
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
