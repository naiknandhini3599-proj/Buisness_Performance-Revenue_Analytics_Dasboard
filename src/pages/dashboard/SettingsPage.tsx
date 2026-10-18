import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Target,
  UserCheck,
  CheckCircle,
  Save,
  Globe,
  RotateCcw,
  AlertCircle,
  Calendar,
  Sparkles,
  Building,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { DateRangePreset } from '../../types';

export const SettingsPage: React.FC = () => {
  const {
    monthlyTarget,
    setMonthlyTarget,
    preferences,
    savePreferences,
    resetPreferencesToDefault,
    authUser,
    users,
    demoLoginAs,
    filters,
    updateFilter,
  } = useApp();

  const [targetInput, setTargetInput] = useState<string>(monthlyTarget.toString());
  const [selectedUser, setSelectedUser] = useState<string>(authUser?.id || 'u-6');
  const [currency, setCurrency] = useState<string>(preferences?.currency || 'INR');
  const [defaultDatePreset, setDefaultDatePreset] = useState<DateRangePreset>(
    preferences?.defaultDatePreset || 'oct2026'
  );
  const [defaultEmployee, setDefaultEmployee] = useState<string>(
    preferences?.defaultEmployeeFilter || 'all'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keep targetInput synchronized whenever monthlyTarget changes in shared state
  useEffect(() => {
    setTargetInput(monthlyTarget.toString());
  }, [monthlyTarget]);

  // Keep profile in sync
  useEffect(() => {
    if (authUser?.id) {
      setSelectedUser(authUser.id);
    }
  }, [authUser?.id]);

  const handlePresetClick = (amount: number) => {
    setTargetInput(amount.toString());
    setErrorMessage('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSavedSuccess(false);
    setResetSuccess(false);

    // Validation: Clean numeric target
    const cleanStr = targetInput.trim().replace(/,/g, '');
    if (!cleanStr) {
      setErrorMessage('Monthly Revenue Target cannot be empty.');
      return;
    }

    const num = Number(cleanStr);
    if (isNaN(num)) {
      setErrorMessage('Please enter a valid numeric target amount.');
      return;
    }

    if (num < 0) {
      setErrorMessage('Monthly Revenue Target cannot be negative.');
      return;
    }

    // Update shared state and localStorage
    const success = savePreferences({
      monthlyTarget: num,
      activeUserId: selectedUser,
      currency,
      defaultDatePreset,
      defaultEmployeeFilter: defaultEmployee,
    });

    if (success) {
      // Also apply active demo profile switch if selected
      const matchedUser = users.find((u) => u.id === selectedUser);
      if (matchedUser && matchedUser.id !== authUser?.id) {
        demoLoginAs(matchedUser);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 6000);
    } else {
      setErrorMessage('Failed to save preferences. Please check your browser storage permissions.');
    }
  };

  const handleReset = () => {
    setErrorMessage('');
    resetPreferencesToDefault();
    setTargetInput('8500000');
    setSelectedUser('u-6');
    setCurrency('INR');
    setDefaultDatePreset('oct2026');
    setDefaultEmployee('all');
    setResetSuccess(true);
    setSavedSuccess(false);
    setTimeout(() => setResetSuccess(false), 5000);
  };

  const currentPreviewTarget = Number(targetInput.replace(/,/g, ''));

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#172554] sm:text-2xl">
          Application Preferences & Settings
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Configure company targets, active consultant perspectives, currency standards, and default reporting presets.
        </p>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-300 p-4 text-xs text-emerald-900 animate-in fade-in-50 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Preferences saved successfully!</p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Monthly Revenue Target is set to <strong className="text-emerald-950 font-extrabold">{formatINR(monthlyTarget)}</strong>. Target Achievement on Executive Overview has been recalculated.
              </p>
            </div>
          </div>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center justify-center font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors shrink-0"
          >
            Open Executive Overview &rarr;
          </Link>
        </div>
      )}

      {/* Reset Notification Banner */}
      {resetSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 animate-in fade-in-50 shadow-xs">
          <RotateCcw className="h-5 w-5 text-blue-600 shrink-0" />
          <div>
            <p className="font-bold">Settings restored to factory defaults.</p>
            <p className="text-blue-700 text-[11px] mt-0.5">
              Monthly Revenue Target reset to ₹85,00,000, profile reset to Aazam Afroz, and all employee filters restored.
            </p>
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-300 p-4 text-xs text-rose-900 animate-in fade-in-50 shadow-xs">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Monthly Revenue Target */}
        <div className="rounded-xl border border-[#DCE6F5] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE6F5] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172554]">Monthly Revenue Target</h3>
                <p className="text-[11px] text-[#64748B]">
                  Directly drives the Target Achievement gauge, collection progress, and pacing metrics on the Overview dashboard.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB] border border-blue-100">
              Real-Time Dynamic KPI
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">
                Target Amount (Indian Rupee ₹) *
              </label>
              <div className="relative max-w-md">
                <span className="pointer-events-none absolute left-3 top-2.5 text-xs font-bold text-[#64748B]">
                  ₹
                </span>
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => {
                    setTargetInput(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full rounded-lg border border-[#DCE6F5] bg-white pl-8 pr-3 py-2 text-xs font-bold text-[#172554] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
                  placeholder="e.g. 1000000 or 8500000"
                />
              </div>

              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#64748B]">
                <span>
                  Current saved active target:{' '}
                  <strong className="text-[#172554] font-bold">{formatINR(monthlyTarget)}</strong>
                </span>
                {!isNaN(currentPreviewTarget) && currentPreviewTarget > 0 && currentPreviewTarget !== monthlyTarget && (
                  <span className="text-blue-600 font-semibold">
                    (Drafting: {formatINR(currentPreviewTarget)})
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#64748B] block mb-1.5">
                Quick Selection Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '₹10,00,000 (10L)', value: 1000000 },
                  { label: '₹25,00,000 (25L)', value: 2500000 },
                  { label: '₹50,00,000 (50L)', value: 5000000 },
                  { label: '₹85,00,000 (85L Default)', value: 8500000 },
                  { label: '₹1,00,00,000 (1.0 Cr)', value: 10000000 },
                ].map((preset) => {
                  const isSelected = targetInput === preset.value.toString();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handlePresetClick(preset.value)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] shadow-xs'
                          : 'border-[#DCE6F5] bg-[#F8FAFC] text-[#475569] hover:bg-white hover:border-[#94A3B8]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Active Demo Profile Switcher */}
        <div className="rounded-xl border border-[#DCE6F5] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#DCE6F5] pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172554]">Active Demo Perspective</h3>
              <p className="text-[11px] text-[#64748B]">
                Switch your active account perspective to inspect role-specific pipelines and operations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {users.map((u) => {
              const isSelected = selectedUser === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs ring-1 ring-[#2563EB]/40'
                      : 'border-[#DCE6F5] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${u.avatarColor}`}
                    >
                      {u.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#172554] truncate">{u.name}</div>
                      <div className="text-[10px] text-[#64748B] truncate">
                        {u.designation || u.department}
                      </div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle className="h-4 w-4 text-[#2563EB] shrink-0 ml-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Default Reporting Presets */}
        <div className="rounded-xl border border-[#DCE6F5] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#DCE6F5] pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172554]">Default Reporting Filters</h3>
              <p className="text-[11px] text-[#64748B]">
                Configure initial date range presets and employee isolation preferences applied when opening the workspace.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">
                Default Date Range Preset
              </label>
              <select
                value={defaultDatePreset}
                onChange={(e) => setDefaultDatePreset(e.target.value as DateRangePreset)}
                className="w-full rounded-lg border border-[#DCE6F5] bg-white px-3 py-2 text-xs font-medium text-[#172554] focus:border-[#2563EB] focus:outline-hidden cursor-pointer"
              >
                <option value="oct2026">October 2026 (Monthly Baseline)</option>
                <option value="today">Today (Recent Activity)</option>
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">
                Default Employee Filter
              </label>
              <select
                value={defaultEmployee}
                onChange={(e) => setDefaultEmployee(e.target.value)}
                className="w-full rounded-lg border border-[#DCE6F5] bg-white px-3 py-2 text-xs font-medium text-[#172554] focus:border-[#2563EB] focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Employees (Company-Wide Overview)</option>
                <option value="u-6">Aazam Afroz (Senior Business Consultant)</option>
                <option value="u-1">Nancy Singh (Senior Sales Lead)</option>
                <option value="u-2">Sneha Choudhary (Enterprise Account Exec)</option>
                <option value="u-3">Tannu Kumari (BD Specialist)</option>
                <option value="u-8">Vikramaditya Rao (Strategic Accounts)</option>
                <option value="u-4">Gaurav Pant (Operations Lead)</option>
                <option value="u-5">Srishti Upadhyay (Fulfillment)</option>
                <option value="u-7">Rajesh Verma (Finance Lead)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 4: Localization & Currency Standards */}
        <div className="rounded-xl border border-[#DCE6F5] bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 border-b border-[#DCE6F5] pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172554]">Currency & Formatting Standards</h3>
              <p className="text-[11px] text-[#64748B]">
                Active formatting rules across all financial charts, ledgers, and revenue reports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-[#F8FAFC] border border-[#DCE6F5] p-3">
              <span className="text-[#64748B] block text-[10px] font-semibold">Currency Standard</span>
              <span className="font-bold text-[#172554] mt-1 block">Indian Rupee (₹ INR)</span>
            </div>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#DCE6F5] p-3">
              <span className="text-[#64748B] block text-[10px] font-semibold">Numbering Format</span>
              <span className="font-bold text-[#172554] mt-1 block">Lakhs & Crores (en-IN)</span>
            </div>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#DCE6F5] p-3">
              <span className="text-[#64748B] block text-[10px] font-semibold">Standard Tax Rate</span>
              <span className="font-bold text-[#172554] mt-1 block">18% MCA / GST Standard</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-[#DCE6F5] bg-white px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172554] transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-[#1D4ED8] transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
