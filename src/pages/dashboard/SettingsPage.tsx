import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Target,
  DollarSign,
  UserCheck,
  CheckCircle,
  Save,
  Globe,
  BellRing,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const SettingsPage: React.FC = () => {
  const {
    monthlyTarget,
    setMonthlyTarget,
    preferences,
    savePreferences,
    authUser,
    users,
    demoLoginAs,
  } = useApp();

  const [targetInput, setTargetInput] = useState(monthlyTarget.toString());
  const [selectedUser, setSelectedUser] = useState(authUser?.id || 'u-6');
  const [currency, setCurrency] = useState(preferences?.currency || 'INR');
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setTargetInput(monthlyTarget.toString());
  }, [monthlyTarget]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(targetInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setMonthlyTarget(num);
    }
    const matchedUser = users.find((u) => u.id === selectedUser);
    if (matchedUser) {
      demoLoginAs(matchedUser);
    }
    savePreferences({
      monthlyTarget: !isNaN(num) && num > 0 ? num : monthlyTarget,
      activeUserId: selectedUser,
      currency,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
          Application Preferences & Settings
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Configure monthly targets, active demo profiles, and display standards with persistent storage.
        </p>
      </div>

      {saved && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 animate-in fade-in-50 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Preferences saved successfully to LocalStorage! Target and profile updated across all dashboard pages.</span>
          </div>
          <a
            href="/app/dashboard"
            className="inline-flex items-center justify-center font-bold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-300 shadow-xs hover:bg-emerald-100"
          >
            View Executive Overview &rarr;
          </a>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Monthly Revenue Target */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-3">
            <Target className="h-5 w-5 text-[#2563EB]" />
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Monthly Revenue Target</h3>
              <p className="text-[11px] text-[#64748B]">
                Updates the Target vs. Achieved gauge on the Executive Overview in real time.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Target Amount (INR ₹)
              </label>
              <div className="relative max-w-md">
                <span className="pointer-events-none absolute left-3 top-2.5 text-xs font-bold text-[#64748B]">
                  ₹
                </span>
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-7 pr-3 py-2 text-xs font-bold text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
                  placeholder="8500000"
                />
              </div>
              <span className="mt-1 block text-[10px] text-[#64748B]">
                Current active target: <strong className="text-[#0F172A]">{formatINR(monthlyTarget)}</strong>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#64748B] block mb-1.5">
                Quick Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTargetInput('1000000')}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    targetInput === '1000000'
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-white'
                  }`}
                >
                  ₹10,00,000 (10L)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetInput('2500000')}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    targetInput === '2500000'
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-white'
                  }`}
                >
                  ₹25,00,000 (25L)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetInput('5000000')}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    targetInput === '5000000'
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-white'
                  }`}
                >
                  ₹50,00,000 (50L)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetInput('8500000')}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    targetInput === '8500000'
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-white'
                  }`}
                >
                  ₹85,00,000 (85L Default)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetInput('10000000')}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    targetInput === '10000000'
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] hover:bg-white'
                  }`}
                >
                  ₹1,00,00,000 (1.0 Cr)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Active Demo Profile */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-3">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Switch Active Demo Profile</h3>
              <p className="text-[11px] text-[#64748B]">
                Inspect personalized analytics through different employee perspectives.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {users.map((u) => {
              const isSelected = selectedUser === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EFF6FF]'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${u.avatarColor}`}>
                      {u.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0F172A]">{u.name}</div>
                      <div className="text-[10px] text-[#64748B]">{u.designation || u.department}</div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle className="h-4 w-4 text-[#2563EB]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Regional & Currency Standards */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 border-b border-[#E2E8F0] pb-3">
            <Globe className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Localization & Number System</h3>
              <p className="text-[11px] text-[#64748B]">
                Active formatting rules across all financial charts and tables.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3">
              <span className="text-[#64748B] block text-[10px]">Currency Standard</span>
              <span className="font-bold text-[#0F172A] mt-1 block">Indian Rupee (₹)</span>
            </div>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3">
              <span className="text-[#64748B] block text-[10px]">Numbering Format</span>
              <span className="font-bold text-[#0F172A] mt-1 block">Lakhs & Crores (en-IN)</span>
            </div>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3">
              <span className="text-[#64748B] block text-[10px]">Tax Rate</span>
              <span className="font-bold text-[#0F172A] mt-1 block">18% Standard GST</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
