import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  Filter,
  Users,
  FileText,
  Briefcase,
  Layers,
  CreditCard,
  Receipt,
  Calendar,
} from 'lucide-react';
import { formatDateFull } from '../../utils/formatters';

export const RecentActivityPage: React.FC = () => {
  const {
    activities,
    setSelectedLeadId,
    setSelectedQuotationId,
    setSelectedDealId,
    setSelectedOrderId,
    setSelectedPaymentId,
  } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [employeeFilter, setEmployeeFilter] = useState('ALL');

  const filtered = activities.filter((act) => {
    if (typeFilter !== 'ALL' && act.recordType !== typeFilter) return false;
    if (employeeFilter !== 'ALL' && act.employeeName !== employeeFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      act.recordId.toLowerCase().includes(q) ||
      act.action.toLowerCase().includes(q) ||
      act.employeeName.toLowerCase().includes(q) ||
      (act.details && act.details.toLowerCase().includes(q))
    );
  });

  const handleSelectRecord = (type: string, id: string) => {
    const cleanId = id.replace('#', '').trim();
    if (type === 'Lead') setSelectedLeadId(cleanId);
    else if (type === 'Quotation') setSelectedQuotationId(cleanId);
    else if (type === 'Deal') setSelectedDealId(cleanId);
    else if (type === 'Order') setSelectedOrderId(cleanId);
    else if (type === 'Payment') setSelectedPaymentId(cleanId);
  };

  const employees = Array.from(new Set(activities.map((a) => a.employeeName)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
          Recent CRM & Operational Activity Timeline
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Auditable timeline of lead status changes, quotations generated, deals closed, and payments captured.
        </p>
      </div>

      {/* Activity Table & Filters */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activity, employee, notes..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-8 pr-3 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
            >
              <option value="ALL">All Event Types</option>
              <option value="Lead">Leads</option>
              <option value="Quotation">Quotations</option>
              <option value="Deal">Deals</option>
              <option value="Order">Orders</option>
              <option value="Payment">Payments</option>
            </select>

            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
            >
              <option value="ALL">All Team Members</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-medium text-[#64748B]">
            Showing {filtered.length} log events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Team Member</th>
                <th className="px-4 py-3">Action Performed</th>
                <th className="px-4 py-3">Audit Details</th>
                <th className="px-4 py-3 text-right">Referenced Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((act) => {
                const initials = act.employeeName.split(' ').map((n) => n[0]).join('');

                return (
                  <tr key={act.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 text-[#64748B] font-mono text-[11px] whitespace-nowrap">
                      {act.timestamp.replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                          {initials}
                        </span>
                        <span className="font-semibold text-[#0F172A]">{act.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1E293B]">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {act.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#475569] max-w-xs truncate" title={act.details}>
                      {act.details || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleSelectRecord(act.recordType, act.recordId)}
                        className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-[#2563EB] hover:bg-blue-100 transition-colors"
                      >
                        #{act.recordId}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
