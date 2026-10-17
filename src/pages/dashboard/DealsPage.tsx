import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  DollarSign,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { formatINR, formatCompactINR, formatDateFull } from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const DealsPage: React.FC = () => {
  const {
    currentFiltered,
    dealsVsRevenue,
    revenueCategories,
    priorityBreakdown,
    dailyRevenueTrend,
    updateDealStage,
    setSelectedDealId,
    setSelectedLeadId,
    setIsCreateDealOpen,
  } = useApp();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const deals = currentFiltered.filteredDeals;
  const payments = currentFiltered.filteredPayments;

  const totalValue = deals.reduce((sum, d) => sum + d.amount, 0);
  const wonDeals = deals.filter((d) => d.stage === 'Won');
  const wonValue = wonDeals.reduce((sum, d) => sum + d.amount, 0);
  const openDeals = deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost');
  const collectedValue = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingValue = Math.max(0, totalValue - collectedValue);

  const filteredDeals = deals.filter((d) => {
    if (stageFilter !== 'ALL' && d.stage !== stageFilter) return false;
    if (priorityFilter !== 'ALL' && d.priority !== priorityFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.id.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.serviceCategory.toLowerCase().includes(q) ||
      d.assignedSalesName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
            Deals Pipeline & Revenue Intelligence
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">
            Track commercial contracts, priority stages, recognized booking value, and cash collections.
          </p>
        </div>
        <button
          onClick={() => setIsCreateDealOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Briefcase className="h-4 w-4" />
          <span>New Commercial Deal</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Total Deals</span>
          <div className="mt-1 text-2xl font-bold text-[#0F172A]">{deals.length}</div>
          <div className="text-[10px] text-blue-600 font-semibold">Active Pipeline</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Won Deals</span>
          <div className="mt-1 text-2xl font-bold text-emerald-700">{wonDeals.length}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">{formatINR(wonValue)} won</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Open Deals</span>
          <div className="mt-1 text-2xl font-bold text-amber-700">{openDeals.length}</div>
          <div className="text-[10px] text-amber-600 font-semibold">Negotiating</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Total Deal Value</span>
          <div className="mt-1 text-xl font-bold text-[#1E3A8A]">{formatINR(totalValue)}</div>
          <div className="text-[10px] text-[#64748B]">Recognized Value</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Net Collected</span>
          <div className="mt-1 text-xl font-bold text-emerald-700">{formatINR(collectedValue)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Settled Receipts</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Outstanding</span>
          <div className="mt-1 text-xl font-bold text-amber-700">{formatINR(outstandingValue)}</div>
          <div className="text-[10px] text-amber-600 font-semibold">Pending Collection</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Deals vs Revenue */}
        <div className="lg:col-span-7 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#0F172A]">Deals Created vs Deal Value by Service</span>
            <span className="text-[10px] text-[#64748B]">Category Distribution</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealsVsRevenue.slice(0, 6)} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="service" tick={{ fontSize: 9, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [name === 'Deals' ? `${val} deals` : formatINR(Number(val)), name]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="dealsCount" name="Deals" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Table */}
        <div className="lg:col-span-5 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-[#0F172A] mb-3">Priority Distribution</span>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B]">
                <tr>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2 text-right">Deals</th>
                  <th className="pb-2 text-right">Revenue</th>
                  <th className="pb-2 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {priorityBreakdown.map((row) => (
                  <tr key={row.priority} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 font-semibold text-[#1E293B]">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
                        <span>{row.priority}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#0F172A]">{row.deals}</td>
                    <td className="py-2.5 text-right font-medium text-[#475569]">{formatINR(row.revenue)}</td>
                    <td className="py-2.5 text-right font-bold text-[#0F172A]">{row.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center text-[10px] text-[#94A3B8] mt-3">
            High priority deals represent top recognized bookings
          </div>
        </div>
      </div>

      {/* Deals Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deals by title, service, owner..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-8 pr-3 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
              />
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
            >
              <option value="ALL">All Stages</option>
              <option value="Won">Won</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Negotiation">Negotiation</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <span className="text-xs font-medium text-[#64748B]">
            Showing {filteredDeals.length} of {deals.length} deals
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3">Deal ID</th>
                <th className="px-4 py-3">Deal Title</th>
                <th className="px-4 py-3">Service Category</th>
                <th className="px-4 py-3 text-right">Deal Value</th>
                <th className="px-4 py-3 text-center">Priority</th>
                <th className="px-4 py-3 text-center">Stage</th>
                <th className="px-4 py-3">Assigned Owner</th>
                <th className="px-4 py-3 text-right">Close Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredDeals.slice(0, 25).map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => setSelectedDealId(deal.id)}
                  className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-4 py-3 font-bold text-[#8B5CF6]">
                    #{deal.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">
                    {deal.title}
                  </td>
                  <td className="px-4 py-3 text-[#475569]">
                    {deal.serviceCategory}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#0F172A]">
                    {formatINR(deal.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        deal.priority === 'High'
                          ? 'bg-rose-50 text-rose-700'
                          : deal.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {deal.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={deal.stage}
                      onChange={(e) => updateDealStage(deal.id, e.target.value as any)}
                      className="rounded border border-[#CBD5E1] bg-white px-2 py-0.5 text-[10px] font-bold text-[#0F172A]"
                    >
                      <option value="Won">Won</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1E293B]">
                    {deal.assignedSalesName}
                  </td>
                  <td className="px-4 py-3 text-right text-[#64748B]">
                    {formatDateFull(deal.expectedCloseDate)}
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
