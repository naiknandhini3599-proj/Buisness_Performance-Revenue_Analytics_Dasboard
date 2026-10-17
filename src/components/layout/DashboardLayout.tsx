import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  BarChart3,
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Layers,
  Award,
  Activity,
  Settings,
  LogOut,
  Search,
  Calendar,
  ChevronDown,
  Download,
  Bell,
  Menu,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DateRangePreset, User } from '../../types';
import {
  exportSummaryToCsv,
  exportLeadsToCsv,
  exportQuotationsToCsv,
  exportDealsToCsv,
  exportOrdersToCsv,
  exportPaymentsToCsv,
} from '../../utils/exportCsv';

// Modals
import { LeadDetailModal } from '../modals/LeadDetailModal';
import { QuotationDetailModal } from '../modals/QuotationDetailModal';
import { DealDetailModal } from '../modals/DealDetailModal';
import { OrderDetailModal } from '../modals/OrderDetailModal';
import { PaymentDetailModal } from '../modals/PaymentDetailModal';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';
import { CustomDateRangeModal } from '../modals/CustomDateRangeModal';
import { CreateLeadModal } from '../modals/CreateLeadModal';
import { CreateQuotationModal } from '../modals/CreateQuotationModal';
import { CreateDealModal } from '../modals/CreateDealModal';
import { RecordPaymentModal } from '../modals/RecordPaymentModal';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    authUser,
    logout,
    filters,
    updateFilter,
    resetFilters,
    users,
    leads,
    quotations,
    deals,
    orders,
    payments,
    invoices,
    activities,
    currentFiltered,
    comparison,
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
    isSearchOpen,
    setIsSearchOpen,
    isCustomDateOpen,
    setIsCustomDateOpen,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateDropdownOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const navLinks = [
    { to: '/app/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/app/leads', label: 'Leads', icon: Users, badge: currentFiltered.filteredLeads.length },
    { to: '/app/quotations', label: 'Quotations', icon: FileText, badge: currentFiltered.filteredQuotations.length },
    { to: '/app/deals', label: 'Deals & Revenue', icon: Briefcase, badge: currentFiltered.filteredDeals.length },
    { to: '/app/orders', label: 'Orders & Payments', icon: Layers, badge: currentFiltered.filteredOrders.length },
    { to: '/app/sales-activity', label: 'Sales Team', icon: Award },
    { to: '/app/operations', label: 'Operations', icon: Activity },
    { to: '/app/activity', label: 'Recent Activity', icon: Bell },
    { to: '/app/settings', label: 'Settings', icon: Settings },
  ];

  const handleDatePreset = (preset: DateRangePreset) => {
    setDateDropdownOpen(false);
    if (preset === 'custom') {
      setIsCustomDateOpen(true);
      return;
    }

    if (preset === 'today') {
      updateFilter({
        dateRange: {
          preset: 'today',
          startDate: '2026-10-16',
          endDate: '2026-10-16',
          label: 'Today (Oct 16)',
        },
      });
    } else if (preset === 'last7') {
      updateFilter({
        dateRange: {
          preset: 'last7',
          startDate: '2026-10-10',
          endDate: '2026-10-16',
          label: 'Last 7 Days',
        },
      });
    } else if (preset === 'last30') {
      updateFilter({
        dateRange: {
          preset: 'last30',
          startDate: '2026-09-17',
          endDate: '2026-10-16',
          label: 'Last 30 Days',
        },
      });
    } else if (preset === 'oct2026') {
      updateFilter({
        dateRange: {
          preset: 'oct2026',
          startDate: '2026-10-01',
          endDate: '2026-10-31',
          label: 'Oct 1 - Oct 31, 2026',
        },
      });
    }
  };

  const handleExport = (type: 'summary' | 'leads' | 'quotations' | 'deals' | 'orders' | 'payments') => {
    setExportDropdownOpen(false);
    if (type === 'summary') exportSummaryToCsv(comparison.current, filters.dateRange.label);
    else if (type === 'leads') exportLeadsToCsv(currentFiltered.filteredLeads);
    else if (type === 'quotations') exportQuotationsToCsv(currentFiltered.filteredQuotations);
    else if (type === 'deals') exportDealsToCsv(currentFiltered.filteredDeals);
    else if (type === 'orders') exportOrdersToCsv(currentFiltered.filteredOrders);
    else if (type === 'payments') exportPaymentsToCsv(currentFiltered.filteredPayments);
  };

  const activeLead = leads.find((l) => l.id === selectedLeadId) || null;
  const activeQuotation = quotations.find((q) => q.id === selectedQuotationId) || null;
  const activeDeal = deals.find((d) => d.id === selectedDealId) || null;
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || null;
  const activePayment = payments.find((p) => p.id === selectedPaymentId) || null;

  return (
    <div className="flex min-h-screen bg-[#F4F7FB] text-[#0F172A] antialiased">
      {/* 1. Left Sidebar Navigation */}
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#1E293B] bg-[#071426] text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#1E293B] px-6 bg-[#0B1730]/60">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] text-white shadow-md shadow-blue-500/30">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white">
                Revenue<span className="text-[#38BDF8]">Analytics</span>
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-wider text-[#22D3EE]/90">
                Enterprise Suite
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 border-l-4 border-[#22D3EE]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-[#22D3EE] text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Profile & Logout in Sidebar Footer */}
        <div className="border-t border-[#1E293B] p-4 bg-[#0B1730]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                  authUser?.avatarColor || 'bg-blue-600'
                }`}
              >
                {authUser?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
              </div>
              <div className="truncate max-w-[120px]">
                <div className="text-xs font-bold text-white truncate">
                  {authUser?.name || 'Demo User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {authUser?.department} Department
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-rose-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Page Layout Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header Controls */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 sm:px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F5F9] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Quick Global Search Bar */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#64748B] hover:border-[#94A3B8] transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search Leads, Quotes, Deals, Orders...</span>
              <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B] sm:inline border border-[#E2E8F0]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Global Filters & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Global Date Selector */}
            <div className="relative" ref={dateRef}>
              <button
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-xs"
              >
                <Calendar className="h-3.5 w-3.5 text-[#64748B]" />
                <span className="hidden sm:inline">{filters.dateRange.label}</span>
                <ChevronDown className="h-3 w-3 text-[#64748B]" />
              </button>

              {dateDropdownOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-56 rounded-xl border border-[#E2E8F0] bg-white py-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Reporting Date Range
                  </div>
                  <button
                    onClick={() => handleDatePreset('oct2026')}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                      filters.dateRange.preset === 'oct2026' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                    }`}
                  >
                    <span>Oct 1 - Oct 31, 2026</span>
                    {filters.dateRange.preset === 'oct2026' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
                  </button>
                  <button
                    onClick={() => handleDatePreset('today')}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                      filters.dateRange.preset === 'today' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                    }`}
                  >
                    <span>Today</span>
                    {filters.dateRange.preset === 'today' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
                  </button>
                  <button
                    onClick={() => handleDatePreset('last7')}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                      filters.dateRange.preset === 'last7' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                    }`}
                  >
                    <span>Last 7 Days</span>
                    {filters.dateRange.preset === 'last7' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
                  </button>
                  <button
                    onClick={() => handleDatePreset('last30')}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] flex items-center justify-between ${
                      filters.dateRange.preset === 'last30' ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#1E293B]'
                    }`}
                  >
                    <span>Last 30 Days</span>
                    {filters.dateRange.preset === 'last30' && <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
                  </button>
                  <div className="my-1 border-t border-[#F1F5F9]" />
                  <button
                    onClick={() => handleDatePreset('custom')}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF]"
                  >
                    Custom Date Range...
                  </button>
                </div>
              )}
            </div>

            {/* Global Employee / User Selector */}
            <div className="relative">
              <select
                value={filters.userId}
                onChange={(e) => updateFilter({ userId: e.target.value })}
                className="appearance-none rounded-lg border border-[#CBD5E1] bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-xs focus:border-[#2563EB] focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Employees</option>
                <optgroup label="Sales & Consulting">
                  <option value="u-6">Aazam Afroz</option>
                  <option value="u-1">Nancy Singh</option>
                  <option value="u-2">Sneha Choudhary</option>
                  <option value="u-3">Tannu Kumari</option>
                </optgroup>
                <optgroup label="Operations & Fulfillment">
                  <option value="u-4">Gaurav Pant</option>
                  <option value="u-5">Srishti Upadhyay</option>
                </optgroup>
                <optgroup label="Finance & Billing">
                  <option value="u-7">Rajesh Verma</option>
                </optgroup>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 text-[#64748B]" />
            </div>

            {/* Department Filter */}
            <div className="relative hidden md:block">
              <select
                value={filters.department}
                onChange={(e) => updateFilter({ department: e.target.value })}
                className="appearance-none rounded-lg border border-[#CBD5E1] bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-xs focus:border-[#2563EB] focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 text-[#64748B]" />
            </div>

            {/* Reset Filters Icon if active */}
            {(filters.userId !== 'all' || filters.department !== 'all') && (
              <button
                onClick={resetFilters}
                title="Reset filters to All"
                className="rounded-lg bg-slate-100 p-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                Reset
              </button>
            )}

            {/* Export CSV Menu */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8]"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {exportDropdownOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-56 rounded-xl border border-[#E2E8F0] bg-white py-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Export Filtered Records
                  </div>
                  <button
                    onClick={() => handleExport('summary')}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] text-[#1E293B]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-blue-600" />
                    <span>Summary Overview (CSV)</span>
                  </button>
                  <button
                    onClick={() => handleExport('leads')}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] text-[#1E293B]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Leads ({currentFiltered.filteredLeads.length})</span>
                  </button>
                  <button
                    onClick={() => handleExport('quotations')}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] text-[#1E293B]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-cyan-600" />
                    <span>Quotations ({currentFiltered.filteredQuotations.length})</span>
                  </button>
                  <button
                    onClick={() => handleExport('deals')}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] text-[#1E293B]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-purple-600" />
                    <span>Deals ({currentFiltered.filteredDeals.length})</span>
                  </button>
                  <button
                    onClick={() => handleExport('orders')}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] text-[#1E293B]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-amber-600" />
                    <span>Orders ({currentFiltered.filteredOrders.length})</span>
                  </button>
                  <button
                    onClick={() => handleExport('payments')}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium hover:bg-[#F1F5F9] text-[#1E293B]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Payments ({currentFiltered.filteredPayments.length})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* --- Global Drill-down Modals --- */}
      <LeadDetailModal
        lead={activeLead}
        quotations={quotations}
        deals={deals}
        onClose={() => setSelectedLeadId(null)}
        onSelectQuotation={(id) => {
          setSelectedLeadId(null);
          setSelectedQuotationId(id);
        }}
        onSelectDeal={(id) => {
          setSelectedLeadId(null);
          setSelectedDealId(id);
        }}
      />

      <QuotationDetailModal
        quotation={activeQuotation}
        lead={activeQuotation ? leads.find((l) => l.id === activeQuotation.leadId) : undefined}
        deal={activeQuotation?.dealId ? deals.find((d) => d.id === activeQuotation.dealId) : undefined}
        onClose={() => setSelectedQuotationId(null)}
        onSelectLead={(id) => {
          setSelectedQuotationId(null);
          setSelectedLeadId(id);
        }}
        onSelectDeal={(id) => {
          setSelectedQuotationId(null);
          setSelectedDealId(id);
        }}
      />

      <DealDetailModal
        deal={activeDeal}
        lead={activeDeal ? leads.find((l) => l.id === activeDeal.leadId) : undefined}
        orders={orders}
        invoices={invoices}
        payments={payments}
        onClose={() => setSelectedDealId(null)}
        onSelectLead={(id) => {
          setSelectedDealId(null);
          setSelectedLeadId(id);
        }}
        onSelectOrder={(id) => {
          setSelectedDealId(null);
          setSelectedOrderId(id);
        }}
        onSelectPayment={(id) => {
          setSelectedDealId(null);
          setSelectedPaymentId(id);
        }}
      />

      <OrderDetailModal
        order={activeOrder}
        deal={activeOrder ? deals.find((d) => d.id === activeOrder.dealId) : undefined}
        lead={activeOrder ? leads.find((l) => l.id === activeOrder.leadId) : undefined}
        payments={payments}
        invoices={invoices}
        onClose={() => setSelectedOrderId(null)}
        onSelectDeal={(id) => {
          setSelectedOrderId(null);
          setSelectedDealId(id);
        }}
        onSelectLead={(id) => {
          setSelectedOrderId(null);
          setSelectedLeadId(id);
        }}
        onSelectPayment={(id) => {
          setSelectedOrderId(null);
          setSelectedPaymentId(id);
        }}
      />

      <PaymentDetailModal
        payment={activePayment}
        deal={activePayment ? deals.find((d) => d.id === activePayment.dealId) : undefined}
        order={activePayment?.orderId ? orders.find((o) => o.id === activePayment.orderId) : undefined}
        onClose={() => setSelectedPaymentId(null)}
        onSelectDeal={(id) => {
          setSelectedPaymentId(null);
          setSelectedDealId(id);
        }}
        onSelectOrder={(id) => {
          setSelectedPaymentId(null);
          setSelectedOrderId(id);
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        leads={leads}
        quotations={quotations}
        deals={deals}
        orders={orders}
        payments={payments}
        onSelectLead={(id) => setSelectedLeadId(id)}
        onSelectQuotation={(id) => setSelectedQuotationId(id)}
        onSelectDeal={(id) => setSelectedDealId(id)}
        onSelectOrder={(id) => setSelectedOrderId(id)}
        onSelectPayment={(id) => setSelectedPaymentId(id)}
      />

      <CustomDateRangeModal
        isOpen={isCustomDateOpen}
        onClose={() => setIsCustomDateOpen(false)}
        currentRange={filters.dateRange}
        onApply={(range) => updateFilter({ dateRange: range })}
      />

      {/* Creation & Action Modals */}
      <CreateLeadModal />
      <CreateQuotationModal />
      <CreateDealModal />
      <RecordPaymentModal />
    </div>
  );
};
