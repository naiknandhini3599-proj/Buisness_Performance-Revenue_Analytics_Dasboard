import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Search,
  Users,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import { FilterState, User, DateRangePreset } from '../types';
import { USERS } from '../data/dummyData';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onOpenCustomDateModal: () => void;
  onOpenSearchModal: () => void;
  onExport: (type: 'summary' | 'leads' | 'quotations' | 'deals' | 'orders' | 'payments' | 'invoices') => void;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  onOpenCustomDateModal,
  onOpenSearchModal,
  onExport,
}) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDatePresetSelect = (preset: DateRangePreset) => {
    setIsDateOpen(false);
    if (preset === 'custom') {
      onOpenCustomDateModal();
      return;
    }

    if (preset === 'today') {
      onFilterChange({
        dateRange: {
          preset: 'today',
          startDate: '2026-10-17',
          endDate: '2026-10-17',
          label: 'Today (Oct 17, 2026)',
        },
      });
    } else if (preset === 'last7') {
      onFilterChange({
        dateRange: {
          preset: 'last7',
          startDate: '2026-10-11',
          endDate: '2026-10-17',
          label: 'Last 7 Days',
        },
      });
    } else if (preset === 'last30') {
      onFilterChange({
        dateRange: {
          preset: 'last30',
          startDate: '2026-09-18',
          endDate: '2026-10-17',
          label: 'Last 30 Days',
        },
      });
    } else if (preset === 'oct2026') {
      onFilterChange({
        dateRange: {
          preset: 'oct2026',
          startDate: '2026-10-01',
          endDate: '2026-10-31',
          label: 'Oct 1 - Oct 31, 2026',
        },
      });
    }
  };

  return (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
          Business Performance & Revenue Analytics
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Track your leads, conversions, quotations, deals, revenue and operations in real time.
        </p>
      </div>

      {/* Global Controls & Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Quick Search Button */}
        <button
          onClick={onOpenSearchModal}
          className="flex items-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-[#475569] shadow-xs hover:border-[#94A3B8] hover:bg-[#F8FAFC] transition-colors"
          title="Search all records (Leads, Quotations, Deals, Orders, Invoices, Payments)"
        >
          <Search className="h-3.5 w-3.5 text-[#64748B]" />
          <span className="hidden sm:inline">Search records...</span>
          <kbd className="hidden rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B] sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Date Range Selector */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => setIsDateOpen(!isDateOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-[#0F172A] shadow-xs hover:border-[#94A3B8] hover:bg-[#F8FAFC] transition-colors"
          >
            <Calendar className="h-3.5 w-3.5 text-[#64748B]" />
            <span>{filters.dateRange.label}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" />
          </button>

          {isDateOpen && (
            <div className="absolute right-0 z-50 mt-1.5 w-56 rounded-lg border border-[#E2E8F0] bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                Select Date Range
              </div>
              <button
                onClick={() => handleDatePresetSelect('oct2026')}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                  filters.dateRange.preset === 'oct2026' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                }`}
              >
                <span>Oct 1 - Oct 31, 2026</span>
                {filters.dateRange.preset === 'oct2026' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
              </button>
              <button
                onClick={() => handleDatePresetSelect('today')}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                  filters.dateRange.preset === 'today' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                }`}
              >
                <span>Today</span>
                {filters.dateRange.preset === 'today' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
              </button>
              <button
                onClick={() => handleDatePresetSelect('last7')}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                  filters.dateRange.preset === 'last7' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                }`}
              >
                <span>Last 7 Days</span>
                {filters.dateRange.preset === 'last7' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
              </button>
              <button
                onClick={() => handleDatePresetSelect('last30')}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                  filters.dateRange.preset === 'last30' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                }`}
              >
                <span>Last 30 Days</span>
                {filters.dateRange.preset === 'last30' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
              </button>
              <div className="my-1 border-t border-[#F1F5F9]" />
              <button
                onClick={() => handleDatePresetSelect('custom')}
                className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                  filters.dateRange.preset === 'custom' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                }`}
              >
                <span>Custom Date Range...</span>
                {filters.dateRange.preset === 'custom' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
              </button>
            </div>
          )}
        </div>

        {/* User Filter Dropdown */}
        <div className="relative">
          <select
            value={filters.userId}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'all') {
                onFilterChange({ userId: 'all' });
              } else {
                const u = USERS.find((user) => user.id === val);
                onFilterChange({
                  userId: val,
                  department: u ? u.department : filters.department,
                });
              }
            }}
            className="appearance-none rounded-lg border border-[#CBD5E1] bg-white pl-3 pr-8 py-1.5 text-xs font-medium text-[#0F172A] shadow-xs hover:border-[#94A3B8] focus:border-[#2563EB] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Users</option>
            <optgroup label="Sales Team">
              {USERS.filter((u) => u.department === 'Sales').map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Operations Team">
              {USERS.filter((u) => u.department === 'Operations').map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Finance">
              {USERS.filter((u) => u.department === 'Finance').map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </optgroup>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#64748B]" />
        </div>

        {/* Department Filter Dropdown */}
        <div className="relative">
          <select
            value={filters.department}
            onChange={(e) => {
              const newDept = e.target.value;
              const curUser = USERS.find((u) => u.id === filters.userId);
              if (curUser && newDept !== 'all' && curUser.department !== newDept) {
                onFilterChange({ department: newDept, userId: 'all' });
              } else {
                onFilterChange({ department: newDept });
              }
            }}
            className="appearance-none rounded-lg border border-[#CBD5E1] bg-white pl-3 pr-8 py-1.5 text-xs font-medium text-[#0F172A] shadow-xs hover:border-[#94A3B8] focus:border-[#2563EB] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#64748B]" />
        </div>

        {/* Export Button & Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors focus:ring-2 focus:ring-[#2563EB]/40 focus:outline-hidden"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>

          {isExportOpen && (
            <div className="absolute right-0 z-50 mt-1.5 w-60 rounded-lg border border-[#E2E8F0] bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                Export Filtered Data
              </div>
              <button
                onClick={() => {
                  setIsExportOpen(false);
                  onExport('summary');
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>Export Dashboard Summary (CSV)</span>
              </button>
              <button
                onClick={() => {
                  setIsExportOpen(false);
                  onExport('leads');
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Export Leads (CSV)</span>
              </button>
              <button
                onClick={() => {
                  setIsExportOpen(false);
                  onExport('quotations');
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#06B6D4]" />
                <span>Export Quotations (CSV)</span>
              </button>
              <button
                onClick={() => {
                  setIsExportOpen(false);
                  onExport('deals');
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#8B5CF6]" />
                <span>Export Deals (CSV)</span>
              </button>
              <button
                onClick={() => {
                  setIsExportOpen(false);
                  onExport('orders');
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>Export Orders (CSV)</span>
              </button>
              <button
                onClick={() => {
                  setIsExportOpen(false);
                  onExport('invoices');
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#059669]" />
                <span>Export Tax Invoices (CSV)</span>
              </button>
              <button
                onClick={() => {
                  setIsExportOpen(false);
                  onExport('payments');
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#1E293B] hover:bg-[#F1F5F9]"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Export Payments (CSV)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
