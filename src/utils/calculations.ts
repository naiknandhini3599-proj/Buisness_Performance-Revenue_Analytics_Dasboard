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
  invoicesDiff: { valueStr: string; isPositive: boolean; isZero: boolean };
  periodDaysLabel: string;
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Calculates start and end for the immediately preceding equivalent period.
 */
export function getPreviousPeriodRange(range: DateFilterRange): { startDate: string; endDate: string; days: number } {
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

export function isWithinDateRange(dateStr: string, startDateStr: string, endDateStr: string): boolean {
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

  // 1. Filter Orders first so we have the set of operational orders for attribution
  const dateOrders = orders.filter((o) => isWithinDateRange(o.createdAt, startDate, endDate));
  const filteredOrders = dateOrders.filter((o) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Operations') {
        return o.assignedOpsId === userId;
      }
      if (targetUser?.department === 'Sales') {
        return o.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Finance') {
        return true;
      }
      return o.assignedOpsId === userId || o.assignedSalesId === userId;
    }
    if (department !== 'all') {
      if (department === 'Operations') {
        const ops = USERS.find((u) => u.id === o.assignedOpsId);
        return ops?.department === 'Operations';
      }
      if (department === 'Sales') {
        const rep = USERS.find((u) => u.id === o.assignedSalesId);
        return rep?.department === 'Sales';
      }
      if (department === 'Finance') {
        return true;
      }
    }
    return true;
  });

  const opsOrderDealIds = new Set(filteredOrders.map((o) => o.dealId));
  const opsOrderLeadIds = new Set(filteredOrders.map((o) => o.leadId));
  const opsOrderIds = new Set(filteredOrders.map((o) => o.id));

  // 2. Filter Invoices
  const dateInvoices = invoices.filter((i) => isWithinDateRange(i.issueDate, startDate, endDate));
  const filteredInvoices = dateInvoices.filter((i) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Sales') {
        return i.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Operations') {
        return i.assignedOpsId === userId || (i.orderId && opsOrderIds.has(i.orderId)) || opsOrderDealIds.has(i.dealId);
      }
      if (targetUser?.department === 'Finance') {
        return i.assignedFinanceId === userId || true;
      }
      return i.assignedSalesId === userId;
    }
    if (department !== 'all') {
      if (department === 'Sales') {
        const rep = USERS.find((u) => u.id === i.assignedSalesId);
        return rep?.department === 'Sales';
      }
      if (department === 'Operations') {
        return (i.orderId && opsOrderIds.has(i.orderId)) || opsOrderDealIds.has(i.dealId);
      }
      if (department === 'Finance') {
        return true;
      }
    }
    return true;
  });

  const financeDealIds = new Set(filteredInvoices.map((i) => i.dealId));
  const financeLeadIds = new Set(filteredInvoices.map((i) => i.leadId));

  // 3. Filter Payments
  const datePayments = payments.filter((p) => isWithinDateRange(p.paymentDate, startDate, endDate));
  const filteredPayments = datePayments.filter((p) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Sales') {
        return p.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Operations') {
        return p.assignedOpsId === userId || (p.orderId && opsOrderIds.has(p.orderId)) || opsOrderDealIds.has(p.dealId);
      }
      if (targetUser?.department === 'Finance') {
        return p.assignedFinanceId === userId || true;
      }
      return p.assignedSalesId === userId;
    }
    if (department !== 'all') {
      if (department === 'Sales') {
        const rep = USERS.find((u) => u.id === p.assignedSalesId);
        return rep?.department === 'Sales';
      }
      if (department === 'Operations') {
        return (p.orderId && opsOrderIds.has(p.orderId)) || opsOrderDealIds.has(p.dealId);
      }
      if (department === 'Finance') {
        return true;
      }
    }
    return true;
  });

  // 4. Filter Deals
  const dateDeals = deals.filter((d) => isWithinDateRange(d.createdAt, startDate, endDate));
  const filteredDeals = dateDeals.filter((d) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Sales') {
        return d.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Operations') {
        return opsOrderDealIds.has(d.id) || d.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Finance') {
        return financeDealIds.has(d.id) || true;
      }
      return d.assignedSalesId === userId;
    }
    if (department !== 'all') {
      if (department === 'Sales') {
        const rep = USERS.find((u) => u.id === d.assignedSalesId);
        return rep?.department === 'Sales';
      }
      if (department === 'Operations') {
        return opsOrderDealIds.has(d.id);
      }
      if (department === 'Finance') {
        return financeDealIds.has(d.id);
      }
    }
    return true;
  });

  const activeDealQuoteIds = new Set(filteredDeals.flatMap((d) => d.quotationIds || []));
  const activeDealLeadIds = new Set(filteredDeals.map((d) => d.leadId));

  // 5. Filter Quotations
  const dateQuotations = quotations.filter((q) => isWithinDateRange(q.createdAt, startDate, endDate));
  const filteredQuotations = dateQuotations.filter((q) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Sales') {
        return q.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Operations') {
        return activeDealQuoteIds.has(q.id) || q.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Finance') {
        return activeDealQuoteIds.has(q.id) || true;
      }
      return q.assignedSalesId === userId;
    }
    if (department !== 'all') {
      if (department === 'Sales') {
        const rep = USERS.find((u) => u.id === q.assignedSalesId);
        return rep?.department === 'Sales';
      }
      if (department === 'Operations') {
        return activeDealQuoteIds.has(q.id);
      }
      if (department === 'Finance') {
        return activeDealQuoteIds.has(q.id);
      }
    }
    return true;
  });

  // 6. Filter Leads
  const dateLeads = leads.filter((l) => isWithinDateRange(l.createdAt, startDate, endDate));
  const filteredLeads = dateLeads.filter((l) => {
    if (userId !== 'all') {
      if (targetUser?.department === 'Sales') {
        return l.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Operations') {
        return opsOrderLeadIds.has(l.id) || activeDealLeadIds.has(l.id) || l.assignedSalesId === userId;
      }
      if (targetUser?.department === 'Finance') {
        return financeLeadIds.has(l.id) || activeDealLeadIds.has(l.id) || true;
      }
      return l.assignedSalesId === userId;
    }
    if (department !== 'all') {
      if (department === 'Sales') {
        const rep = USERS.find((u) => u.id === l.assignedSalesId);
        return rep?.department === 'Sales';
      }
      if (department === 'Operations') {
        return opsOrderLeadIds.has(l.id) || activeDealLeadIds.has(l.id);
      }
      if (department === 'Finance') {
        return financeLeadIds.has(l.id) || activeDealLeadIds.has(l.id);
      }
    }
    return true;
  });

  // 7. Filter Activities
  const filteredActivities = activities.filter((a) => {
    if (!isWithinDateRange(a.timestamp, startDate, endDate)) return false;
    if (userId !== 'all' && a.employeeId !== userId) return false;
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
 * Fully dynamic and mathematically consistent with the underlying records.
 */
export function calculateKpiData(
  leads: Lead[],
  quotations: Quotation[],
  deals: Deal[],
  orders: Order[],
  invoices: Invoice[],
  payments: Payment[]
): PeriodKpiData {
  const newLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === 'Qualified' || l.status === 'Converted').length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const unqualifiedLeads = leads.filter((l) => l.status === 'Unqualified').length;
  
  // Real conversion rate: Converted Leads / Total Leads (safe zero division)
  const conversionRate = newLeads > 0 
    ? Number(((convertedLeads / newLeads) * 100).toFixed(1))
    : 0;

  const quotationsCreated = quotations.length;
  const dealsCreated = deals.length;
  const invoicesGenerated = invoices.length;

  const totalDealValue = deals.reduce((sum, d) => sum + d.amount, 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.invoiceAmount, 0);
  const totalCollected = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingRevenue = totalInvoiced > 0 
    ? Math.max(0, totalInvoiced - totalCollected)
    : Math.max(0, totalDealValue - totalCollected);

  return {
    newLeads,
    qualifiedLeads,
    convertedLeads,
    unqualifiedLeads,
    conversionRate,
    quotationsCreated,
    dealsCreated,
    invoicesGenerated,
    totalDealValue,
    totalInvoiced,
    totalCollected,
    outstandingRevenue,
  };
}

function calcDiff(curr: number, prev: number) {
  if (prev === 0) {
    if (curr === 0) return { valueStr: '0.0%', isPositive: true, isZero: true };
    return { valueStr: '+100%', isPositive: true, isZero: false };
  }
  const pct = ((curr - prev) / prev) * 100;
  const isPositive = pct >= 0;
  return {
    valueStr: `${isPositive ? '+' : ''}${Math.abs(pct).toFixed(1)}%`,
    isPositive,
    isZero: pct === 0,
  };
}

export function calculateComparison(
  curr: PeriodKpiData,
  prev: PeriodKpiData,
  daysCount: number
): ComparisonKpis {
  return {
    current: curr,
    previous: prev,
    newLeadsDiff: calcDiff(curr.newLeads, prev.newLeads),
    qualifiedLeadsDiff: calcDiff(curr.qualifiedLeads, prev.qualifiedLeads),
    convertedLeadsDiff: calcDiff(curr.convertedLeads, prev.convertedLeads),
    unqualifiedLeadsDiff: calcDiff(curr.unqualifiedLeads, prev.unqualifiedLeads),
    conversionRateDiff: calcDiff(curr.conversionRate, prev.conversionRate),
    quotationsDiff: calcDiff(curr.quotationsCreated, prev.quotationsCreated),
    dealsDiff: calcDiff(curr.dealsCreated, prev.dealsCreated),
    invoicesDiff: calcDiff(curr.invoicesGenerated, prev.invoicesGenerated),
    periodDaysLabel: `previous ${daysCount} days`,
  };
}

/**
 * Aggregations for Charts
 */

export interface LeadSourceStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export function getLeadSourcesData(leads: Lead[]): LeadSourceStat[] {
  const total = leads.length || 1;
  const counts: Record<string, number> = {
    'Google Ads': 0,
    Website: 0,
    Referral: 0,
    'Social Media': 0,
    Other: 0,
    'Just Dial': 0,
  };

  leads.forEach((l) => {
    if (counts[l.source] !== undefined) {
      counts[l.source]++;
    } else {
      counts['Other']++;
    }
  });

  const colors: Record<string, string> = {
    'Google Ads': '#2563EB',
    Website: '#10B981',
    Referral: '#F59E0B',
    'Social Media': '#8B5CF6',
    Other: '#64748B',
    'Just Dial': '#06B6D4',
  };

  return Object.keys(counts)
    .filter((key) => counts[key] > 0 || key === 'Google Ads' || key === 'Website')
    .map((key) => ({
      name: key,
      count: counts[key],
      percentage: Number(((counts[key] / total) * 100).toFixed(1)),
      color: colors[key] || '#94A3B8',
    }));
}

export interface DailyTrendPoint {
  date: string;
  label: string;
  newLeads: number;
  qualified: number;
  converted: number;
}

export function getDailyLeadTrendData(leads: Lead[], startDate: string, endDate: string): DailyTrendPoint[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const points: DailyTrendPoint[] = [];

  const curr = new Date(start);
  while (curr <= end) {
    const dStr = curr.toISOString().split('T')[0];
    const label = curr.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const dayLeads = leads.filter((l) => l.createdAt.startsWith(dStr));
    const newCount = dayLeads.length;
    const qualCount = dayLeads.filter((l) => l.status === 'Qualified' || l.status === 'Converted').length;
    const convCount = dayLeads.filter((l) => l.status === 'Converted').length;

    points.push({
      date: dStr,
      label,
      newLeads: newCount,
      qualified: qualCount,
      converted: convCount,
    });

    curr.setDate(curr.getDate() + 1);
  }

  return points;
}

export interface QuotationCategoryStat {
  service: string;
  shortName: string;
  count: number;
  amount: number;
  accepted: number;
  pending: number;
  rejected: number;
  conversionRate: number;
}

export function getQuotationCategoryData(quotations: Quotation[]): QuotationCategoryStat[] {
  const map = new Map<string, QuotationCategoryStat>();

  quotations.forEach((q) => {
    if (!map.has(q.serviceCategory)) {
      map.set(q.serviceCategory, {
        service: q.serviceCategory,
        shortName: q.serviceCategory.length > 12 ? q.serviceCategory.substring(0, 11) + '...' : q.serviceCategory,
        count: 0,
        amount: 0,
        accepted: 0,
        pending: 0,
        rejected: 0,
        conversionRate: 0,
      });
    }
    const item = map.get(q.serviceCategory)!;
    item.count++;
    item.amount += q.amount;
    if (q.status === 'Accepted') item.accepted++;
    else if (q.status === 'Rejected') item.rejected++;
    else item.pending++;
  });

  const list = Array.from(map.values()).sort((a, b) => b.count - a.count);
  list.forEach((item) => {
    item.conversionRate = item.count > 0 ? Number(((item.accepted / item.count) * 100).toFixed(1)) : 0;
  });

  return list;
}

export interface DealServiceStat {
  service: string;
  dealsCount: number;
  dealRevenue: number;
}

export function getDealsVsRevenueData(deals: Deal[]): DealServiceStat[] {
  const map = new Map<string, { count: number; revenue: number }>();

  deals.forEach((d) => {
    const cur = map.get(d.serviceCategory) || { count: 0, revenue: 0 };
    cur.count++;
    cur.revenue += d.amount;
    map.set(d.serviceCategory, cur);
  });

  return Array.from(map.entries())
    .map(([service, val]) => ({
      service: service.length > 12 ? service.substring(0, 11) + '...' : service,
      dealsCount: val.count,
      dealRevenue: val.revenue,
    }))
    .sort((a, b) => b.dealsCount - a.dealsCount);
}

export interface RevenueCategoryProgress {
  category: string;
  revenue: number;
  percentage: number;
}

export function getRevenueCategoryBreakdown(deals: Deal[]): RevenueCategoryProgress[] {
  const total = deals.reduce((sum, d) => sum + d.amount, 0) || 1;
  const map = new Map<string, number>();

  deals.forEach((d) => {
    map.set(d.serviceCategory, (map.get(d.serviceCategory) || 0) + d.amount);
  });

  return Array.from(map.entries())
    .map(([cat, rev]) => ({
      category: cat,
      revenue: rev,
      percentage: Number(((rev / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface PriorityStat {
  priority: 'High' | 'Medium' | 'Low';
  deals: number;
  revenue: number;
  percentage: number;
  color: string;
}

export function getPriorityBreakdown(deals: Deal[]): PriorityStat[] {
  const totalRev = deals.reduce((sum, d) => sum + d.amount, 0) || 1;
  const high = deals.filter((d) => d.priority === 'High');
  const med = deals.filter((d) => d.priority === 'Medium');
  const low = deals.filter((d) => d.priority === 'Low');

  const highRev = high.reduce((sum, d) => sum + d.amount, 0);
  const medRev = med.reduce((sum, d) => sum + d.amount, 0);
  const lowRev = low.reduce((sum, d) => sum + d.amount, 0);

  return [
    {
      priority: 'High',
      deals: high.length,
      revenue: highRev,
      percentage: Number(((highRev / totalRev) * 100).toFixed(1)),
      color: '#EF4444',
    },
    {
      priority: 'Medium',
      deals: med.length,
      revenue: medRev,
      percentage: Number(((medRev / totalRev) * 100).toFixed(1)),
      color: '#F59E0B',
    },
    {
      priority: 'Low',
      deals: low.length,
      revenue: lowRev,
      percentage: Number(((lowRev / totalRev) * 100).toFixed(1)),
      color: '#10B981',
    },
  ];
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
    const dStr = curr.toISOString().split('T')[0];
    const label = curr.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const dayDealsRev = deals
      .filter((d) => d.createdAt.startsWith(dStr))
      .reduce((sum, d) => sum + d.amount, 0);

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
  // Include all reps with sales involvement, including Aazam Afroz
  const salesUsers = USERS.filter((u) => u.department === 'Sales' || u.id === 'u-6');

  return salesUsers.map((u) => {
    const userLeads = leads.filter((l) => l.assignedSalesId === u.id);
    const qualified = userLeads.filter((l) => l.status === 'Qualified' || l.status === 'Converted').length;
    const converted = userLeads.filter((l) => l.status === 'Converted').length;
    const userQuotes = quotations.filter((q) => q.assignedSalesId === u.id);
    const userDeals = deals.filter((d) => d.assignedSalesId === u.id);
    const dealValue = userDeals.reduce((sum, d) => sum + d.amount, 0);

    const userRevenue = payments
      .filter((p) => p.assignedSalesId === u.id && p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const conversionRate = userLeads.length > 0 
      ? Number(((converted / userLeads.length) * 100).toFixed(1))
      : 0;

    return {
      user: { id: u.id, name: u.name, avatarColor: u.avatarColor, designation: u.designation },
      leadsHandled: userLeads.length,
      qualified,
      converted,
      conversionRate,
      quotations: userQuotes.length,
      deals: userDeals.length,
      dealValue,
      revenue: userRevenue,
    };
  }).sort((a, b) => b.leadsHandled - a.leadsHandled);
}

export interface OpsMemberStat {
  user: { id: string; name: string; avatarColor: string; designation?: string };
  ordersUpdated: number;
  stagesCompleted: number;
  pendingStages: number;
  overdueOrders: number;
}

export function getOperationsTeamActivity(orders: Order[]): OpsMemberStat[] {
  const opsUsers = USERS.filter((u) => u.department === 'Operations');

  return opsUsers.map((u) => {
    const userOrders = orders.filter((o) => o.assignedOpsId === u.id);
    const completedStages = userOrders.reduce((sum, o) => sum + o.stagesCompleted, 0);
    const pendingStages = userOrders.reduce((sum, o) => sum + (o.stagesTotal - o.stagesCompleted), 0);
    const overdue = userOrders.filter((o) => o.isOverdue).length;

    return {
      user: { id: u.id, name: u.name, avatarColor: u.avatarColor, designation: u.designation },
      ordersUpdated: userOrders.length,
      stagesCompleted: completedStages,
      pendingStages,
      overdueOrders: overdue,
    };
  }).sort((a, b) => b.ordersUpdated - a.ordersUpdated);
}

export interface OrderProgressGroup {
  service: string;
  pending: number;
  inProgress: number;
  completed: number;
  onHold: number;
  total: number;
}

export function getOrderProgressData(orders: Order[]): OrderProgressGroup[] {
  const map = new Map<string, OrderProgressGroup>();

  orders.forEach((o) => {
    if (!map.has(o.serviceCategory)) {
      map.set(o.serviceCategory, {
        service: o.serviceCategory,
        pending: 0,
        inProgress: 0,
        completed: 0,
        onHold: 0,
        total: 0,
      });
    }
    const group = map.get(o.serviceCategory)!;
    group.total++;
    if (o.status === 'Pending') group.pending++;
    else if (o.status === 'In Progress') group.inProgress++;
    else if (o.status === 'Completed') group.completed++;
    else if (o.status === 'On Hold') group.onHold++;
  });

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}
