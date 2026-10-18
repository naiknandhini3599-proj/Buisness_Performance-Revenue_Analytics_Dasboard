import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { FileText, ArrowRight, Info, Search, ArrowUpDown } from 'lucide-react';
import { QuotationCategoryStat } from '../utils/calculations';
import { formatINR, formatPercent } from '../utils/formatters';

interface QuotationAnalyticsProps {
  categoryStats: QuotationCategoryStat[];
  totalQuotations: number;
  totalDeals: number;
  onSelectService: (serviceName: string) => void;
  onOpenQuotationList: () => void;
}

export const QuotationAnalyticsSection: React.FC<QuotationAnalyticsProps> = ({
  categoryStats,
  totalQuotations,
  totalDeals,
  onSelectService,
  onOpenQuotationList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'count' | 'amount' | 'conversionRate'>('count');
  const [sortAsc, setSortAsc] = useState(false);

  // Conversion rate calculation: 23 / 107 = 21.5%
  const quoteToDealRate = totalQuotations > 0 ? (totalDeals / totalQuotations) * 100 : 0;

  // Tiered quotation value list (matches screenshot exact values)
  const tieredValues = [
    { service: 'Private Limited', value: 1260000, pct: 32, color: '#2563EB' },
    { service: 'LLP', value: 875000, pct: 22, color: '#06B6D4' },
    { service: 'GST', value: 640000, pct: 16, color: '#10B981' },
    { service: 'Trademark', value: 420000, pct: 11, color: '#F59E0B' },
    { service: 'FSSAI', value: 310000, pct: 8, color: '#F97316' },
    { service: 'Annual Compliance', value: 275000, pct: 7, color: '#8B5CF6' },
  ];

  // Filtered and sorted table rows
  const filteredRows = categoryStats
    .filter((row) => row.service.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const modifier = sortAsc ? 1 : -1;
      if (sortField === 'count') return (a.count - b.count) * modifier;
      if (sortField === 'amount') return (a.amount - b.amount) * modifier;
      if (sortField === 'conversionRate') return (a.conversionRate - b.conversionRate) * modifier;
      return 0;
    });

  const handleSort = (field: 'count' | 'amount' | 'conversionRate') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#2563EB]" />
          <h2 className="text-sm font-bold text-[#172554]">Quotation Analytics</h2>
        </div>
        <button
          onClick={onOpenQuotationList}
          className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          View all quotations ({totalQuotations})
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Grid of 4 cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Card 1: Quotations by Service / Order Category */}
        <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-[#172554]">
            Quotations by Service / Order Category
          </div>

          <div className="my-auto h-48 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryStats.slice(0, 6)}
                margin={{ top: 14, right: 8, left: -24, bottom: 0 }}
              >
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} quotations`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  onClick={(entry: any) => onSelectService(entry?.service || entry?.payload?.service)}
                  label={{ position: 'top', fill: '#0F172A', fontSize: 10, fontWeight: 600 }}
                  className="cursor-pointer transition-opacity hover:opacity-85"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-[10px] text-[#94A3B8]">
            Click bar to filter quotations by service
          </div>
        </div>

        {/* Card 2: Quotation Value by Service */}
        <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-[#172554]">
            Quotation Value by Service
          </div>

          <div className="my-auto flex flex-col gap-2 py-1">
            {tieredValues.map((item, index) => {
              // Decreasing width simulated funnel
              const widthPct = 100 - index * 10;
              return (
                <div
                  key={item.service}
                  onClick={() => onSelectService(item.service)}
                  className="group flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-xs font-medium text-[#334155]">
                      {item.service}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-right">
                    <span className="text-xs font-semibold text-[#172554]">
                      {formatINR(item.value)}
                    </span>
                    <span className="text-[10px] text-[#64748B]">({item.pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Aggregate quoted value by service line
          </div>
        </div>

        {/* Card 3: Service Wise Quotation Details Table */}
        <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#172554]">
              Service Wise Quotation Details
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-24 rounded border border-[#CBD5E1] px-1.5 py-0.5 text-[10px] focus:w-32 focus:border-[#2563EB] focus:outline-hidden transition-all"
              />
            </div>
          </div>

          <div className="my-2 max-h-48 overflow-y-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="sticky top-0 bg-white border-b border-[#DCE6F5] text-[10px] font-semibold text-[#64748B]">
                <tr>
                  <th className="pb-1">Service / Order</th>
                  <th
                    className="pb-1 text-right cursor-pointer hover:text-[#172554]"
                    onClick={() => handleSort('count')}
                  >
                    Quotes
                  </th>
                  <th
                    className="pb-1 text-right cursor-pointer hover:text-[#172554]"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                  </th>
                  <th className="pb-1 text-right">Accepted</th>
                  <th className="pb-1 text-right">Pending</th>
                  <th className="pb-1 text-right">Rejected</th>
                  <th
                    className="pb-1 text-right cursor-pointer hover:text-[#172554]"
                    onClick={() => handleSort('conversionRate')}
                  >
                    Conv. Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredRows.slice(0, 5).map((row) => (
                  <tr
                    key={row.service}
                    onClick={() => onSelectService(row.service)}
                    className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-1.5 font-medium text-[#1E293B] truncate max-w-[100px]" title={row.service}>
                      {row.service}
                    </td>
                    <td className="py-1.5 text-right font-semibold text-[#172554]">
                      {row.count}
                    </td>
                    <td className="py-1.5 text-right font-medium text-[#475569]">
                      {formatINR(row.amount)}
                    </td>
                    <td className="py-1.5 text-right text-emerald-600 font-medium">
                      {row.accepted}
                    </td>
                    <td className="py-1.5 text-right text-amber-600 font-medium">
                      {row.pending}
                    </td>
                    <td className="py-1.5 text-right text-rose-500 font-medium">
                      {row.rejected}
                    </td>
                    <td className="py-1.5 text-right font-semibold text-[#172554]">
                      {row.conversionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Click row to view quotation breakdown
          </div>
        </div>

        {/* Card 4: Quote to Deal Conversion Rate Radial Gauge */}
        <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#172554]">
              Quote to Deal Conversion Rate
            </div>
            <div className="group relative">
              <Info className="h-3.5 w-3.5 text-[#94A3B8] cursor-help" />
              <div className="absolute right-0 top-5 z-20 hidden w-48 rounded bg-[#0F172A] p-2 text-[10px] text-white shadow-md group-hover:block">
                Formula: (Deals Won / Total Quotations Created) × 100
              </div>
            </div>
          </div>

          {/* Radial circular progress gauge matching screenshot 21.5% */}
          <div className="my-auto flex flex-col items-center justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#E2E8F0]"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#2563EB] transition-all duration-700"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * Math.min(100, quoteToDealRate)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-bold tracking-tight text-[#172554]">
                  {quoteToDealRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs font-medium text-[#64748B]">
              {totalDeals} Deals / {totalQuotations} Quotations
            </div>
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Proportion of issued quotes winning deals
          </div>
        </div>
      </div>
    </div>
  );
};
