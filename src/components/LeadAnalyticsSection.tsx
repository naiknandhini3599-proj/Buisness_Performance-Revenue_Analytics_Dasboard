import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Target, TrendingUp, Filter, Users } from 'lucide-react';
import { formatINR, formatPercent } from '../utils/formatters';
import {
  DailyTrendPoint,
  LeadSourceStat,
} from '../utils/calculations';
import { PeriodKpiData } from '../types';
import { MONTHLY_TARGET } from '../data/dummyData';

interface LeadAnalyticsSectionProps {
  currentKpi: PeriodKpiData;
  leadSources: LeadSourceStat[];
  dailyLeadTrend: DailyTrendPoint[];
  monthlyTarget?: number;
  onDrillDown: (type: 'leads' | 'qualified' | 'converted' | 'unqualified' | 'source', meta?: string) => void;
}

export const LeadAnalyticsSection: React.FC<LeadAnalyticsSectionProps> = ({
  currentKpi,
  leadSources,
  dailyLeadTrend,
  monthlyTarget,
  onDrillDown,
}) => {
  // Target achievement calculations dynamically driven by context/settings!
  const target = monthlyTarget && monthlyTarget > 0 ? monthlyTarget : MONTHLY_TARGET;
  const achieved = currentKpi.totalCollected;
  const remaining = Math.max(0, target - achieved);
  const achievedPct = target > 0 ? Number(((achieved / target) * 100).toFixed(1)) : 0;
  const remainingPct = Math.max(0, Number((100 - achievedPct).toFixed(1)));

  // Funnel numbers
  const newLeads = currentKpi.newLeads;
  const qualified = currentKpi.qualifiedLeads;
  const converted = currentKpi.convertedLeads;
  const unqualified = currentKpi.unqualifiedLeads;

  const qualifiedPct = newLeads > 0 ? ((qualified / newLeads) * 100).toFixed(1) : '0';
  const convertedPct = newLeads > 0 ? ((converted / newLeads) * 100).toFixed(1) : '0';
  const unqualifiedPct = newLeads > 0 ? ((unqualified / newLeads) * 100).toFixed(1) : '0';

  const totalSources = leadSources.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* 1. Target Achievement Card */}
      <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-[#2563EB]" />
              <span>Target Achievement</span>
            </div>
            <a
              href="/app/settings"
              className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold"
            >
              Configure
            </a>
          </div>

          <div className="mt-4">
            <span className="text-[11px] font-medium text-[#64748B]">Monthly Revenue Target</span>
            <div className="text-2xl font-bold tracking-tight text-[#0F172A]">
              {formatINR(target)}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[#64748B]">Achieved</span>
              <span className="font-semibold text-[#0F172A]">{formatINR(achieved)}</span>
            </div>
            <span className="font-medium text-[#64748B]">{achievedPct.toFixed(1)}%</span>
          </div>

          <div className="mt-1 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span className="text-[#64748B]">Remaining</span>
              <span className="font-semibold text-[#0F172A]">{formatINR(remaining)}</span>
            </div>
            <span className="font-medium text-[#64748B]">{remainingPct.toFixed(1)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
            <div
              className="h-full rounded-full bg-[#10B981] transition-all duration-500"
              style={{ width: `${Math.min(100, achievedPct)}%` }}
            />
          </div>
        </div>

        {/* Funnel visualization on right / bottom */}
        <div className="mt-4 border-t border-[#F1F5F9] pt-3">
          <div className="text-center text-[10px] font-semibold text-[#64748B]">
            Target vs Achieved (Revenue)
          </div>
          <div className="mt-2 flex h-24 items-center justify-center">
            {/* Geometric stylized funnel matching screenshot */}
            <div className="relative flex w-36 flex-col items-center">
              {/* Upper trapezoid: Remaining */}
              <div
                className="relative flex h-14 w-full items-center justify-center bg-[#3B82F6] text-white shadow-xs"
                style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}
              >
                <div className="text-center">
                  <div className="text-[9px] font-semibold opacity-90">Remaining</div>
                  <div className="text-[10px] font-bold">{remainingPct.toFixed(1)}%</div>
                </div>
              </div>
              {/* Lower trapezoid: Achieved */}
              <div
                className="relative -mt-0.5 flex h-8 w-[72%] items-center justify-center bg-[#1D4ED8] text-white"
                style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)' }}
              >
                <div className="text-center">
                  <div className="text-[8px] font-semibold opacity-90">Achieved</div>
                  <div className="text-[9px] font-bold">{achievedPct.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lead Funnel */}
      <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#0F172A]">Lead Funnel</div>
          <span className="text-[10px] text-[#64748B]">Conversion Flow</span>
        </div>

        <div className="relative my-auto flex items-center justify-center py-2">
          {/* Main Funnel Stages */}
          <div className="flex w-44 flex-col items-center gap-1">
            {/* Stage 1: New Leads */}
            <div
              onClick={() => onDrillDown('leads')}
              className="flex h-11 w-full cursor-pointer flex-col items-center justify-center bg-[#2563EB] text-white shadow-xs transition-transform hover:scale-102"
              style={{ clipPath: 'polygon(0 0, 100% 0, 84% 100%, 16% 100%)' }}
              title="Click to view all New Leads"
            >
              <span className="text-[10px] font-medium leading-none">New Leads</span>
              <span className="text-xs font-bold leading-tight">
                {newLeads} <span className="text-[10px] font-normal opacity-90">(100%)</span>
              </span>
            </div>

            {/* Stage 2: Qualified */}
            <div
              onClick={() => onDrillDown('qualified')}
              className="flex h-11 w-[78%] cursor-pointer flex-col items-center justify-center bg-[#10B981] text-white shadow-xs transition-transform hover:scale-102"
              style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}
              title="Click to view Qualified Leads"
            >
              <span className="text-[10px] font-medium leading-none">Qualified</span>
              <span className="text-xs font-bold leading-tight">
                {qualified} <span className="text-[10px] font-normal opacity-90">({qualifiedPct}%)</span>
              </span>
            </div>

            {/* Stage 3: Converted */}
            <div
              onClick={() => onDrillDown('converted')}
              className="flex h-10 w-[58%] cursor-pointer flex-col items-center justify-center bg-[#F59E0B] text-white shadow-xs transition-transform hover:scale-102"
              style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)' }}
              title="Click to view Converted Leads"
            >
              <span className="text-[10px] font-medium leading-none">Converted</span>
              <span className="text-xs font-bold leading-tight">
                {converted} <span className="text-[10px] font-normal opacity-90">({convertedPct}%)</span>
              </span>
            </div>
          </div>

          {/* Off to the right: Unqualified Callout */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div
              onClick={() => onDrillDown('unqualified')}
              className="flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-[#C084FC] bg-[#F5F3FF] p-2 text-center transition-all hover:bg-[#EDE9FE]"
              title="Click to view Unqualified Leads"
            >
              <span className="text-[10px] font-semibold text-[#8B5CF6]">Unqualified</span>
              <span className="text-xs font-bold text-[#6D28D9]">{unqualified}</span>
              <span className="text-[9px] text-[#A855F7]">({unqualifiedPct}%)</span>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-[#94A3B8]">
          Click stages to inspect lead cohort
        </div>
      </div>

      {/* 3. Daily Lead Trend */}
      <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#0F172A]">Daily Lead Trend</div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 font-medium text-[#2563EB]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" /> New Leads
            </span>
            <span className="flex items-center gap-1 font-medium text-[#10B981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Qualified
            </span>
            <span className="flex items-center gap-1 font-medium text-[#F59E0B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" /> Converted
            </span>
          </div>
        </div>

        <div className="my-auto h-48 w-full pt-2">
          {dailyLeadTrend.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-[#94A3B8]">
              No trend data for selected range
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyLeadTrend} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  interval={Math.ceil(dailyLeadTrend.length / 7)}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                  itemStyle={{ padding: '1px 0' }}
                />
                <Line
                  type="monotone"
                  dataKey="newLeads"
                  name="New Leads"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#2563EB' }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="qualified"
                  name="Qualified"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#10B981' }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="converted"
                  name="Converted"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#F59E0B' }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 4. Lead Sources Donut Chart */}
      <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
        <div className="text-xs font-bold text-[#0F172A]">Lead Sources</div>

        <div className="my-auto flex items-center justify-between gap-2">
          {/* Donut Chart with center label */}
          <div className="relative h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSources}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  stroke="#fff"
                  strokeWidth={2}
                  onClick={(entry) => onDrillDown('source', entry.name)}
                >
                  {leadSources.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} leads`, name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold leading-none text-[#0F172A]">
                {totalSources}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                Total Leads
              </span>
            </div>
          </div>

          {/* Right Legend */}
          <div className="flex flex-col gap-1.5 text-xs">
            {leadSources.map((source) => (
              <div
                key={source.name}
                onClick={() => onDrillDown('source', source.name)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded p-1 hover:bg-[#F8FAFC]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-xs text-[#475569]">{source.name}</span>
                </div>
                <div className="text-right text-xs font-semibold text-[#0F172A]">
                  {source.count}{' '}
                  <span className="text-[10px] font-normal text-[#94A3B8]">
                    ({source.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-[10px] text-[#94A3B8]">
          Click slice or item to filter leads
        </div>
      </div>
    </div>
  );
};
