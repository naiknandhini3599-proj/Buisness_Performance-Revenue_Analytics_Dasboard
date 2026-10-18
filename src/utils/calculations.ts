import {
  Lead,
  Quotation,
  Deal,
  Order,
  Invoice,
  Payment,
  ActivityLog,
  FilterState,
  PeriodKpiData,
  DateFilterRange,
} from '../types';
import { USERS } from '../data/dummyData';

export interface ComparisonKpis {
  current: PeriodKpiData;
  previous: PeriodKpiData;
  newLeadsDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  qualifiedLeadsDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  convertedLeadsDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  unqualifiedLeadsDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  conversionRateDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  quotationsDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  dealsDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  totalDealValueDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  invoicesDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  totalOrdersDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  ordersInProgressDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  ordersCompletedDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  orderCompletionRateDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  totalOrderValueDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  orderProgressRateDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  totalInvoicedDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  totalCollectedDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  outstandingRevenueDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  collectionRateDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  periodDaysLabel: string;
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Calculates start and end for the immediately preceding equivalent period.
 */
export function getPreviousPeriodRange(range: DateFilterRange): {
  startDate: string;
  endDate: string;
  days: number;
} {
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - (diffDays - 1));

  return {
    startDate: prevStart.toISOString().split('T')[0],
    endDate: prevEnd.toISOString().split('T')[0],
    days: diffDays,
  };
}

export function isWithinDateRange(
  dateStr: string,
  startDateStr: string,
  endDateStr: string
): boolean {
  if (!dateStr) return false;
  const d = dateStr.split('T')[0];
  return d >= startDateStr && d <= endDateStr;
}

/**
 * Filter dataset according to active filters (date, user/employee, department)
 * With complete, mathematically accurate employee attribution!
 */
export function filterRecords(
  leads: Lead[],
  quotations: Quotation[],
  deals: Deal[],
  orders: Order[],
  invoices: Invoice[],
  payments: Payment[],
  activities: ActivityLog[],
  filters: FilterState,
  customDateRange?: { startDate: string; endDate: string }
) {
  const startDate = customDateRange ? customDateRange.startDate : filters.dateRange.startDate;
  const endDate = customDateRange ? customDateRange.endDate : filters.dateRange.endDate;
  const { userId, department } = filters;

  const targetUser = userId !== 'all' ? USERS.find((u) => u.id === userId) : null;

  // 1. Date Filtered Base Records
  const dateLeads = leads.filter((l) => isWithinDateRange(l.createdAt, startDate, endDate));
  const dateQuotations = quotations.filter((q) => isWithinDateRange(q.createdAt, startDate, endDate));
  const dateDeals = deals.filter((d) => isWithinDateRange(d.createdAt, startDate, endDate));
  const dateOrders = orders.filter((o) => isWithinDateRange(o.createdAt, startDate, endDate));
  const dateInvoices = invoices.filter((i) => isWithinDateRange(i.issueDate, startDate, endDate));
  const datePayments = payments.filter((p) => isWithinDateRange(p.paymentDate, startDate, endDate));

  // If no user or department filter is active, return all date-matched records
  if (userId === 'all' && department === 'all') {
    const filteredActivities = activities.filter((a) =>
      isWithinDateRange(a.timestamp, startDate, endDate)
    );
    return {
      filteredLeads: dateLeads,
      filteredQuotations: dateQuotations,
      filteredDeals: dateDeals,
      filteredOrders: dateOrders,
      filteredInvoices: dateInvoices,
      filteredPayments: datePayments,
      filteredActivities,
    };
  }

  // Pre-calculate user-level lookup sets
  const userOpsOrderIds = new Set(
    orders.filter((o) => o.assignedOpsId === userId).map((o) => o.id)
  );
  const userOpsOrderDealIds = new Set(
    orders.filter((o) => o.assignedOpsId === userId).map((o) => o.dealId)
  );
  const userOpsOrderLeadIds = new Set(
    orders.filter((o) => o.assignedOpsId === userId).map((o) => o.leadId)
  );

  const userFinanceDealIds = new Set(
    invoices.filter((i) => i.assignedFinanceId === userId).map((i) => i.dealId)
  );
  const userFinanceOrderIds = new Set(
    invoices.filter((i) => i.assignedFinanceId === userId && i.orderId).map((i) => i.orderId!)
  );

  // Department-level user ID groups
  const opsUserIds = new Set(USERS.filter((u) => u.department === 'Operations').map((u) => u.id));
  const salesUserIds = new Set(USERS.filter((u) => u.department === 'Sales').map((u) => u.id));
  const financeUserIds = new Set(USERS.filter((u) => u.department === 'Finance').map((u) => u.id));

  // Operational relationship IDs
  const opsOrderIds = new Set(
    orders
      .filter((o) => (userId !== 'all' ? o.assignedOpsId === userId : opsUserIds.has(o.assignedOpsId)))
      .map((o) => o.id)
  );
  const opsDealIds = new Set(
    orders
      .filter((o) => (userId !== 'all' ? o.assignedOpsId === userId : opsUserIds.has(o.assignedOpsId)))
      .map((o) => o.dealId)
  );
  const opsLeadIds = new Set(
    orders
      .filter((o) => (userId !== 'all' ? o.assignedOpsId === userId : opsUserIds.has(o.assignedOpsId)))
      .map((o) => o.leadId)
  );

  // Finance relationship IDs
  const finDealIds = new Set(
    invoices
      .filter((i) =>
        userId !== 'all' ? i.assignedFinanceId === userId : financeUserIds.has(i.assignedFinanceId || '')
      )
      .map((i) => i.dealId)
  );
  const finOrderIds = new Set(
    invoices
      .filter(
        (i) =>
          (userId !== 'all'
            ? i.assignedFinanceId === userId
            : financeUserIds.has(i.assignedFinanceId || '')) && i.orderId
      )
      .map((i) => i.orderId!)
  );
  const finLeadIds = new Set(
    invoices
      .filter((i) =>
        userId !== 'all' ? i.assignedFinanceId === userId : financeUserIds.has(i.assignedFinanceId || '')
      )
      .map((i) => i.leadId)
  );

  // Filter Orders
  const filteredOrders = dateOrders.filter((o) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Operations') return o.assignedOpsId === userId;
      if (targetUser?.department === 'Sales') return o.assignedSalesId === userId;
      if (targetUser?.department === 'Finance') return userFinanceOrderIds.has(o.id);
      return o.assignedOpsId === userId || o.assignedSalesId === userId;
    }
    if (department === 'Operations') {
      return opsUserIds.has(o.assignedOpsId);
    }
    if (department === 'Sales') {
      return salesUserIds.has(o.assignedSalesId);
    }
    if (department === 'Finance') {
      return finOrderIds.has(o.id);
    }
    return true;
  });

  // Filter Deals
  const filteredDeals = dateDeals.filter((d) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Sales') return d.assignedSalesId === userId;
      if (targetUser?.department === 'Operations') return userOpsOrderDealIds.has(d.id);
      if (targetUser?.department === 'Finance') return userFinanceDealIds.has(d.id);
      return d.assignedSalesId === userId;
    }
    if (department === 'Sales') {
      return salesUserIds.has(d.assignedSalesId);
    }
    if (department === 'Operations') {
      return opsDealIds.has(d.id);
    }
    if (department === 'Finance') {
      return finDealIds.has(d.id);
    }
    return true;
  });

  // Filter Quotations
  const filteredQuotations = dateQuotations.filter((q) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Sales') return q.assignedSalesId === userId;
      if (targetUser?.department === 'Operations') {
        const linkedDeal = deals.find((d) => d.quotationIds?.includes(q.id) || d.id === q.dealId);
        return linkedDeal ? userOpsOrderDealIds.has(linkedDeal.id) : false;
      }
      if (targetUser?.department === 'Finance') {
        const linkedDeal = deals.find((d) => d.quotationIds?.includes(q.id) || d.id === q.dealId);
        return linkedDeal ? userFinanceDealIds.has(linkedDeal.id) : false;
      }
      return q.assignedSalesId === userId;
    }
    if (department === 'Sales') {
      return salesUserIds.has(q.assignedSalesId);
    }
    if (department === 'Operations') {
      const linkedDeal = deals.find((d) => d.quotationIds?.includes(q.id) || d.id === q.dealId);
      return linkedDeal ? opsDealIds.has(linkedDeal.id) : false;
    }
    if (department === 'Finance') {
      const linkedDeal = deals.find((d) => d.quotationIds?.includes(q.id) || d.id === q.dealId);
      return linkedDeal ? finDealIds.has(linkedDeal.id) : false;
    }
    return true;
  });

  // Filter Leads
  const filteredLeads = dateLeads.filter((l) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Sales') return l.assignedSalesId === userId;
      if (targetUser?.department === 'Operations') return userOpsOrderLeadIds.has(l.id);
      if (targetUser?.department === 'Finance') return finLeadIds.has(l.id);
      return l.assignedSalesId === userId;
    }
    if (department === 'Sales') {
      return salesUserIds.has(l.assignedSalesId);
    }
    if (department === 'Operations') {
      return opsLeadIds.has(l.id);
    }
    if (department === 'Finance') {
      return finLeadIds.has(l.id);
    }
    return true;
  });

  // Filter Invoices
  const filteredInvoices = dateInvoices.filter((i) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Finance') return i.assignedFinanceId === userId;
      if (targetUser?.department === 'Sales') return i.assignedSalesId === userId;
      if (targetUser?.department === 'Operations') {
        return (i.orderId && userOpsOrderIds.has(i.orderId)) || userOpsOrderDealIds.has(i.dealId);
      }
      return i.assignedSalesId === userId || i.assignedFinanceId === userId;
    }
    if (department === 'Finance') {
      return financeUserIds.has(i.assignedFinanceId || '');
    }
    if (department === 'Sales') {
      return salesUserIds.has(i.assignedSalesId);
    }
    if (department === 'Operations') {
      return (i.orderId && opsOrderIds.has(i.orderId)) || opsDealIds.has(i.dealId);
    }
    return true;
  });

  // Filter Payments
  const filteredPayments = datePayments.filter((p) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Finance') return p.assignedFinanceId === userId;
      if (targetUser?.department === 'Sales') return p.assignedSalesId === userId;
      if (targetUser?.department === 'Operations') {
        return (p.orderId && userOpsOrderIds.has(p.orderId)) || userOpsOrderDealIds.has(p.dealId);
      }
      return p.assignedSalesId === userId || p.assignedFinanceId === userId;
    }
    if (department === 'Finance') {
      return financeUserIds.has(p.assignedFinanceId || '');
    }
    if (department === 'Sales') {
      return salesUserIds.has(p.assignedSalesId);
    }
    if (department === 'Operations') {
      return (p.orderId && opsOrderIds.has(p.orderId)) || opsDealIds.has(p.dealId);
    }
    return true;
  });

  // Filter Activities
  const filteredActivities = activities.filter((a) => {
    if (!isWithinDateRange(a.timestamp, startDate, endDate)) return false;
    if (userId !== 'all') {
      return a.employeeId === userId;
    }
    if (department !== 'all') {
      const user = USERS.find((u) => u.id === a.employeeId);
      if (user && user.department !== department) return false;
    }
    return true;
  });

  return {
    filteredLeads,
    filteredQuotations,
    filteredDeals,
    filteredOrders,
    filteredInvoices,
    filteredPayments,
    filteredActivities,
  };
}

/**
 * Calculates raw KPI totals for a given set of filtered records
 */
export function calculateKpiData(
  leads: Lead[],
  quotations: Quotation[],
  deals: Deal[],
  orders: Order[],
  invoices: Invoice[],
  payments: Payment[]
): PeriodKpiData {
  // Sales & Lead metrics
  const newLeads = leads.length;
  const qualifiedLeads = leads.filter(
    (l) => l.status === 'Qualified' || l.status === 'Converted'
  ).length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const unqualifiedLeads = leads.filter((l) => l.status === 'Unqualified').length;
  const conversionRate =
    newLeads > 0 ? Number(((convertedLeads / newLeads) * 100).toFixed(1)) : 0;
  const quotationsCreated = quotations.length;
  const dealsCreated = deals.length;
  const totalDealValue = deals.reduce((sum, d) => sum + d.amount, 0);

  // Operational fulfillment metrics
  const totalOrders = orders.length;
  const ordersInProgress = orders.filter((o) => o.status === 'In Progress').length;
  const ordersCompleted = orders.filter((o) => o.status === 'Completed').length;
  const ordersPending = orders.filter((o) => o.status === 'Pending' || o.status === 'On Hold').length;
  const orderCompletionRate =
    totalOrders > 0 ? Number(((ordersCompleted / totalOrders) * 100).toFixed(1)) : 0;
  const totalOrderValue = orders.reduce((sum, o) => sum + o.orderValue, 0);
  const stagesCompletedTotal = orders.reduce((sum, o) => sum + (o.stagesCompleted || 0), 0);
  const stagesTotal = orders.reduce((sum, o) => sum + (o.stagesTotal || 4), 0);
  const orderProgressRate =
    stagesTotal > 0 ? Number(((stagesCompletedTotal / stagesTotal) * 100).toFixed(1)) : 0;

  // Financial & billing metrics
  const invoicesGenerated = invoices.length;
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.invoiceAmount, 0);
  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const outstandingRevenue =
    invoices.length > 0
      ? invoices.reduce((sum, i) => sum + i.balanceAmount, 0)
      : Math.max(0, totalDealValue - totalCollected);
  const collectionRate =
    totalInvoiced > 0 ? Number(((totalCollected / totalInvoiced) * 100).toFixed(1)) : 0;
  const paidInvoicesCount = invoices.filter((i) => i.status === 'Paid').length;
  const unpaidInvoicesCount = invoices.filter((i) => i.status === 'Unpaid' || i.status === 'Partially Paid').length;
  const paymentsCount = payments.length;

  return {
    newLeads,
    qualifiedLeads,
    convertedLeads,
    unqualifiedLeads,
    conversionRate,
    quotationsCreated,
    dealsCreated,
    totalDealValue,
    totalOrders,
    ordersInProgress,
    ordersCompleted,
    ordersPending,
    orderCompletionRate,
    totalOrderValue,
    stagesCompletedTotal,
    stagesTotal,
    orderProgressRate,
    invoicesGenerated,
    totalInvoiced,
    totalCollected,
    outstandingRevenue,
    collectionRate,
    paidInvoicesCount,
    unpaidInvoicesCount,
    paymentsCount,
  };
}

/**
 * Dynamic Target Achievement Calculation
 */
export interface TargetAchievementResult {
  monthlyTarget: number;
  actualRevenue: number;
  remainingAmount: number;
  achievementPercentage: number;
  remainingPercentage: number;
  isConfigured: boolean;
  isExceeded: boolean;
}

export function calculateTargetAchievement(
  actualRevenue: number,
  monthlyTarget: number
): TargetAchievementResult {
  if (!monthlyTarget || monthlyTarget <= 0) {
    return {
      monthlyTarget: 0,
      actualRevenue,
      remainingAmount: 0,
      achievementPercentage: 0,
      remainingPercentage: 100,
      isConfigured: false,
      isExceeded: false,
    };
  }

  const achievementPercentage = Number(((actualRevenue / monthlyTarget) * 100).toFixed(1));
  const remainingAmount = Math.max(0, monthlyTarget - actualRevenue);
  const remainingPercentage = Math.max(0, Number((100 - achievementPercentage).toFixed(1)));
  const isExceeded = actualRevenue > monthlyTarget;

  return {
    monthlyTarget,
    actualRevenue,
    remainingAmount,
    achievementPercentage,
    remainingPercentage,
    isConfigured: true,
    isExceeded,
  };
}

function calcDiff(curr: number, prev: number) {
  if (prev === 0) {
    if (curr === 0) return { valueStr: '0.0%', isPositive: false, isZero: true };
    return { valueStr: 'New', isPositive: true, isZero: false };
  }
  const pct = ((curr - prev) / prev) * 100;
  if (isNaN(pct) || !isFinite(pct)) return { valueStr: '0.0%', isPositive: false, isZero: true };
  const sign = pct > 0 ? '+' : '';
  return {
    valueStr: `${sign}${pct.toFixed(1)}%`,
    isPositive: pct > 0,
    isZero: pct === 0,
  };
}

export function calculateComparison(
  current: PeriodKpiData,
  previous: PeriodKpiData,
  days: number
): ComparisonKpis {
  return {
    current,
    previous,
    newLeadsDiff: calcDiff(current.newLeads, previous.newLeads),
    qualifiedLeadsDiff: calcDiff(current.qualifiedLeads, previous.qualifiedLeads),
    convertedLeadsDiff: calcDiff(current.convertedLeads, previous.convertedLeads),
    unqualifiedLeadsDiff: calcDiff(current.unqualifiedLeads, previous.unqualifiedLeads),
    conversionRateDiff: calcDiff(current.conversionRate, previous.conversionRate),
    quotationsDiff: calcDiff(current.quotationsCreated, previous.quotationsCreated),
    dealsDiff: calcDiff(current.dealsCreated, previous.dealsCreated),
    totalDealValueDiff: calcDiff(current.totalDealValue, previous.totalDealValue),
    invoicesDiff: calcDiff(current.invoicesGenerated, previous.invoicesGenerated),
    totalOrdersDiff: calcDiff(current.totalOrders, previous.totalOrders),
    ordersInProgressDiff: calcDiff(current.ordersInProgress, previous.ordersInProgress),
    ordersCompletedDiff: calcDiff(current.ordersCompleted, previous.ordersCompleted),
    orderCompletionRateDiff: calcDiff(current.orderCompletionRate, previous.orderCompletionRate),
    totalOrderValueDiff: calcDiff(current.totalOrderValue, previous.totalOrderValue),
    orderProgressRateDiff: calcDiff(current.orderProgressRate, previous.orderProgressRate),
    totalInvoicedDiff: calcDiff(current.totalInvoiced, previous.totalInvoiced),
    totalCollectedDiff: calcDiff(current.totalCollected, previous.totalCollected),
    outstandingRevenueDiff: calcDiff(current.outstandingRevenue, previous.outstandingRevenue),
    collectionRateDiff: calcDiff(current.collectionRate, previous.collectionRate),
    periodDaysLabel: `vs previous ${days} days`,
  };
}

// Chart dataset generators

export interface LeadSourceStat {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

export function getLeadSourcesData(leads: Lead[]): LeadSourceStat[] {
  const counts: Record<string, number> = {};
  leads.forEach((l) => {
    counts[l.source] = (counts[l.source] || 0) + 1;
  });

  const total = leads.length;
  const colors: Record<string, string> = {
    'Google Ads': '#2563EB',
    'Website': '#3B82F6',
    'Referral': '#10B981',
    'Social Media': '#8B5CF6',
    'Just Dial': '#F59E0B',
    'Other': '#64748B',
  };

  return Object.entries(counts).map(([source, count]) => ({
    source,
    count,
    percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    color: colors[source] || '#94A3B8',
  }));
}

export interface DailyTrendPoint {
  date: string;
  label: string;
  newLeads: number;
  qualified: number;
}

export function getDailyLeadTrendData(
  leads: Lead[],
  startDate: string,
  endDate: string
): DailyTrendPoint[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const points: DailyTrendPoint[] = [];

  const curr = new Date(start);
  while (curr <= end) {
    const dStr = curr.toISOString().split('T')[0];
    const label = curr.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const dayLeads = leads.filter((l) => l.createdAt.startsWith(dStr));
    const qualified = dayLeads.filter(
      (l) => l.status === 'Qualified' || l.status === 'Converted'
    ).length;

    points.push({
      date: dStr,
      label,
      newLeads: dayLeads.length,
      qualified,
    });

    curr.setDate(curr.getDate() + 1);
  }

  return points;
}

export interface QuotationCategoryStat {
  service: string;
  category: string;
  shortName: string;
  count: number;
  total: number;
  amount: number;
  accepted: number;
  pending: number;
  rejected: number;
  conversionRate: number;
  acceptanceRate: number;
}

export function getQuotationCategoryData(quotations: Quotation[]): QuotationCategoryStat[] {
  const catMap: Record<
    string,
    { count: number; amount: number; accepted: number; pending: number; rejected: number }
  > = {};

  const shortNames: Record<string, string> = {
    'Private Limited Company': 'Pvt Ltd',
    'LLP Registration': 'LLP',
    'GST Registration': 'GST',
    Trademark: 'Trademark',
    'Startup India Registration': 'Startup India',
    'ISO Certification': 'ISO',
    'Annual Compliance': 'Compliance',
    'General Filing': 'Filing',
    'FSSAI License': 'FSSAI',
    'Website Development': 'Website',
  };

  quotations.forEach((q) => {
    const cat = q.serviceCategory || 'General Filing';
    if (!catMap[cat]) {
      catMap[cat] = { count: 0, amount: 0, accepted: 0, pending: 0, rejected: 0 };
    }
    catMap[cat].count++;
    catMap[cat].amount += q.finalAmount || q.amount || 0;
    if (q.status === 'Accepted') catMap[cat].accepted++;
    else if (q.status === 'Rejected') catMap[cat].rejected++;
    else catMap[cat].pending++;
  });

  return Object.entries(catMap)
    .map(([category, stats]) => {
      const rate =
        stats.count > 0 ? Number(((stats.accepted / stats.count) * 100).toFixed(1)) : 0;
      return {
        service: category,
        category,
        shortName: shortNames[category] || category.substring(0, 8),
        count: stats.count,
        total: stats.count,
        amount: stats.amount,
        accepted: stats.accepted,
        pending: stats.pending,
        rejected: stats.rejected,
        conversionRate: rate,
        acceptanceRate: rate,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export interface DealServiceStat {
  service: string;
  dealsCount: number;
  dealRevenue: number;
}

export function getDealsVsRevenueData(deals: Deal[]): DealServiceStat[] {
  const map: Record<string, { count: number; revenue: number }> = {};
  deals.forEach((d) => {
    const s = d.serviceCategory;
    if (!map[s]) map[s] = { count: 0, revenue: 0 };
    map[s].count++;
    map[s].revenue += d.amount;
  });

  return Object.entries(map).map(([service, val]) => ({
    service,
    dealsCount: val.count,
    dealRevenue: val.revenue,
  }));
}

export interface RevenueCategoryProgress {
  category: string;
  revenue: number;
  percentage: number;
}

export function getRevenueCategoryBreakdown(deals: Deal[]): RevenueCategoryProgress[] {
  const totalRev = deals.reduce((sum, d) => sum + d.amount, 0);
  const map: Record<string, number> = {};

  deals.forEach((d) => {
    map[d.serviceCategory] = (map[d.serviceCategory] || 0) + d.amount;
  });

  return Object.entries(map).map(([category, rev]) => ({
    category,
    revenue: rev,
    percentage: totalRev > 0 ? Number(((rev / totalRev) * 100).toFixed(1)) : 0,
  }));
}

export interface PriorityStat {
  priority: string;
  deals: number;
  revenue: number;
  percentage: number;
  color: string;
}

export function getPriorityBreakdown(deals: Deal[]): PriorityStat[] {
  const totalRev = deals.reduce((sum, d) => sum + d.amount, 0);
  const priorities = ['High', 'Medium', 'Low'];
  const colors: Record<string, string> = {
    High: '#EF4444',
    Medium: '#F59E0B',
    Low: '#10B981',
  };

  return priorities.map((p) => {
    const pDeals = deals.filter((d) => d.priority === p);
    const rev = pDeals.reduce((sum, d) => sum + d.amount, 0);
    return {
      priority: p,
      deals: pDeals.length,
      revenue: rev,
      percentage: totalRev > 0 ? Math.round((rev / totalRev) * 100) : 0,
      color: colors[p],
    };
  });
}

export interface DailyRevenuePoint {
  date: string;
  label: string;
  revenue: number;
  collected: number;
}

export function getDailyRevenueTrendData(
  deals: Deal[],
  payments: Payment[],
  startDate: string,
  endDate: string
): DailyRevenuePoint[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const points: DailyRevenuePoint[] = [];

  const curr = new Date(start);
  while (curr <= end) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    const dStr = `${y}-${m}-${d}`;
    const label = curr.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const dayDealsRev = deals
      .filter((deal) => deal.createdAt.startsWith(dStr))
      .reduce((sum, deal) => sum + deal.amount, 0);

    const dayCollected = payments
      .filter((p) => p.paymentDate.startsWith(dStr) && p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    points.push({
      date: dStr,
      label,
      revenue: dayDealsRev,
      collected: dayCollected,
    });

    curr.setDate(curr.getDate() + 1);
  }

  return points;
}

export interface SalesMemberStat {
  user: { id: string; name: string; avatarColor: string; designation?: string };
  leadsHandled: number;
  qualified: number;
  converted: number;
  conversionRate: number;
  quotations: number;
  deals: number;
  dealValue: number;
  revenue: number;
}

export function getSalesTeamActivity(
  leads: Lead[],
  quotations: Quotation[],
  deals: Deal[],
  payments: Payment[]
): SalesMemberStat[] {
  const salesUsers = USERS.filter((u) => u.department === 'Sales');

  return salesUsers.map((u) => {
    const userLeads = leads.filter((l) => l.assignedSalesId === u.id);
    const qualified = userLeads.filter(
      (l) => l.status === 'Qualified' || l.status === 'Converted'
    ).length;
    const converted = userLeads.filter((l) => l.status === 'Converted').length;
    const userQuotes = quotations.filter((q) => q.assignedSalesId === u.id);
    const userDeals = deals.filter((d) => d.assignedSalesId === u.id);
    const dealValue = userDeals.reduce((sum, d) => sum + d.amount, 0);
    const userPayments = payments.filter(
      (p) => p.assignedSalesId === u.id && p.status === 'Paid'
    );
    const revenue = userPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      user: {
        id: u.id,
        name: u.name,
        avatarColor: u.avatarColor,
        designation: u.designation,
      },
      leadsHandled: userLeads.length,
      qualified,
      converted,
      conversionRate:
        userLeads.length > 0 ? Number(((converted / userLeads.length) * 100).toFixed(1)) : 0,
      quotations: userQuotes.length,
      deals: userDeals.length,
      dealValue,
      revenue,
    };
  });
}

export interface OpsMemberStat {
  user: { id: string; name: string; avatarColor: string; designation?: string };
  totalOrders: number;
  ordersUpdated: number;
  stagesCompleted: number;
  pendingStages: number;
  overdueOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  completionRate: number;
  managedValue: number;
}

export function getOperationsTeamActivity(orders: Order[]): OpsMemberStat[] {
  const opsUsers = USERS.filter((u) => u.department === 'Operations');

  return opsUsers.map((u) => {
    const userOrders = orders.filter((o) => o.assignedOpsId === u.id);
    const totalOrders = userOrders.length;
    const completedOrders = userOrders.filter((o) => o.status === 'Completed').length;
    const inProgressOrders = userOrders.filter((o) => o.status === 'In Progress').length;
    const stagesCompleted = userOrders.reduce((sum, o) => sum + (o.stagesCompleted || 0), 0);
    const pendingStages = userOrders.reduce(
      (sum, o) => sum + Math.max(0, (o.stagesTotal || 4) - (o.stagesCompleted || 0)),
      0
    );
    const overdueOrders = userOrders.filter(
      (o) => o.isOverdue || (o.status === 'Pending' && !o.completedAt)
    ).length;
    const managedValue = userOrders.reduce((sum, o) => sum + o.orderValue, 0);

    return {
      user: {
        id: u.id,
        name: u.name,
        avatarColor: u.avatarColor,
        designation: u.designation,
      },
      totalOrders,
      ordersUpdated: totalOrders,
      stagesCompleted,
      pendingStages,
      overdueOrders,
      completedOrders,
      inProgressOrders,
      completionRate:
        totalOrders > 0 ? Number(((completedOrders / totalOrders) * 100).toFixed(1)) : 0,
      managedValue,
    };
  });
}

export interface OrderProgressGroup {
  service: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  onHold: number;
}

export function getOrderProgressData(orders: Order[]): OrderProgressGroup[] {
  const map: Record<
    string,
    { pending: number; inProgress: number; completed: number; onHold: number }
  > = {};

  orders.forEach((o) => {
    const s = o.serviceCategory || 'General Services';
    if (!map[s]) {
      map[s] = { pending: 0, inProgress: 0, completed: 0, onHold: 0 };
    }
    if (o.status === 'Completed') map[s].completed++;
    else if (o.status === 'In Progress') map[s].inProgress++;
    else if (o.status === 'On Hold') map[s].onHold++;
    else map[s].pending++;
  });

  return Object.entries(map)
    .map(([service, counts]) => {
      const total = counts.pending + counts.inProgress + counts.completed + counts.onHold;
      return {
        service,
        total,
        ...counts,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export interface PaymentMethodStat {
  method: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
}

export function getPaymentMethodBreakdown(payments: Payment[]): PaymentMethodStat[] {
  const counts: Record<string, { count: number; amount: number }> = {};
  payments.forEach((p) => {
    if (!counts[p.method]) counts[p.method] = { count: 0, amount: 0 };
    counts[p.method].count++;
    counts[p.method].amount += p.amount;
  });

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const colors: Record<string, string> = {
    UPI: '#2563EB',
    'Net Banking': '#06B6D4',
    'NEFT/RTGS': '#10B981',
    'Credit Card': '#8B5CF6',
    Cheque: '#F59E0B',
  };

  return Object.entries(counts).map(([method, data]) => ({
    method,
    count: data.count,
    amount: data.amount,
    percentage: totalAmount > 0 ? Number(((data.amount / totalAmount) * 100).toFixed(1)) : 0,
    color: colors[method] || '#64748B',
  }));
}

export interface InvoiceStatusStat {
  status: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
}

export function getInvoiceStatusBreakdown(invoices: Invoice[]): InvoiceStatusStat[] {
  const counts: Record<string, { count: number; amount: number }> = {};
  invoices.forEach((i) => {
    if (!counts[i.status]) counts[i.status] = { count: 0, amount: 0 };
    counts[i.status].count++;
    counts[i.status].amount += i.invoiceAmount;
  });

  const totalAmount = invoices.reduce((sum, i) => sum + i.invoiceAmount, 0);
  const colors: Record<string, string> = {
    Paid: '#10B981',
    'Partially Paid': '#F59E0B',
    Unpaid: '#EF4444',
    Overdue: '#DC2626',
  };

  return Object.entries(counts).map(([status, data]) => ({
    status,
    count: data.count,
    amount: data.amount,
    percentage: totalAmount > 0 ? Number(((data.amount / totalAmount) * 100).toFixed(1)) : 0,
    color: colors[status] || '#64748B',
  }));
}
