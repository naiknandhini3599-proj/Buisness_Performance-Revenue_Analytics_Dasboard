import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OperationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { opsTeamActivity, orderProgress, currentFiltered, setSelectedOrderId } = useApp();

  const orders = currentFiltered.filteredOrders;
  const totalStagesCompleted = orders.reduce((sum, o) => sum + o.stagesCompleted, 0);
  const totalStages = orders.reduce((sum, o) => sum + o.stagesTotal, 0);
  const pendingStages = totalStages - totalStagesCompleted;
  const overallEfficiency = totalStages > 0 ? Math.round((totalStagesCompleted / totalStages) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
          Operations Team Performance & Stage Fulfillment
        </h1>
        <p className="mt-1 text-xs text-[#64748B]">
          Monitor task dispatch, stage deliverables, compliance milestones, and operational efficiency.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Active Orders</span>
          <div className="mt-1 text-2xl font-bold text-[#0F172A]">{orders.length}</div>
          <div className="text-[10px] text-blue-600 font-semibold">Under fulfillment</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Stages Delivered</span>
          <div className="mt-1 text-2xl font-bold text-emerald-700">{totalStagesCompleted}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">{overallEfficiency}% Completion Rate</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Pending Stages</span>
          <div className="mt-1 text-2xl font-bold text-amber-700">{pendingStages}</div>
          <div className="text-[10px] text-amber-600 font-semibold">In queue</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Overdue SLA</span>
          <div className="mt-1 text-2xl font-bold text-emerald-700">0</div>
          <div className="text-[10px] text-emerald-600 font-semibold">100% on-time delivery</div>
        </div>
      </div>

      {/* Operations Team Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <div className="border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
          <h3 className="text-xs font-bold text-[#0F172A]">Specialist Workload & Throughput</h3>
          <p className="text-[11px] text-[#64748B]">
            Stages completed, in-flight regulatory tasks, and fulfillment performance.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3">Operations Specialist</th>
                <th className="px-4 py-3 text-center">Orders Handled</th>
                <th className="px-4 py-3 text-center">Stages Completed</th>
                <th className="px-4 py-3 text-center">Pending Stages</th>
                <th className="px-4 py-3 text-center">Delayed / Overdue</th>
                <th className="px-4 py-3 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {opsTeamActivity.map((member) => {
                const total = member.stagesCompleted + member.pendingStages;
                const eff = total > 0 ? Math.round((member.stagesCompleted / total) * 100) : 0;
                const initials = member.user.name.split(' ').map((n) => n[0]).join('');

                return (
                  <tr key={member.user.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${member.user.avatarColor}`}>
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#0F172A]">{member.user.name}</div>
                          <div className="text-[10px] text-[#64748B]">{member.user.designation || 'Operations Specialist'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-[#0F172A]">
                      {member.ordersUpdated}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-emerald-600">
                      {member.stagesCompleted}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-amber-600">
                      {member.pendingStages}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-emerald-600">
                      {member.overdueOrders}
                    </td>
                    <td className="px-4 py-3.5 text-right font-black text-[#0F172A]">
                      {eff}%
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
