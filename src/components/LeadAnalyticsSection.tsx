import React from 'react';
import { Link } from 'react-router-dom';
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
import { Target, TrendingUp, Filter, Users, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import {
  DailyTrendPoint,
  LeadSourceStat,
  calculateTargetAchievement,
} from '../utils/calculations';
import { PeriodKpiData } from '../types';
import { DEFAULT_MONTHLY_TARGET } from '../data/dummyData';

interface LeadAnalyticsSectionProps {
  currentKpi: PeriodKpiData;
  leadSources: LeadSourceStat[];
  dailyLeadTrend: DailyTrendPoint[];
  monthlyTarget: number;
  onDrillDown: (
    type: 'leads' | 'qualified' | 'converted' | 'unqualified' | 'source',
    meta?: string
  ) => void;
}

export const LeadAnalyticsSection: React.FC<LeadAnalyticsSectionProps> = ({
  currentKpi,
  leadSources,
  dailyLeadTrend,
  monthlyTarget,
  onDrillDown,
}) => {
  // Single source of truth calculation for Target Achievement
  const effectiveTarget =
    monthlyTarget !== undefined && monthlyTarget !== null
      ? monthlyTarget
      : DEFAULT_MONTHLY_TARGET;

  const targetStats = calculateTargetAchievement(currentKpi.totalCollected, effectiveTarget);

  // Funnel numbers
  const newLeads = currentKpi.newLeads;
  const qualified = currentKpi.qualifiedLeads;
  const converted = currentKpi.convertedLeads;
  const unqualified = currentKpi.unqualifiedLeads;

  const qualifiedPct = newLeads > 0 ? ((qualified / newLeads) * 100).toFixed(1) : '0.0';
  const convertedPct = newLeads > 0 ? ((converted / newLeads) * 100).toFixed(1) : '0.0';
  const unqualifiedPct = newLeads > 0 ? ((unqualified / newLeads) * 100).toFixed(1) : '0.0';

  const totalSources = leadSources.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* 1. Target Achievement Card */}
      <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#172554]">
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-[#2563EB]" />
              <span>Target Achievement</span>
            </div>
            <Link
              to="/app/settings"
              className="text-[10px] text-[#2563EB] hover:text-[#1D4ED8] font-bold"
            >
              Configure
            </Link>
          </div>

          <div className="mt-3.5">
            <span className="text-[11px] font-semibold text-[#64748B]">Monthly Revenue Target</span>
            <div className="text-2xl font-black tracking-tight text-[#172554]">
              {targetStats.isConfigured ? formatINR(targetStats.monthlyTarget) : 'Target Not Configured'}
            </div>
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                <span className="text-[#64748B] font-medium">Collected Revenue</span>
              </div>
              <span className="font-bold text-[#172554]">{formatINR(targetStats.actualRevenue)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                <span className="text-[#64748B] font-medium">Target Achievement</span>
              </div>
              <span className="font-extrabold text-[#2563EB]">
                {targetStats.isConfigured ? `${targetStats.achievementPercentage}%` : 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#94A3B8]" />
                <span className="text-[#64748B] font-medium">
                  {targetStats.isExceeded ? 'Exceeded by' : 'Remaining Target'}
                </span>
              </div>
              <span className="font-semibold text-[#64748B]">
                {targetStats.isExceeded
                  ? formatINR(targetStats.actualRevenue - targetStats.monthlyTarget)
                  : formatINR(targetStats.remainingAmount)}
              </span>
            </div>
          </div>

          {/* Accessible Dynamic Progress Bar */}
          <div className="mt-3">
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-[#EAF2FF]"
              role="progressbar"
              aria-valuenow={targetStats.achievementPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Monthly Revenue Target Progress"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  targetStats.isExceeded ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-[#10B981]'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, targetStats.achievementPercentage))}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-[#64748B] font-semibold">
              <span>0%</span>
              <span>Progress: {targetStats.achievementPercentage}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Funnel visual indicator */}
        <div className="mt-4 border-t border-[#F1F5F9] pt-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B]">
            <span>Cash Collection Pacing</span>
            <span
              className={`font-extrabold ${
                targetStats.achievementPercentage >= 50
                  ? 'text-emerald-600'
                  : 'text-[#2563EB]'
              }`}
            >
              {targetStats.isExceeded ? 'Target Surpassed' : `${targetStats.remainingPercentage}% left`}
            </span>
          </div>
          <div className="mt-2 flex h-20 items-center justify-center">
            <div className="relative flex w-36 flex-col items-center">
              {/* Top: Remaining / Capacity */}
              <div
                className="relative flex h-11 w-full items-center justify-center bg-[#3B82F6] text-white shadow-xs rounded-t"
                style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}
              >
                <div className="text-center">
                  <div className="text-[9px] font-medium opacity-90">
                    {targetStats.isExceeded ? 'Surplus' : 'Remaining'}
                  </div>
                  <div className="text-[10px] font-bold">
                    {targetStats.isExceeded
                      ? `+${(targetStats.achievementPercentage - 100).toFixed(1)}%`
                      : `${targetStats.remainingPercentage}%`}
                  </div>
                </div>
              </div>
              {/* Bottom: Realized Collections */}
              <div
                className="relative -mt-0.5 flex h-9 w-[75%] items-center justify-center bg-[#1D4ED8] text-white rounded-b"
                style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)' }}
              >
                <div className="text-center">
                  <div className="text-[8px] font-medium opacity-90">Realized</div>
                  <div className="text-[9px] font-extrabold">{targetStats.achievementPercentage}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lead Conversion Funnel */}
      <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#172554]">
            <div className="flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-[#2563EB]" />
              <span>Lead Qualification Funnel</span>
            </div>
            <button
              onClick={() => onDrillDown('leads')}
              className="text-[10px] text-[#2563EB] hover:text-[#1D4ED8] font-bold"
            >
              All Leads
            </button>
          </div>
          <p className="mt-1 text-[11px] text-[#64748B]">Pipeline conversion breakdown</p>

          <div className="mt-3.5 space-y-2.5">
            {/* Stage 1: Inbound */}
            <div
              onClick={() => onDrillDown('leads')}
              className="group cursor-pointer rounded-lg border border-[#DCE6F5] bg-[#F8FAFC] p-2 hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#172554]">1. Inbound Leads</span>
                <span className="font-bold text-[#172554]">{newLeads}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Stage 2: Qualified */}
            <div
              onClick={() => onDrillDown('qualified')}
              className="group cursor-pointer rounded-lg border border-[#DCE6F5] bg-[#F8FAFC] p-2 hover:bg-[#ECFDF5] hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#172554]">2. Qualified Prospects</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-600">({qualifiedPct}%)</span>
                  <span className="font-bold text-[#172554]">{qualified}</span>
                </div>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, Number(qualifiedPct))}%` }}
                />
              </div>
            </div>

            {/* Stage 3: Converted */}
            <div
              onClick={() => onDrillDown('converted')}
              className="group cursor-pointer rounded-lg border border-[#DCE6F5] bg-[#F8FAFC] p-2 hover:bg-[#FAF5FF] hover:border-purple-200 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#172554]">3. Converted to Deals</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-purple-600">({convertedPct}%)</span>
                  <span className="font-bold text-[#172554]">{converted}</span>
                </div>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${Math.min(100, Number(convertedPct))}%` }}
                />
              </div>
            </div>

            {/* Stage 4: Unqualified */}
            <div
              onClick={() => onDrillDown('unqualified')}
              className="group cursor-pointer rounded-lg border border-[#DCE6F5] bg-[#F8FAFC] p-2 hover:bg-[#FFF1F2] hover:border-rose-200 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#172554]">4. Unqualified / Dropped</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-rose-600">({unqualifiedPct}%)</span>
                  <span className="font-bold text-[#172554]">{unqualified}</span>
                </div>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${Math.min(100, Number(unqualifiedPct))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-[#F1F5F9] pt-2 text-center text-[10px] text-[#64748B]">
          Effective Win Rate:{' '}
          <strong className="text-[#2563EB] font-bold">{currentKpi.conversionRate}%</strong>
        </div>
      </div>

      {/* 3. Lead Sources Distribution (Donut Pie) */}
      <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#172554]">
            <span>Lead Source Channels</span>
            <span className="text-[10px] text-[#64748B] font-semibold">{totalSources} Total</span>
          </div>
          <p className="mt-1 text-[11px] text-[#64748B]">Acquisition attribution</p>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSources}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={58}
                  paddingAngle={3}
                  onClick={(entry) => onDrillDown('source', entry.source)}
                  className="cursor-pointer"
                >
                  {leadSources.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} leads`, name]}
                  contentStyle={{
                    backgroundColor: '#071426',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 border-t border-[#F1F5F9] pt-2.5 text-[10px]">
          {leadSources.slice(0, 4).map((s) => (
            <div
              key={s.source}
              onClick={() => onDrillDown('source', s.source)}
              className="flex items-center justify-between p-1 rounded hover:bg-[#F8FAFC] cursor-pointer"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[#475569] truncate">{s.source}</span>
              </div>
              <span className="font-bold text-[#172554]">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Daily Lead Creation Trend */}
      <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#172554]">
            <span>Daily Lead Creation Velocity</span>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-[#2563EB] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" /> Total
              </span>
              <span className="flex items-center gap-1 text-[#10B981] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Qualified
              </span>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-[#64748B]">Velocity over selected reporting period</p>

          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyLeadTrend} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#DCE6F5' }}
                  interval={Math.ceil(dailyLeadTrend.length / 5)}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#DCE6F5' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071426',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="newLeads"
                  name="Total Leads"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="qualified"
                  name="Qualified"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 border-t border-[#F1F5F9] pt-2 text-center text-[10px] text-[#64748B]">
          Daily intake pacing & discovery rate
        </div>
      </div>
    </div>
  );
};
