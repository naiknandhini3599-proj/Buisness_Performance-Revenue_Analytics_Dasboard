import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, IndianRupee, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import {
  DealServiceStat,
  RevenueCategoryProgress,
  PriorityStat,
  DailyRevenuePoint,
} from '../utils/calculations';
import { PeriodKpiData } from '../types';
import { formatINR, formatCompactINR } from '../utils/formatters';

interface DealsRevenueSectionProps {
  currentKpi: PeriodKpiData;
  dealsVsRevenue: DealServiceStat[];
  revenueCategories: RevenueCategoryProgress[];
  priorityBreakdown: PriorityStat[];
  dailyRevenueTrend: DailyRevenuePoint[];
  onDrillDown: (type: 'deals' | 'payments' | 'invoices' | 'priority', meta?: string) => void;
}

export const DealsRevenueSection: React.FC<DealsRevenueSectionProps> = ({
  currentKpi,
  dealsVsRevenue,
  revenueCategories,
  priorityBreakdown,
  dailyRevenueTrend,
  onDrillDown,
}) => {
  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[#2563EB]" />
          <h2 className="text-sm font-bold text-[#0F172A]">Deals & Revenue</h2>
        </div>
        <button
          onClick={() => onDrillDown('deals')}
          className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          View all deals ({currentKpi.dealsCreated})
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Grid of 5 cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Card 1: Deals Created vs Deal Revenue (by Service) */}
        <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#0F172A] leading-tight">
              Deals Created vs Deal Revenue (by Service)
            </div>
            <div className="flex flex-col items-end text-[9px] text-[#64748B]">
              <span className="flex items-center gap-1 text-[#2563EB] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" /> Deals Created
              </span>
              <span className="flex items-center gap-1 text-[#F59E0B] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" /> Deal Revenue (₹)
              </span>
            </div>
          </div>

          <div className="my-auto h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dealsVsRevenue.slice(0, 6)}
                margin={{ top: 12, right: 8, left: -24, bottom: 0 }}
              >
                <XAxis
                  dataKey="service"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'Deals Created' ? `${val} deals` : formatINR(Number(val)),
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="dealsCount"
                  name="Deals Created"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  onClick={(entry: any) => onDrillDown('deals', entry?.service || entry?.payload?.service)}
                  label={{ position: 'top', fill: '#0F172A', fontSize: 9, fontWeight: 600 }}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Click bar to view category deals
          </div>
        </div>

        {/* Card 2: Revenue by Order / Service Category */}
        <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-[#0F172A]">
            Revenue by Order / Service Category
          </div>

          <div className="my-auto flex flex-col gap-2.5 py-1">
            {revenueCategories.slice(0, 6).map((item) => (
              <div
                key={item.category}
                onClick={() => onDrillDown('deals', item.category)}
                className="group cursor-pointer rounded p-1 hover:bg-[#F8FAFC]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#334155] truncate max-w-[120px]" title={item.category}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-[#0F172A]">
                      {formatCompactINR(item.revenue)}
                    </span>
                    <span className="text-[10px] text-[#64748B]">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-full rounded-full bg-[#2563EB] transition-all group-hover:bg-[#1D4ED8]"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Share of recognized deal revenue
          </div>
        </div>

        {/* Card 3: Priority Breakdown */}
        <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-[#0F172A]">Priority Breakdown</div>

          <div className="my-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E8F0] text-[10px] font-semibold text-[#64748B]">
                <tr>
                  <th className="pb-1.5">Priority</th>
                  <th className="pb-1.5 text-right">Deals</th>
                  <th className="pb-1.5 text-right">Revenue</th>
                  <th className="pb-1.5 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {priorityBreakdown.map((row) => (
                  <tr
                    key={row.priority}
                    onClick={() => onDrillDown('priority', row.priority)}
                    className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-2.5 font-medium text-[#1E293B]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: row.color }}
                        />
                        <span>{row.priority}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-semibold text-[#0F172A]">
                      {row.deals}
                    </td>
                    <td className="py-2.5 text-right font-medium text-[#475569]">
                      {formatINR(row.revenue)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#0F172A]">
                      {row.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Filter pipeline by deal urgency
          </div>
        </div>

        {/* Card 4: Daily Revenue Trend */}
        <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#0F172A]">Daily Revenue Trend</div>
            <div className="flex items-center gap-2 text-[9px]">
              <span className="flex items-center gap-1 font-medium text-[#2563EB]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" /> Revenue
              </span>
              <span className="flex items-center gap-1 font-medium text-[#10B981]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Collected
              </span>
            </div>
          </div>

          <div className="my-auto h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyRevenueTrend.slice(0, 19)}
                margin={{ top: 10, right: 8, left: -22, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 8, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  interval={Math.ceil(dailyRevenueTrend.length / 6)}
                />
                <YAxis
                  tick={{ fontSize: 8, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [formatINR(Number(val)), name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[2, 2, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#10B981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Daily booked deals vs cash receipts
          </div>
        </div>

        {/* Card 5: Total vs Collected Revenue Summary */}
        <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="text-xs font-bold text-[#0F172A]">
            Total vs Collected Revenue
          </div>

          <div className="my-auto flex flex-col gap-3 py-1">
            {/* Box 1: Total Deal Value */}
            <div
              onClick={() => onDrillDown('deals')}
              className="group flex cursor-pointer items-center justify-between rounded-lg border border-blue-100 bg-[#EFF6FF] p-3 transition-colors hover:bg-blue-100/70"
            >
              <div>
                <span className="text-[11px] font-semibold text-[#1D4ED8]">Total Deal Value</span>
                <div className="text-xl font-bold text-[#1E3A8A]">
                  {formatINR(currentKpi.totalDealValue)}
                </div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-200/60 text-[#2563EB]">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            {/* Box 2: Net Collected Revenue */}
            <div
              onClick={() => onDrillDown('payments')}
              className="group flex cursor-pointer items-center justify-between rounded-lg border border-emerald-100 bg-[#ECFDF5] p-3 transition-colors hover:bg-emerald-100/70"
            >
              <div>
                <span className="text-[11px] font-semibold text-[#047857]">Net Collected Revenue</span>
                <div className="text-xl font-bold text-[#065F46]">
                  {formatINR(currentKpi.totalCollected)}
                </div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-200/60 text-[#10B981]">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>

            {/* Box 3: Outstanding Revenue */}
            <div
              onClick={() => onDrillDown('invoices')}
              className="flex items-center justify-between rounded-lg border border-amber-100 bg-[#FFFBEB] px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-1.5 text-amber-800">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-[11px] font-medium">Outstanding Balance:</span>
              </div>
              <span className="font-bold text-[#B45309]">
                {formatINR(currentKpi.outstandingRevenue)}
              </span>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Click cards to review ledgers & receipts
          </div>
        </div>
      </div>
    </div>
  );
};
