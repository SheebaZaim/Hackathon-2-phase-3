/**
 * TaskFilter Component - Segmented pill control
 */

'use client';

import React from 'react';

type FilterType = 'all' | 'active' | 'completed';

interface TaskFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function TaskFilter({ activeFilter, onFilterChange }: TaskFilterProps) {
  const filters: { value: FilterType; label: string; emoji: string }[] = [
    { value: 'all',       label: 'All Tasks',   emoji: '📋' },
    { value: 'active',    label: 'Active',       emoji: '🔵' },
    { value: 'completed', label: 'Completed',    emoji: '✅' },
  ];

  return (
    <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-[16px] p-1.5 shadow-sm">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`
            flex items-center gap-2 h-[40px] px-5 text-sm font-semibold rounded-[12px] transition-all duration-200
            ${activeFilter === filter.value
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]'
            }
          `}
        >
          <span className="text-sm">{filter.emoji}</span>
          {filter.label}
        </button>
      ))}
    </div>
  );
}
