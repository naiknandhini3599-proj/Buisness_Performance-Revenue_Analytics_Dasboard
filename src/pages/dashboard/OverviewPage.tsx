import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Layers,
  DollarSign,
  Building2,
  TrendingUp,
  FileText,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Filter,
  Activity,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCardsRow } from '../../components/KpiCardsRow';
import { LeadAnalyticsSection } from '../../components/LeadAnalyticsSection';
import { QuotationAnalyticsSection } from '../../components/QuotationAnalyticsSection';
import { DealsRevenueSection } from '../../components/DealsRevenueSection';
import { OperationsAndActivitySection } from '../../components/OperationsAndActivitySection';
import { FinanceAnalyticsSection } from '../../components/FinanceAnalyticsSection';
import { formatINR } from '../../utils/formatters';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    filters,
    updateFilter,
    resetFilters,
    comparison,
    currentFiltered,
    monthlyTarget,
    leadSources,
    dailyLeadTrend,
    quotationCategories,
    dealsVsRevenue,
    revenueCategories,
    priorityBreakdown,
    dailyRevenueTrend,
    salesTeamActivity,
    opsTeamActivity,
    orderProgress,
    paymentMethods,
    invoiceStatuses,
    users,
    setSelectedLeadId,
    setSelectedQuotationId,
    setSelectedDealId,
    setSelectedOrderId,
    setSelectedPaymentId,
  } = useApp();

  const activeDepartment = filters.department || 'all';
  const activeUser = users.find((u) => u.id === filters.userId);

  const handleCardClick = (metric: string) => {
    if (
      metric === 'newLeads' ||
      metric === 'qualifiedLeads' ||
      metric === 'convertedLeads' ||
      metric === 'unqualifiedLeads' ||
      metric === 'conversionRate'
    ) {
      navigate('/app/leads');
    } else if (metric === 'quotationsCreated') {
      navigate('/app/quotations');
    } else if (metric === 'dealsCreated' || metric === 'totalDealValue') {
      navigate('/app/deals');
    } else if (
      metric === 'totalOrders' ||
      metric === 'ordersInProgress' ||
      metric === 'ordersCompleted' ||
      metric === 'ordersPending' ||
      metric === 'orderCompletionRate'
    ) {
      navigate('/app/orders');
    } else if (
      metric === 'invoicesGenerated' ||
      metric === 'totalInvoiced' ||
      metric === 'totalCollected' ||
      metric === 'outstandingRevenue'
    ) {
      navigate('/app/orders');
    }
  };

  const handleSelectRecord = (type: string, id: string) => {
    const cleanId = id.replace('#', '').trim();
    if (type === 'Lead') setSelectedLeadId(cleanId);
    else if (type === 'Quotation') setSelectedQuotationId(cleanId);
    else if (type === 'Deal') setSelectedDealId(cleanId);
    else if (type === 'Order') setSelectedOrderId(cleanId);
    else if (type === 'Payment') setSelectedPaymentId(cleanId);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Title & Department Quick-Switcher Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#0F2042] sm:text-2xl">
              {activeDepartment === 'all' && 'Executive Business Overview'}
              {activeDepartment === 'Sales' && 'Sales Performance & Lead Pipeline'}
              {activeDepartment === 'Operations' && 'Operations & Fulfillment Velocity'}
              {activeDepartment === 'Finance' && 'Finance, Invoicing & Collections'}
            </h1>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
              {activeDepartment === 'all'
                ? 'All Departments'
                : `${activeDepartment} Department`}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#64748B]">
            {activeDepartment === 'all' &&
              'Consolidated analytics across Sales lead acquisition, Operational fulfillment, and Financial cash collections.'}
            {activeDepartment === 'Sales' &&
              'Tracking incoming client leads, qualification rates, quotation approvals, deal close velocity, and sales representative quota.'}
            {activeDepartment === 'Operations' &&
              'Active fulfillment orders, stage-by-stage MCA compliance progress, and specialist queue capacity.'}
            {activeDepartment === 'Finance' &&
              'Tax invoice generation, cash remittance realization, accounts receivable aging, and bank reconciliations.'}
          </p>
        </div>

        {/* Department Quick Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-[#D5E2F1] bg-[#E8F0FE]/70 p-1 shadow-2xs">
          <button
            onClick={() => {
              if (activeUser && activeUser.department !== 'Sales') {
                updateFilter({ department: 'all', userId: 'all' });
              } else {
                updateFilter({ department: 'all' });
              }
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeDepartment === 'all'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F2042]'
            }`}
          >
            All Departments
          </button>
          <button
            onClick={() => {
              if (activeUser && activeUser.department !== 'Sales') {
                updateFilter({ department: 'Sales', userId: 'all' });
              } else {
                updateFilter({ department: 'Sales' });
              }
            }}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeDepartment === 'Sales'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F2042]'
            }`}
          >
            <Users className="h-3 w-3" />
            <span>Sales</span>
          </button>
          <button
            onClick={() => {
              if (activeUser && activeUser.department !== 'Operations') {
                updateFilter({ department: 'Operations', userId: 'all' });
              } else {
                updateFilter({ department: 'Operations' });
              }
            }}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeDepartment === 'Operations'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F2042]'
            }`}
          >
            <Activity className="h-3 w-3" />
            <span>Operations</span>
          </button>
          <button
            onClick={() => {
              if (activeUser && activeUser.department !== 'Finance') {
                updateFilter({ department: 'Finance', userId: 'all' });
              } else {
                updateFilter({ department: 'Finance' });
              }
            }}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeDepartment === 'Finance'
                ? 'bg-white text-[#2563EB] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F2042]'
            }`}
          >
            <Building2 className="h-3 w-3" />
            <span>Finance</span>
          </button>
        </div>
      </div>

      {/* Active User Attribution Alert (if an employee filter is active) */}
      {filters.userId !== 'all' && activeUser && (
        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2.5 text-xs text-blue-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Filtering for employee:</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 font-bold text-blue-700 border border-blue-200">
              <span className={`h-2 w-2 rounded-full ${activeUser.avatarColor}`} />
              {activeUser.name} ({activeUser.department} Department · {activeUser.designation})
            </span>
          </div>
          <button
            onClick={() => updateFilter({ userId: 'all' })}
            className="font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
          >
            Clear Employee Filter
          </button>
        </div>
      )}

      {/* 2. Top 8 KPI Cards (Tailored dynamically to the active department) */}
      <KpiCardsRow
        comparison={comparison}
        department={activeDepartment}
        onCardClick={handleCardClick}
      />

      {/* 3. DEPARTMENT-SPECIFIC DASHBOARD SECTIONS */}

      {/* CASE A: OPERATIONS DEPARTMENT VIEW */}
      {activeDepartment === 'Operations' && (
        <div className="space-y-6">
          {/* Operations Fulfillment Workload & Orders Progress */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Order Progress by Service (2 cols) */}
            <div className="rounded-xl border border-[#D5E2F1] bg-white p-5 shadow-xs lg:col-span-2">
              <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F2042]">
                      Order Fulfillment Progress by Service
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Active fulfillment orders categorized by legal & corporate registration type
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/app/orders')}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <span>Orders Table</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5">
                {orderProgress.map((group) => {
                  const compPct =
                    group.total > 0
                      ? Math.round((group.completed / group.total) * 100)
                      : 0;
                  const inProgPct =
                    group.total > 0
                      ? Math.round((group.inProgress / group.total) * 100)
                      : 0;

                  return (
                    <div key={group.service} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#0F2042]">{group.service}</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-[#64748B]">
                            {group.total} total
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-emerald-600 font-medium">
                            {group.completed} Done
                          </span>
                          <span className="text-amber-600 font-medium">
                            {group.inProgress} In Progress
                          </span>
                          <span className="text-slate-500 font-medium">
                            {group.pending} Queued
                          </span>
                        </div>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          style={{ width: `${compPct}%` }}
                          className="bg-emerald-500 transition-all duration-300"
                          title={`Completed: ${compPct}%`}
                        />
                        <div
                          style={{ width: `${inProgPct}%` }}
                          className="bg-amber-400 transition-all duration-300"
                          title={`In Progress: ${inProgPct}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operations Specialist Queue & Capacity (1 col) */}
            <div className="rounded-xl border border-[#D5E2F1] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F2042]">Operations Specialists</h3>
                    <p className="text-[11px] text-[#64748B]">Fulfillment capacity</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {opsTeamActivity.map((member) => (
                  <div
                    key={member.user.id}
                    onClick={() => updateFilter({ userId: member.user.id })}
                    className="rounded-lg border border-[#E2E8F0] p-3.5 hover:border-blue-300 hover:bg-[#F8FAFC] transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${member.user.avatarColor}`}
                        >
                          {member.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F2042]">
                            {member.user.name}
                          </div>
                          <div className="text-[10px] text-[#64748B]">
                            {member.user.designation}
                          </div>
                        </div>
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        {member.completionRate}% SLA
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#F1F5F9] pt-2.5 text-center text-[11px]">
                      <div>
                        <div className="text-[#64748B]">Managed</div>
                        <div className="font-bold text-[#0F2042]">{member.totalOrders} Orders</div>
                      </div>
                      <div>
                        <div className="text-[#64748B]">Completed</div>
                        <div className="font-bold text-emerald-600">
                          {member.completedOrders} Done
                        </div>
                      </div>
                      <div>
                        <div className="text-[#64748B]">In Progress</div>
                        <div className="font-bold text-amber-600">
                          {member.inProgressOrders} Active
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-blue-50/70 border border-blue-100 p-3 text-[11px] text-blue-900">
                <span className="font-bold">Team SLA:</span> 100% of corporate filings processed within standard Ministry of Corporate Affairs (MCA) 72-hour window.
              </div>
            </div>
          </div>

          {/* Operational Activities Log & Active Orders Strip */}
          <div className="rounded-xl border border-[#D5E2F1] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-[#0F2042]">
                  Recent Operational Milestones & Fulfillment Logs
                </h3>
              </div>
              <span className="text-xs text-[#64748B]">
                Showing {currentFiltered.filteredActivities.length} logs
              </span>
            </div>

            <div className="mt-3 divide-y divide-[#F1F5F9] max-h-72 overflow-y-auto">
              {currentFiltered.filteredActivities.slice(0, 8).map((act) => (
                <div key={act.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-[#0F2042]">
                        {act.action} ·{' '}
                        <span className="font-mono text-blue-600">{act.recordId}</span>
                      </div>
                      <div className="text-[11px] text-[#64748B] mt-0.5">{act.details}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-medium text-[#64748B]">
                      {act.employeeName}
                    </div>
                    <div className="text-[10px] text-[#94A3B8]">
                      {new Date(act.timestamp).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informative Guidance Banner */}
          <div className="rounded-xl border border-[#D5E2F1] bg-[#F0F6FF] p-4 text-xs text-[#1E3A8A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <strong className="font-bold">Commercial & Pre-Sales Pipeline Note:</strong> Initial customer inquiry intake and commercial quotation proposals are managed by the Sales department.
            </div>
            <button
              onClick={() => updateFilter({ department: 'Sales', userId: 'all' })}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 whitespace-nowrap cursor-pointer"
            >
              Switch to Sales
            </button>
          </div>
        </div>
      )}

      {/* CASE B: FINANCE DEPARTMENT VIEW */}
      {activeDepartment === 'Finance' && (
        <div className="space-y-6">
          <FinanceAnalyticsSection
            currentKpi={comparison.current}
            dailyRevenueTrend={dailyRevenueTrend}
            paymentMethods={paymentMethods}
            invoiceStatuses={invoiceStatuses}
            recentPayments={currentFiltered.filteredPayments}
            recentInvoices={currentFiltered.filteredInvoices}
            onSelectPayment={(id) => setSelectedPaymentId(id)}
            onOpenOrdersPage={() => navigate('/app/orders')}
          />

          {/* Informative Guidance Banner */}
          <div className="rounded-xl border border-[#D5E2F1] bg-[#F0F6FF] p-4 text-xs text-[#1E3A8A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <strong className="font-bold">Sales Negotiation & Lead Pipeline Note:</strong> Pre-sales deal discussions and commercial proposals are managed by the Sales team. Finance tracks recognized invoices and cash collection velocity.
            </div>
            <button
              onClick={() => updateFilter({ department: 'Sales', userId: 'all' })}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 whitespace-nowrap cursor-pointer"
            >
              Switch to Sales
            </button>
          </div>
        </div>
      )}

      {/* CASE C: SALES DEPARTMENT VIEW */}
      {activeDepartment === 'Sales' && (
        <div className="space-y-6">
          {/* Row 1: Lead Analytics & Monthly Sales Target */}
          <LeadAnalyticsSection
            currentKpi={comparison.current}
            leadSources={leadSources}
            dailyLeadTrend={dailyLeadTrend}
            monthlyTarget={monthlyTarget}
            onDrillDown={() => navigate('/app/leads')}
          />

          {/* Row 2: Quotation Analytics */}
          <QuotationAnalyticsSection
            categoryStats={quotationCategories}
            totalQuotations={comparison.current.quotationsCreated}
            totalDeals={comparison.current.dealsCreated}
            onSelectService={() => navigate('/app/quotations')}
            onOpenQuotationList={() => navigate('/app/quotations')}
          />

          {/* Row 3: Commercial Deals & Sales Revenue */}
          <DealsRevenueSection
            currentKpi={comparison.current}
            dealsVsRevenue={dealsVsRevenue}
            revenueCategories={revenueCategories}
            priorityBreakdown={priorityBreakdown}
            dailyRevenueTrend={dailyRevenueTrend}
            onDrillDown={() => navigate('/app/deals')}
          />

          {/* Row 4: Sales Team Leaderboard & Performance */}
          <div className="rounded-xl border border-[#D5E2F1] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-[#0F2042]">
                  Sales Representatives Leaderboard & Quota Velocity
                </h3>
              </div>
              <button
                onClick={() => navigate('/app/sales-activity')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Rep Ranking</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B]">
                    <th className="pb-2">Sales Representative</th>
                    <th className="pb-2 text-center">Leads Handled</th>
                    <th className="pb-2 text-center">Qualified</th>
                    <th className="pb-2 text-center">Converted</th>
                    <th className="pb-2 text-center">Conv %</th>
                    <th className="pb-2 text-center">Quotations</th>
                    <th className="pb-2 text-center">Deals Won</th>
                    <th className="pb-2 text-right">Recognized Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {salesTeamActivity.map((member) => (
                    <tr
                      key={member.user.id}
                      onClick={() => updateFilter({ userId: member.user.id })}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${member.user.avatarColor}`}
                          >
                            {member.user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <span className="font-semibold text-[#0F2042] group-hover:text-blue-600">
                              {member.user.name}
                            </span>
                            <span className="text-[10px] text-[#64748B] block">
                              {member.user.designation}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-center text-[#475569]">{member.leadsHandled}</td>
                      <td className="py-2.5 text-center font-medium text-emerald-600">
                        {member.qualified}
                      </td>
                      <td className="py-2.5 text-center font-medium text-amber-600">
                        {member.converted}
                      </td>
                      <td className="py-2.5 text-center font-bold text-[#0F2042]">
                        {member.conversionRate}%
                      </td>
                      <td className="py-2.5 text-center text-[#475569]">{member.quotations}</td>
                      <td className="py-2.5 text-center font-bold text-blue-600">{member.deals}</td>
                      <td className="py-2.5 text-right font-extrabold text-[#0F2042]">
                        {formatINR(member.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Informative Guidance Banner */}
          <div className="rounded-xl border border-[#D5E2F1] bg-[#F0F6FF] p-4 text-xs text-[#1E3A8A] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <strong className="font-bold">Fulfillment & Invoicing Note:</strong> Corporate incorporation filing is executed by Operations, and invoice collection is monitored by Finance.
            </div>
            <button
              onClick={() => updateFilter({ department: 'Operations', userId: 'all' })}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 whitespace-nowrap cursor-pointer"
            >
              Switch to Operations
            </button>
          </div>
        </div>
      )}

      {/* CASE D: ALL DEPARTMENTS (COMBINED ENTERPRISE OVERVIEW) */}
      {activeDepartment === 'all' && (
        <div className="space-y-6">
          {/* Row 1: Lead Analytics & Targets */}
          <LeadAnalyticsSection
            currentKpi={comparison.current}
            leadSources={leadSources}
            dailyLeadTrend={dailyLeadTrend}
            monthlyTarget={monthlyTarget}
            onDrillDown={() => navigate('/app/leads')}
          />

          {/* Row 2: Quotation Analytics */}
          <QuotationAnalyticsSection
            categoryStats={quotationCategories}
            totalQuotations={comparison.current.quotationsCreated}
            totalDeals={comparison.current.dealsCreated}
            onSelectService={() => navigate('/app/quotations')}
            onOpenQuotationList={() => navigate('/app/quotations')}
          />

          {/* Row 3: Deals & Revenue */}
          <DealsRevenueSection
            currentKpi={comparison.current}
            dealsVsRevenue={dealsVsRevenue}
            revenueCategories={revenueCategories}
            priorityBreakdown={priorityBreakdown}
            dailyRevenueTrend={dailyRevenueTrend}
            onDrillDown={() => navigate('/app/deals')}
          />

          {/* Row 4: Operations & Sales Team Activity */}
          <OperationsAndActivitySection
            salesActivity={salesTeamActivity}
            opsActivity={opsTeamActivity}
            orderProgress={orderProgress}
            recentActivities={currentFiltered.filteredActivities}
            onSelectUser={(userId) => updateFilter({ userId })}
            onSelectRecord={handleSelectRecord}
            onSelectOrderService={() => navigate('/app/orders')}
          />
        </div>
      )}
    </div>
  );
};
