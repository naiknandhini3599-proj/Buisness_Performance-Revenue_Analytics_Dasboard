import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Users,
  Target,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const SalesActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const { salesTeamActivity, updateFilter, filters } = useApp();

  const handleSelectRep = (repId: string) => {
    updateFilter({ userId: repId });
    navigate('/app/dashboard');
  };

  const chartData = salesTeamActivity.map((m) => ({
    name: m.user.name.split(' ')[0],
    fullName: m.user.name,
    leads: m.leadsHandled,
    converted: m.converted,
    revenue: m.revenue,
    dealValue: m.dealValue,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
          Sales Team Performance & Attribution
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Direct pipeline attribution and revenue metrics calculated from verifiable customer contracts.
        </p>
      </div>

      {/* Chart: Comparative Revenue by Consultant */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#0F172A]">Recognized Deal Value vs Realized Collections by Consultant</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-[#2563EB] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]" /> Deal Value (₹)
            </span>
            <span className="flex items-center gap-1 text-[#10B981] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Collected (₹)
            </span>
          </div>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
              <Tooltip
                formatter={(val: any, name: any) => [formatINR(Number(val)), name]}
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
              />
              <Bar dataKey="dealValue" name="Deal Value" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" name="Collected" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Comparison Table (Section 27G Requirement) */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
          <div>
            <h3 className="text-xs font-bold text-[#0F172A]">Consultant Performance Ranking</h3>
            <p className="text-[11px] text-[#64748B]">
              Ranked by total inquiries handled and recognized deal revenue. Click any row to isolate that employee.
            </p>
          </div>
          {filters.userId !== 'all' && (
            <span className="rounded bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-[#2563EB]">
              Currently isolated
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3">Rank & Consultant</th>
                <th className="px-4 py-3 text-center">Assigned Leads</th>
                <th className="px-4 py-3 text-center">Qualified</th>
                <th className="px-4 py-3 text-center">Converted</th>
                <th className="px-4 py-3 text-center">Conv. Rate</th>
                <th className="px-4 py-3 text-center">Quotations</th>
                <th className="px-4 py-3 text-center">Deals Won</th>
                <th className="px-4 py-3 text-right">Recognized Deal Value</th>
                <th className="px-4 py-3 text-right">Collected Revenue</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {salesTeamActivity.map((member, idx) => {
                const initials = member.user.name.split(' ').map((n) => n[0]).join('');
                const isSelected = filters.userId === member.user.id;

                return (
                  <tr
                    key={member.user.id}
                    onClick={() => handleSelectRep(member.user.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                          #{idx + 1}
                        </span>
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${member.user.avatarColor}`}>
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#0F172A]">{member.user.name}</div>
                          <div className="text-[10px] text-[#64748B]">{member.user.designation || 'Consultant'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-[#0F172A]">
                      {member.leadsHandled}
                    </td>
                    <td className="px-4 py-3.5 text-center text-emerald-600 font-semibold">
                      {member.qualified}
                    </td>
                    <td className="px-4 py-3.5 text-center text-amber-600 font-semibold">
                      {member.converted}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-[#0F172A]">
                      {member.conversionRate}%
                    </td>
                    <td className="px-4 py-3.5 text-center text-[#475569]">
                      {member.quotations}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-[#2563EB]">
                      {member.deals}
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-[#475569]">
                      {formatINR(member.dealValue)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-black text-[#0F172A]">
                      {formatINR(member.revenue)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-[#EFF6FF] px-2 py-1 text-[10px] font-bold text-[#2563EB] hover:bg-blue-100">
                        <span>Filter Dashboard</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
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
