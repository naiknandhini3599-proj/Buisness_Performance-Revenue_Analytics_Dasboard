import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Lead,
  Quotation,
  Deal,
  Order,
  Invoice,
  Payment,
  ActivityLog,
  FilterState,
  User,
  AuthUser,
  UserPreferences,
} from '../types';
import {
  RAW_LEADS,
  RAW_QUOTATIONS,
  RAW_DEALS,
  RAW_ORDERS,
  RAW_INVOICES,
  RAW_PAYMENTS,
  RAW_ACTIVITIES,
  USERS,
  DEFAULT_MONTHLY_TARGET,
} from '../data/dummyData';
import {
  filterRecords,
  calculateKpiData,
  calculateComparison,
  getPreviousPeriodRange,
  getLeadSourcesData,
  getDailyLeadTrendData,
  getQuotationCategoryData,
  getDealsVsRevenueData,
  getRevenueCategoryBreakdown,
  getPriorityBreakdown,
  getDailyRevenueTrendData,
  getSalesTeamActivity,
  getOperationsTeamActivity,
  getOrderProgressData,
  getPaymentMethodBreakdown,
  getInvoiceStatusBreakdown,
  ComparisonKpis,
  LeadSourceStat,
  DailyTrendPoint,
  QuotationCategoryStat,
  DealServiceStat,
  RevenueCategoryProgress,
  PriorityStat,
  DailyRevenuePoint,
  SalesMemberStat,
  OpsMemberStat,
  OrderProgressGroup,
  PaymentMethodStat,
  InvoiceStatusStat,
} from '../utils/calculations';

interface AppContextType {
  // Authentication & Demo User
  authUser: AuthUser | null;
  login: (email: string, role?: string) => boolean;
  logout: () => void;
  demoLoginAs: (user: User) => void;

  // Filter State
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Settings & Preferences Persistence
  monthlyTarget: number;
  setMonthlyTarget: (target: number) => void;
  preferences: UserPreferences;
  savePreferences: (partial: Partial<UserPreferences>) => boolean;
  resetPreferencesToDefault: () => void;

  // Mutable In-Memory Records
  leads: Lead[];
  quotations: Quotation[];
  deals: Deal[];
  orders: Order[];
  invoices: Invoice[];
  payments: Payment[];
  activities: ActivityLog[];
  users: User[];

  // Interactive Mutators
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  addQuotation: (quote: Omit<Quotation, 'id' | 'createdAt'>) => Quotation;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Deal;
  recordPayment: (payment: Omit<Payment, 'id' | 'paymentDate'>) => Payment;
  updateLeadStatus: (leadId: string, newStatus: Lead['status']) => void;
  updateDealStage: (dealId: string, newStage: Deal['stage']) => void;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  advanceOrderStage: (orderId: string) => void;
  quickAcceptQuotation: (quoteId: string) => void;

  // Derived Analytics for Active Filters
  currentFiltered: {
    filteredLeads: Lead[];
    filteredQuotations: Quotation[];
    filteredDeals: Deal[];
    filteredOrders: Order[];
    filteredInvoices: Invoice[];
    filteredPayments: Payment[];
    filteredActivities: ActivityLog[];
  };
  comparison: ComparisonKpis;
  leadSources: LeadSourceStat[];
  dailyLeadTrend: DailyTrendPoint[];
  quotationCategories: QuotationCategoryStat[];
  dealsVsRevenue: DealServiceStat[];
  revenueCategories: RevenueCategoryProgress[];
  priorityBreakdown: PriorityStat[];
  dailyRevenueTrend: DailyRevenuePoint[];
  salesTeamActivity: SalesMemberStat[];
  opsTeamActivity: OpsMemberStat[];
  orderProgress: OrderProgressGroup[];
  paymentMethods: PaymentMethodStat[];
  invoiceStatuses: InvoiceStatusStat[];

  // Modal / Drill-down Control
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedQuotationId: string | null;
  setSelectedQuotationId: (id: string | null) => void;
  selectedDealId: string | null;
  setSelectedDealId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedPaymentId: string | null;
  setSelectedPaymentId: (id: string | null) => void;
  selectedInvoiceId: string | null;
  setSelectedInvoiceId: (id: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCustomDateOpen: boolean;
  setIsCustomDateOpen: (open: boolean) => void;
  isCreateLeadOpen: boolean;
  setIsCreateLeadOpen: (open: boolean) => void;
  isCreateQuotationOpen: boolean;
  setIsCreateQuotationOpen: (open: boolean) => void;
  isCreateDealOpen: boolean;
  setIsCreateDealOpen: (open: boolean) => void;
  isRecordPaymentOpen: boolean;
  setIsRecordPaymentOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read persisted demo user or fallback
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('crm_active_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      // ignore
    }
    return {
      id: 'u-6',
      name: 'Aazam Afroz',
      email: 'aazam.afroz@company.com',
      role: 'Sales',
      avatarColor: 'bg-blue-600',
      department: 'Sales',
    };
  });

  // Filters: default to October 2026 for rich baseline testing
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      preset: 'oct2026',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      label: 'Oct 1 - Oct 31, 2026',
    },
    userId: 'all',
    department: 'all',
    searchQuery: '',
  });

  // Full User Preferences Persistence as the single source of truth
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('crm_user_preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.monthlyTarget === 'number') {
          return parsed;
        }
      }
      const legacyTarget = localStorage.getItem('crm_monthly_target');
      if (legacyTarget) {
        const parsedTarget = parseInt(legacyTarget, 10);
        if (!isNaN(parsedTarget) && parsedTarget > 0) {
          return {
            monthlyTarget: parsedTarget,
            currency: 'INR',
            dateFormat: 'DD/MM/YYYY',
            defaultDatePreset: 'oct2026',
            defaultEmployeeFilter: 'all',
            notificationsEnabled: true,
            activeUserId: 'u-6',
          };
        }
      }
    } catch (e) {
      // ignore
    }
    return {
      monthlyTarget: DEFAULT_MONTHLY_TARGET,
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      defaultDatePreset: 'oct2026',
      defaultEmployeeFilter: 'all',
      notificationsEnabled: true,
      activeUserId: 'u-6',
    };
  });

  const monthlyTarget = preferences.monthlyTarget;

  const setMonthlyTarget = (target: number) => {
    savePreferences({ monthlyTarget: target });
  };

  const savePreferences = (partial: Partial<UserPreferences>): boolean => {
    try {
      setPreferencesState((prev) => {
        const updated = { ...prev, ...partial };
        try {
          localStorage.setItem('crm_user_preferences', JSON.stringify(updated));
          if (updated.monthlyTarget !== undefined) {
            localStorage.setItem('crm_monthly_target', updated.monthlyTarget.toString());
          }
          if (partial.activeUserId) {
            const matched = USERS.find((u) => u.id === partial.activeUserId);
            if (matched) {
              const userObj: AuthUser = {
                id: matched.id,
                name: matched.name,
                email: matched.email,
                role: matched.role,
                avatarColor: matched.avatarColor,
                department: matched.department,
              };
              setAuthUser(userObj);
              localStorage.setItem('crm_active_user', JSON.stringify(userObj));
            }
          }
        } catch (e) {
          // ignore
        }
        return updated;
      });
      return true;
    } catch {
      return false;
    }
  };

  const resetPreferencesToDefault = () => {
    const defaults: UserPreferences = {
      monthlyTarget: DEFAULT_MONTHLY_TARGET,
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      defaultDatePreset: 'oct2026',
      defaultEmployeeFilter: 'all',
      notificationsEnabled: true,
      activeUserId: 'u-6',
    };
    setPreferencesState(defaults);
    try {
      localStorage.setItem('crm_user_preferences', JSON.stringify(defaults));
      localStorage.setItem('crm_monthly_target', DEFAULT_MONTHLY_TARGET.toString());
      const defaultUser = USERS.find((u) => u.id === 'u-6');
      if (defaultUser) {
        const userObj: AuthUser = {
          id: defaultUser.id,
          name: defaultUser.name,
          email: defaultUser.email,
          role: defaultUser.role,
          avatarColor: defaultUser.avatarColor,
          department: defaultUser.department,
        };
        setAuthUser(userObj);
        localStorage.setItem('crm_active_user', JSON.stringify(userObj));
      }
    } catch (e) {
      // ignore
    }
    resetFilters();
  };

  // In-memory data store
  const [leads, setLeads] = useState<Lead[]>(RAW_LEADS);
  const [quotations, setQuotations] = useState<Quotation[]>(RAW_QUOTATIONS);
  const [deals, setDeals] = useState<Deal[]>(RAW_DEALS);
  const [orders, setOrders] = useState<Order[]>(RAW_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(RAW_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(RAW_PAYMENTS);
  const [activities, setActivities] = useState<ActivityLog[]>(RAW_ACTIVITIES);

  // Drilldown states
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  // Action / Creation Modals
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  // Authentication Handlers
  const login = (email: string) => {
    const matched = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      const userObj: AuthUser = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        avatarColor: matched.avatarColor,
        department: matched.department,
      };
      setAuthUser(userObj);
      localStorage.setItem('crm_active_user', JSON.stringify(userObj));
      return true;
    }
    const prefix = email.split('@')[0] || 'Demo User';
    const cleanName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    const userObj: AuthUser = {
      id: 'demo-user',
      name: cleanName,
      email,
      role: 'Sales',
      avatarColor: 'bg-blue-600',
      department: 'Sales',
    };
    setAuthUser(userObj);
    localStorage.setItem('crm_active_user', JSON.stringify(userObj));
    return true;
  };

  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem('crm_active_user');
  };

  const demoLoginAs = (user: User) => {
    const userObj: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarColor: user.avatarColor,
      department: user.department,
    };
    setAuthUser(userObj);
    localStorage.setItem('crm_active_user', JSON.stringify(userObj));
    setFilters((prev) => ({ ...prev, userId: user.id }));
  };

  const updateFilter = (partial: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...partial };
      if (partial.userId && partial.userId !== 'all') {
        const u = USERS.find((user) => user.id === partial.userId);
        if (u) {
          next.department = 'all';
        }
      }
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        preset: 'oct2026',
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        label: 'Oct 1 - Oct 31, 2026',
      },
      userId: 'all',
      department: 'all',
      searchQuery: '',
    });
  };

  // Interactive Record Creation & Mutators
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>): Lead => {
    const newId = `L-${209660 + leads.length}`;
    const newLead: Lead = {
      ...leadData,
      id: newId,
      createdAt: '2026-10-16T14:30:00.000Z',
    };
    setLeads((prev) => [newLead, ...prev]);

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      employeeId: authUser?.id || newLead.assignedSalesId,
      employeeName: authUser?.name || newLead.assignedSalesName,
      action: 'Inbound lead registered',
      recordType: 'Lead',
      recordId: newId,
      details: `New prospect ${newLead.companyName} (${newLead.serviceInterest}) added via ${newLead.source}.`,
    };
    setActivities((prev) => [newAct, ...prev]);
    return newLead;
  };

  const addQuotation = (quoteData: Omit<Quotation, 'id' | 'createdAt'>): Quotation => {
    const newId = `Q-${10500 + quotations.length}`;
    const newQuote: Quotation = {
      ...quoteData,
      id: newId,
      createdAt: '2026-10-16T15:00:00.000Z',
    };
    setQuotations((prev) => [newQuote, ...prev]);

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      employeeId: authUser?.id || newQuote.assignedSalesId,
      employeeName: authUser?.name || newQuote.assignedSalesName,
      action: 'Quotation generated',
      recordType: 'Quotation',
      recordId: newId,
      details: `Proposal of ₹${newQuote.finalAmount.toLocaleString('en-IN')} issued for ${newQuote.serviceCategory}.`,
    };
    setActivities((prev) => [newAct, ...prev]);
    return newQuote;
  };

  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt'>): Deal => {
    const newId = `D-${860 + deals.length}`;
    const newDeal: Deal = {
      ...dealData,
      id: newId,
      createdAt: '2026-10-16T15:30:00.000Z',
    };
    setDeals((prev) => [newDeal, ...prev]);

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      employeeId: authUser?.id || newDeal.assignedSalesId,
      employeeName: authUser?.name || newDeal.assignedSalesName,
      action: 'Deal created',
      recordType: 'Deal',
      recordId: newId,
      details: `Registered deal ${newDeal.title} with recognized value ₹${newDeal.amount.toLocaleString('en-IN')}.`,
    };
    setActivities((prev) => [newAct, ...prev]);
    return newDeal;
  };

  const recordPayment = (payData: Omit<Payment, 'id' | 'paymentDate'>): Payment => {
    const newId = `P-${1130 + payments.length}`;
    const newPay: Payment = {
      ...payData,
      id: newId,
      paymentDate: '2026-10-16T16:00:00.000Z',
    };
    setPayments((prev) => [newPay, ...prev]);

    // Update invoice balance
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === newPay.invoiceId) {
          const newPaid = inv.paidAmount + newPay.amount;
          const newBal = Math.max(0, inv.invoiceAmount - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            balanceAmount: newBal,
            status: newBal === 0 ? 'Paid' : 'Partially Paid',
          };
        }
        return inv;
      })
    );

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      employeeId: authUser?.id || 'u-7',
      employeeName: authUser?.name || 'Rajesh Verma',
      action: 'Payment recorded',
      recordType: 'Payment',
      recordId: newId,
      details: `Received ₹${newPay.amount.toLocaleString('en-IN')} via ${newPay.method} (${newPay.transactionRef}).`,
    };
    setActivities((prev) => [newAct, ...prev]);
    return newPay;
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      const newAct: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        employeeId: authUser?.id || 'u-6',
        employeeName: authUser?.name || 'Aazam Afroz',
        action: `Lead status changed to ${newStatus}`,
        recordType: 'Lead',
        recordId: leadId,
        details: `Updated ${lead.companyName} to ${newStatus}.`,
      };
      setActivities((prev) => [newAct, ...prev]);
    }
  };

  const updateDealStage = (dealId: string, newStage: Deal['stage']) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      const newAct: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        employeeId: authUser?.id || 'u-6',
        employeeName: authUser?.name || 'Aazam Afroz',
        action: `Deal stage updated to ${newStage}`,
        recordType: 'Deal',
        recordId: dealId,
        details: `Updated ${deal.title} stage.`,
      };
      setActivities((prev) => [newAct, ...prev]);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const advanceOrderStage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const nextStages = Math.min(o.stagesTotal, o.stagesCompleted + 1);
          const nextStatus: Order['status'] = nextStages >= o.stagesTotal ? 'Completed' : 'In Progress';
          return {
            ...o,
            stagesCompleted: nextStages,
            status: nextStatus,
          };
        }
        return o;
      })
    );
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const nextStages = Math.min(order.stagesTotal, order.stagesCompleted + 1);
      const newAct: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        employeeId: authUser?.id || order.assignedOpsId || 'u-1',
        employeeName: authUser?.name || order.assignedOpsName || 'Operations Specialist',
        action: 'Order Stage Advanced',
        recordType: 'Order',
        recordId: orderId,
        details: `Advanced order #${orderId} stage to ${nextStages}/${order.stagesTotal}.`,
      };
      setActivities((prev) => [newAct, ...prev]);
    }
  };

  const quickAcceptQuotation = (quoteId: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Accepted' } : q))
    );
    const quote = quotations.find((q) => q.id === quoteId);
    if (quote) {
      setLeads((prev) =>
        prev.map((l) => (l.id === quote.leadId ? { ...l, status: 'Converted' } : l))
      );
      const newAct: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        employeeId: authUser?.id || 'u-6',
        employeeName: authUser?.name || quote.assignedSalesName || 'Aazam Afroz',
        action: 'Quotation Accepted',
        recordType: 'Quotation',
        recordId: quoteId,
        details: `Commercial quotation #${quoteId} accepted for ₹${quote.finalAmount.toLocaleString('en-IN')}.`,
      };
      setActivities((prev) => [newAct, ...prev]);
    }
  };

  // 1. Filtered Records for Current Period
  const currentFiltered = useMemo(() => {
    return filterRecords(leads, quotations, deals, orders, invoices, payments, activities, filters);
  }, [leads, quotations, deals, orders, invoices, payments, activities, filters]);

  // 2. Previous Comparison Period
  const prevPeriodRange = useMemo(() => {
    return getPreviousPeriodRange(filters.dateRange);
  }, [filters.dateRange]);

  const prevFiltered = useMemo(() => {
    return filterRecords(
      leads,
      quotations,
      deals,
      orders,
      invoices,
      payments,
      activities,
      filters,
      {
        startDate: prevPeriodRange.startDate,
        endDate: prevPeriodRange.endDate,
      }
    );
  }, [leads, quotations, deals, orders, invoices, payments, activities, filters, prevPeriodRange]);

  // 3. Comparison KPIs
  const comparison = useMemo(() => {
    const currentKpi = calculateKpiData(
      currentFiltered.filteredLeads,
      currentFiltered.filteredQuotations,
      currentFiltered.filteredDeals,
      currentFiltered.filteredOrders,
      currentFiltered.filteredInvoices,
      currentFiltered.filteredPayments
    );
    const prevKpi = calculateKpiData(
      prevFiltered.filteredLeads,
      prevFiltered.filteredQuotations,
      prevFiltered.filteredDeals,
      prevFiltered.filteredOrders,
      prevFiltered.filteredInvoices,
      prevFiltered.filteredPayments
    );
    return calculateComparison(currentKpi, prevKpi, prevPeriodRange.days);
  }, [currentFiltered, prevFiltered, prevPeriodRange.days]);

  // 4. Derived Chart Datasets
  const leadSources = useMemo(() => {
    return getLeadSourcesData(currentFiltered.filteredLeads);
  }, [currentFiltered.filteredLeads]);

  const dailyLeadTrend = useMemo(() => {
    return getDailyLeadTrendData(
      currentFiltered.filteredLeads,
      filters.dateRange.startDate,
      filters.dateRange.endDate
    );
  }, [currentFiltered.filteredLeads, filters.dateRange]);

  const quotationCategories = useMemo(() => {
    return getQuotationCategoryData(currentFiltered.filteredQuotations);
  }, [currentFiltered.filteredQuotations]);

  const dealsVsRevenue = useMemo(() => {
    return getDealsVsRevenueData(currentFiltered.filteredDeals);
  }, [currentFiltered.filteredDeals]);

  const revenueCategories = useMemo(() => {
    return getRevenueCategoryBreakdown(currentFiltered.filteredDeals);
  }, [currentFiltered.filteredDeals]);

  const priorityBreakdown = useMemo(() => {
    return getPriorityBreakdown(currentFiltered.filteredDeals);
  }, [currentFiltered.filteredDeals]);

  const dailyRevenueTrend = useMemo(() => {
    return getDailyRevenueTrendData(
      currentFiltered.filteredDeals,
      currentFiltered.filteredPayments,
      filters.dateRange.startDate,
      filters.dateRange.endDate
    );
  }, [currentFiltered.filteredDeals, currentFiltered.filteredPayments, filters.dateRange]);

  // Filtered dataset for team activity ranking within the active period
  const periodDateFiltered = useMemo(() => {
    return filterRecords(leads, quotations, deals, orders, invoices, payments, activities, {
      ...filters,
      userId: 'all',
      department: 'all',
    });
  }, [leads, quotations, deals, orders, invoices, payments, activities, filters.dateRange]);

  const salesTeamActivity = useMemo(() => {
    return getSalesTeamActivity(
      periodDateFiltered.filteredLeads,
      periodDateFiltered.filteredQuotations,
      periodDateFiltered.filteredDeals,
      periodDateFiltered.filteredPayments
    );
  }, [periodDateFiltered]);

  const opsTeamActivity = useMemo(() => {
    return getOperationsTeamActivity(periodDateFiltered.filteredOrders);
  }, [periodDateFiltered]);

  const orderProgress = useMemo(() => {
    return getOrderProgressData(currentFiltered.filteredOrders);
  }, [currentFiltered.filteredOrders]);

  const paymentMethods = useMemo(() => {
    return getPaymentMethodBreakdown(currentFiltered.filteredPayments);
  }, [currentFiltered.filteredPayments]);

  const invoiceStatuses = useMemo(() => {
    return getInvoiceStatusBreakdown(currentFiltered.filteredInvoices);
  }, [currentFiltered.filteredInvoices]);

  return (
    <AppContext.Provider
      value={{
        authUser,
        login,
        logout,
        demoLoginAs,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        monthlyTarget,
        setMonthlyTarget,
        preferences,
        savePreferences,
        resetPreferencesToDefault,
        leads,
        quotations,
        deals,
        orders,
        invoices,
        payments,
        activities,
        users: USERS,
        addLead,
        addQuotation,
        addDeal,
        recordPayment,
        updateLeadStatus,
        updateDealStage,
        updateOrderStatus,
        advanceOrderStage,
        quickAcceptQuotation,
        currentFiltered,
        comparison,
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
        selectedLeadId,
        setSelectedLeadId,
        selectedQuotationId,
        setSelectedQuotationId,
        selectedDealId,
        setSelectedDealId,
        selectedOrderId,
        setSelectedOrderId,
        selectedPaymentId,
        setSelectedPaymentId,
        selectedInvoiceId,
        setSelectedInvoiceId,
        isSearchOpen,
        setIsSearchOpen,
        isCustomDateOpen,
        setIsCustomDateOpen,
        isCreateLeadOpen,
        setIsCreateLeadOpen,
        isCreateQuotationOpen,
        setIsCreateQuotationOpen,
        isCreateDealOpen,
        setIsCreateDealOpen,
        isRecordPaymentOpen,
        setIsRecordPaymentOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
