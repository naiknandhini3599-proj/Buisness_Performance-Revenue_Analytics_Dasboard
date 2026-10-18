import React from 'react';
import {
  SalesMemberStat,
  OpsMemberStat,
  OrderProgressGroup,
} from '../utils/calculations';
import { ActivityLog } from '../types';
import { formatINR } from '../utils/formatters';

interface OperationsAndActivityProps {
  salesActivity: SalesMemberStat[];
  opsActivity: OpsMemberStat[];
  orderProgress: OrderProgressGroup[];
  recentActivities: ActivityLog[];
  onSelectUser: (userId: string) => void;
  onSelectRecord: (type: string, id: string) => void;
  onSelectOrderService: (service: string) => void;
}

export const OperationsAndActivitySection: React.FC<OperationsAndActivityProps> = ({
  salesActivity,
  opsActivity,
  orderProgress,
  recentActivities,
  onSelectUser,
  onSelectRecord,
  onSelectOrderService,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* 1. Sales Team Activity Table */}
      <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#172554]">Sales Team Activity</div>
          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#2563EB]">
            Sales Team
          </span>
        </div>

        <div className="my-2 max-h-56 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-white border-b border-[#DCE6F5] text-[10px] font-semibold text-[#64748B]">
              <tr>
                <th className="pb-1.5">User</th>
                <th className="pb-1.5 text-center">Leads</th>
                <th className="pb-1.5 text-center">Qual.</th>
                <th className="pb-1.5 text-center">Conv.</th>
                <th className="pb-1.5 text-center">%</th>
                <th className="pb-1.5 text-center">Quotes</th>
                <th className="pb-1.5 text-center">Deals</th>
                <th className="pb-1.5 text-right">Deal Val</th>
                <th className="pb-1.5 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {salesActivity.map((member) => {
                const initials = member.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('');

                return (
                  <tr
                    key={member.user.id}
                    onClick={() => onSelectUser(member.user.id)}
                    className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${member.user.avatarColor}`}
                        >
                          {initials}
                        </div>
                        <span className="font-medium text-[#1E293B] truncate max-w-[80px]">
                          {member.user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-center text-[#475569]">{member.leadsHandled}</td>
                    <td className="py-2 text-center text-emerald-600 font-medium">
                      {member.qualified}
                    </td>
                    <td className="py-2 text-center text-amber-600 font-medium">
                      {member.converted}
                    </td>
                    <td className="py-2 text-center font-semibold text-[#172554]">
                      {member.conversionRate}%
                    </td>
                    <td className="py-2 text-center text-[#475569]">{member.quotations}</td>
                    <td className="py-2 text-center font-medium text-[#2563EB]">{member.deals}</td>
                    <td className="py-2 text-right font-medium text-[#475569]">
                      {formatINR(member.dealValue)}
                    </td>
                    <td className="py-2 text-right font-bold text-[#172554]">
                      {formatINR(member.revenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center text-[10px] text-[#94A3B8]">
          Click team member to isolate individual sales pipeline
        </div>
      </div>

      {/* 2. Operations Team Activity Table */}
      <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#172554]">Operations Team Activity</div>
          <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#8B5CF6]">
            Operations
          </span>
        </div>

        <div className="my-2 max-h-56 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-white border-b border-[#DCE6F5] text-[10px] font-semibold text-[#64748B]">
              <tr>
                <th className="pb-1.5">User</th>
                <th className="pb-1.5 text-center">Orders Updated</th>
                <th className="pb-1.5 text-center">Stages Completed</th>
                <th className="pb-1.5 text-center">Pending Stages</th>
                <th className="pb-1.5 text-center">Overdue Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {opsActivity.map((member) => {
                const initials = member.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('');

                return (
                  <tr
                    key={member.user.id}
                    onClick={() => onSelectUser(member.user.id)}
                    className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${member.user.avatarColor}`}
                        >
                          {initials}
                        </div>
                        <span className="font-medium text-[#1E293B] truncate max-w-[90px]">
                          {member.user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-center font-semibold text-[#172554]">
                      {member.ordersUpdated}
                    </td>
                    <td className="py-2 text-center text-emerald-600 font-medium">
                      {member.stagesCompleted}
                    </td>
                    <td className="py-2 text-center text-amber-600 font-medium">
                      {member.pendingStages}
                    </td>
                    <td className="py-2 text-center font-bold text-rose-600">
                      {member.overdueOrders}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center text-[10px] text-[#94A3B8]">
          Click specialist to audit task progress & dispatch
        </div>
      </div>

      {/* 3. Orders & Stage Progress */}
      <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#172554]">Orders & Stage Progress</div>
          <div className="flex items-center gap-2 text-[9px]">
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" /> Pending
            </span>
            <span className="flex items-center gap-1 text-[#06B6D4]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4]" /> In Progress
            </span>
            <span className="flex items-center gap-1 text-[#10B981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Completed
            </span>
            <span className="flex items-center gap-1 text-[#EF4444]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" /> On Hold
            </span>
          </div>
        </div>

        {/* Stacked stage bars list */}
        <div className="my-2 flex flex-col gap-2.5 max-h-56 overflow-y-auto">
          {orderProgress.slice(0, 5).map((group) => {
            const total = group.total || 1;
            const pendingPct = (group.pending / total) * 100;
            const inProgPct = (group.inProgress / total) * 100;
            const compPct = (group.completed / total) * 100;
            const holdPct = (group.onHold / total) * 100;

            return (
              <div
                key={group.service}
                onClick={() => onSelectOrderService(group.service)}
                className="group cursor-pointer rounded p-1 hover:bg-[#F8FAFC]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#334155] truncate max-w-[150px]">
                    {group.service}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-semibold">
                    <span className="text-[#F59E0B]">{group.pending}</span>
                    <span className="text-[#06B6D4]">{group.inProgress}</span>
                    <span className="text-[#10B981]">{group.completed}</span>
                    <span className="text-[#EF4444]">{group.onHold}</span>
                    <span className="ml-1 text-[#172554] font-bold">{group.total}</span>
                  </div>
                </div>

                {/* Stacked Bar */}
                <div className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  {pendingPct > 0 && (
                    <div
                      style={{ width: `${pendingPct}%` }}
                      className="bg-[#F59E0B] h-full"
                      title={`Pending: ${group.pending}`}
                    />
                  )}
                  {inProgPct > 0 && (
                    <div
                      style={{ width: `${inProgPct}%` }}
                      className="bg-[#06B6D4] h-full"
                      title={`In Progress: ${group.inProgress}`}
                    />
                  )}
                  {compPct > 0 && (
                    <div
                      style={{ width: `${compPct}%` }}
                      className="bg-[#10B981] h-full"
                      title={`Completed: ${group.completed}`}
                    />
                  )}
                  {holdPct > 0 && (
                    <div
                      style={{ width: `${holdPct}%` }}
                      className="bg-[#EF4444] h-full"
                      title={`On Hold: ${group.onHold}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-[10px] text-[#94A3B8]">
          Click category to audit operational stage fulfillment
        </div>
      </div>

      {/* 4. Recent CRM Activity Feed */}
      <div className="flex flex-col justify-between rounded-xl border border-[#DCE6F5] bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#172554]">Recent CRM Activity</div>
          <span className="text-[10px] text-[#64748B]">Real-time events</span>
        </div>

        <div className="my-2 max-h-56 overflow-y-auto">
          <table className="w-full text-left text-[10px]">
            <thead className="sticky top-0 bg-white border-b border-[#DCE6F5] text-[9px] font-semibold text-[#64748B]">
              <tr>
                <th className="pb-1">Time</th>
                <th className="pb-1">Employee</th>
                <th className="pb-1">Action</th>
                <th className="pb-1 text-right">Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {recentActivities.slice(0, 7).map((act) => {
                const initials = act.employeeName
                  .split(' ')
                  .map((n) => n[0])
                  .join('');

                return (
                  <tr key={act.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-1.5 text-[#64748B] font-mono text-[9px]">
                      {act.timestamp.substring(11, 19)}
                    </td>
                    <td className="py-1.5">
                      <div className="flex items-center gap-1">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[8px] font-bold text-slate-700">
                          {initials}
                        </span>
                        <span className="truncate max-w-[65px] font-medium text-[#1E293B]">
                          {act.employeeName}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 text-[#475569]">{act.action}</td>
                    <td className="py-1.5 text-right">
                      <button
                        onClick={() => onSelectRecord(act.recordType, act.recordId)}
                        className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[#2563EB] hover:bg-blue-100 transition-colors"
                        title={`Click to open ${act.recordType} ${act.recordId}`}
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

        <div className="text-center text-[10px] text-[#94A3B8]">
          Click record tag to drill down instantly
        </div>
      </div>
    </div>
  );
};
