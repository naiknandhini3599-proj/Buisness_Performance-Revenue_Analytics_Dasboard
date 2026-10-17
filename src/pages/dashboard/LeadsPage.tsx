import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle2,
  Target,
  XCircle,
  TrendingUp,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Mail,
  Phone,
  Building,
} from 'lucide-react';
import { Lead } from '../../types';
import { formatDateFull } from '../../utils/formatters';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';

export const LeadsPage: React.FC = () => {
  const {
    currentFiltered,
    leadSources,
    dailyLeadTrend,
    updateLeadStatus,
    setSelectedLeadId,
    setIsCreateLeadOpen,
    comparison,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'createdAt' | 'name' | 'companyName'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  const leads = currentFiltered.filteredLeads;

  const filteredLeads = leads
    .filter((l) => {
      if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
      if (sourceFilter !== 'ALL' && l.source !== sourceFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        l.id.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        l.companyName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.serviceInterest.toLowerCase().includes(q) ||
        l.assignedSalesName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const mod = sortAsc ? 1 : -1;
      if (sortField === 'name') return a.name.localeCompare(b.name) * mod;
      if (sortField === 'companyName') return a.companyName.localeCompare(b.companyName) * mod;
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * mod;
    });

  const qualifiedCount = leads.filter((l) => l.status === 'Qualified' || l.status === 'Converted').length;
  const convertedCount = leads.filter((l) => l.status === 'Converted').length;
  const unqualifiedCount = leads.filter((l) => l.status === 'Unqualified').length;
  const rate = leads.length > 0 ? ((convertedCount / leads.length) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
            Lead Analytics & Inbound Pipeline
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">
            Track inbound lead generation, qualification ratios, and sales rep allocation.
          </p>
        </div>
        <button
          onClick={() => setIsCreateLeadOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold">Total Leads</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">{leads.length}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">{comparison.newLeadsDiff.valueStr} vs previous</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold">Qualified</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{qualifiedCount}</div>
          <div className="text-[10px] text-[#64748B]">
            {leads.length > 0 ? ((qualifiedCount / leads.length) * 100).toFixed(1) : 0}% of leads
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold">Converted</span>
            <Target className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{convertedCount}</div>
          <div className="text-[10px] text-amber-600 font-semibold">Won accounts</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold">Unqualified</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-700">{unqualifiedCount}</div>
          <div className="text-[10px] text-[#64748B]">
            {leads.length > 0 ? ((unqualifiedCount / leads.length) * 100).toFixed(1) : 0}% drop rate
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold">Conversion Rate</span>
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-700">{rate}%</div>
          <div className="text-[10px] text-cyan-600 font-semibold">Inbound efficiency</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Daily Velocity Line Chart */}
        <div className="lg:col-span-8 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0F172A]">Daily Inbound Lead Velocity</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#2563EB] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#2563EB]" /> New Leads
              </span>
              <span className="flex items-center gap-1 text-[#10B981] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Qualified
              </span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyLeadTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748B' }} interval={Math.ceil(dailyLeadTrend.length / 7)} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Line type="monotone" dataKey="newLeads" name="New Leads" stroke="#2563EB" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="qualified" name="Qualified" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Donut */}
        <div className="lg:col-span-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-[#0F172A]">Lead Acquisition Sources</span>
          <div className="my-auto h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSources}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                >
                  {leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-[10px] text-[#64748B]">
            {leadSources.map((s) => (
              <span key={s.name} className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.name} ({s.count})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Leads Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads by name, company, email..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-8 pr-3 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Unqualified">Unqualified</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
            >
              <option value="ALL">All Sources</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          <span className="text-xs font-medium text-[#64748B]">
            Showing {filteredLeads.length} of {leads.length} leads
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3">Lead ID</th>
                <th className="px-4 py-3">Company & Contact</th>
                <th className="px-4 py-3">Service Interest</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Assigned Rep</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredLeads.slice(0, 25).map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-4 py-3 font-bold text-[#2563EB]">
                    #{lead.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#0F172A]">{lead.companyName}</div>
                    <div className="text-[11px] text-[#64748B]">{lead.name} • {lead.city}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#334155]">
                    {lead.serviceInterest}
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#0F172A]">
                    {lead.assignedSalesName}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className="rounded-lg border border-[#CBD5E1] bg-white px-2 py-1 text-[10px] font-bold text-[#0F172A] focus:outline-hidden"
                    >
                      <option value="New">New</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Converted">Converted</option>
                      <option value="Unqualified">Unqualified</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right text-[#64748B]">
                    {formatDateFull(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
