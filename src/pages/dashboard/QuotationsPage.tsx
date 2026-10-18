import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  Info,
} from 'lucide-react';
import { formatINR, formatDateFull } from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const QuotationsPage: React.FC = () => {
  const {
    currentFiltered,
    quotationCategories,
    setSelectedQuotationId,
    setSelectedLeadId,
    setSelectedDealId,
    setIsCreateQuotationOpen,
    quickAcceptQuotation,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  const quotations = currentFiltered.filteredQuotations;

  const totalValue = quotations.reduce((sum, q) => sum + q.finalAmount, 0);
  const acceptedCount = quotations.filter((q) => q.status === 'Accepted').length;
  const pendingCount = quotations.filter((q) => q.status === 'Pending' || q.status === 'Sent' || q.status === 'Viewed').length;
  const rejectedCount = quotations.filter((q) => q.status === 'Rejected').length;
  const convRate = quotations.length > 0 ? ((acceptedCount / quotations.length) * 100).toFixed(1) : '0';

  const filteredQuotes = quotations.filter((q) => {
    if (statusFilter !== 'ALL' && q.status !== statusFilter) return false;
    if (serviceFilter !== 'ALL' && q.serviceCategory !== serviceFilter) return false;
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      q.id.toLowerCase().includes(s) ||
      q.serviceCategory.toLowerCase().includes(s) ||
      q.leadId.toLowerCase().includes(s) ||
      q.assignedSalesName.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172554] sm:text-2xl">
            Quotation Intelligence & Proposal Analytics
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">
            Monitor issued commercial proposals, pricing estimates, acceptance rates, and won deal conversions.
          </p>
        </div>
        <button
          onClick={() => setIsCreateQuotationOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer self-start sm:self-auto"
        >
          <FileText className="h-4 w-4" />
          <span>Create Quotation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        <div className="rounded-xl border border-[#DCE6F5] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Total Quotations</span>
          <div className="mt-1 text-2xl font-bold text-[#172554]">{quotations.length}</div>
          <div className="text-[10px] text-blue-600 font-semibold">Commercial Proposals</div>
        </div>

        <div className="rounded-xl border border-[#DCE6F5] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Quoted Value</span>
          <div className="mt-1 text-xl font-bold text-[#1E3A8A]">{formatINR(totalValue)}</div>
          <div className="text-[10px] text-[#64748B]">Gross pipeline value</div>
        </div>

        <div className="rounded-xl border border-[#DCE6F5] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Accepted</span>
          <div className="mt-1 text-2xl font-bold text-emerald-700">{acceptedCount}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Converted to Deals</div>
        </div>

        <div className="rounded-xl border border-[#DCE6F5] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Pending</span>
          <div className="mt-1 text-2xl font-bold text-amber-700">{pendingCount}</div>
          <div className="text-[10px] text-amber-600 font-semibold">Under negotiation</div>
        </div>

        <div className="rounded-xl border border-[#DCE6F5] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Rejected</span>
          <div className="mt-1 text-2xl font-bold text-rose-700">{rejectedCount}</div>
          <div className="text-[10px] text-rose-600 font-semibold">Declined / Expired</div>
        </div>

        <div className="rounded-xl border border-[#DCE6F5] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Conversion Rate</span>
          <div className="mt-1 text-2xl font-bold text-cyan-700">{convRate}%</div>
          <div className="text-[10px] text-cyan-600 font-semibold">Won / Issued</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-8 rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#172554]">Quotations by Service Line</span>
            <span className="text-[10px] text-[#64748B]">Volume Distribution</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quotationCategories.slice(0, 7)} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="shortName" tick={{ fontSize: 9, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} proposals`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#0F172A', fontSize: 10, fontWeight: 600 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="lg:col-span-4 rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-[#172554]">Quote-to-Deal Conversion</span>
            <Info className="h-3.5 w-3.5 text-[#94A3B8]" />
          </div>

          <div className="relative my-4 flex h-32 w-32 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-[#E2E8F0]" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#2563EB] transition-all duration-700"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * Number(convRate)) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-[#172554]">{convRate}%</span>
              <span className="text-[9px] uppercase tracking-wider text-[#64748B]">Win Ratio</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-[#172554]">
            {acceptedCount} Won Deals / {quotations.length} Quotations
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="rounded-xl border border-[#DCE6F5] bg-white shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE6F5] p-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quotes by ID, service, rep..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-8 pr-3 py-1.5 text-xs text-[#172554] focus:border-[#2563EB] focus:outline-hidden"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#172554]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <span className="text-xs font-medium text-[#64748B]">
            Showing {filteredQuotes.length} of {quotations.length} quotations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#DCE6F5] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3">Quote ID</th>
                <th className="px-4 py-3">Service Category</th>
                <th className="px-4 py-3">Parent Lead</th>
                <th className="px-4 py-3">Assigned Rep</th>
                <th className="px-4 py-3 text-right">Base Amount</th>
                <th className="px-4 py-3 text-right">Final (with GST)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredQuotes.slice(0, 25).map((q) => (
                <tr
                  key={q.id}
                  onClick={() => setSelectedQuotationId(q.id)}
                  className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-4 py-3 font-bold text-[#2563EB]">
                    #{q.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#172554]">
                    {q.serviceCategory}
                  </td>
                  <td
                    className="px-4 py-3 text-[#2563EB] hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLeadId(q.leadId);
                    }}
                  >
                    #{q.leadId}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#475569]">
                    {q.assignedSalesName}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#475569]">
                    {formatINR(q.amount)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#172554]">
                    {formatINR(q.finalAmount)}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          q.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700'
                            : q.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {q.status}
                      </span>
                      {q.status !== 'Accepted' && q.status !== 'Rejected' && (
                        <button
                          onClick={() => quickAcceptQuotation(q.id)}
                          className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
                          title="Convert this quote directly into an active won deal"
                        >
                          Accept & Win
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-[#64748B]">
                    {formatDateFull(q.createdAt)}
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
