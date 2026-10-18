import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  CheckCircle2,
  Clock,
  DollarSign,
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  FileText,
  Receipt,
} from 'lucide-react';
import { formatINR, formatDateFull } from '../../utils/formatters';

export const OrdersPage: React.FC = () => {
  const {
    currentFiltered,
    orderProgress,
    updateOrderStatus,
    setSelectedOrderId,
    setSelectedPaymentId,
    setSelectedInvoiceId,
    setSelectedDealId,
    setIsRecordPaymentOpen,
    advanceOrderStage,
    filters,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'payments' | 'invoices'>('orders');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const orders = currentFiltered.filteredOrders;
  const payments = currentFiltered.filteredPayments;
  const invoices = currentFiltered.filteredInvoices;

  const completedOrders = orders.filter((o) => o.status === 'Completed').length;
  const inProgressOrders = orders.filter((o) => o.status === 'In Progress').length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const totalOrderValue = orders.reduce((sum, o) => sum + o.orderValue, 0);
  const collectedPayments = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingPayments = Math.max(0, totalOrderValue - collectedPayments);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.serviceCategory.toLowerCase().includes(q) ||
      o.assignedOpsName.toLowerCase().includes(q) ||
      (o.assignedSalesName ? o.assignedSalesName.toLowerCase().includes(q) : false)
    );
  });

  const filteredPayments = payments.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.transactionRef.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
            Fulfillment Orders & Payment Reconciliations
          </h1>
          <p className="mt-1 text-xs text-[#64748B]">
            Monitor multi-stage operational delivery milestones, invoice settlements, and bank payment receipts.
          </p>
        </div>
        <button
          onClick={() => setIsRecordPaymentOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer self-start sm:self-auto"
        >
          <CreditCard className="h-4 w-4" />
          <span>Record Bank Payment</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Total Orders</span>
          <div className="mt-1 text-2xl font-bold text-[#0F172A]">{orders.length}</div>
          <div className="text-[10px] text-blue-600 font-semibold">Operational Jobs</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Completed</span>
          <div className="mt-1 text-2xl font-bold text-emerald-700">{completedOrders}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Stages Delivered</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">In Progress</span>
          <div className="mt-1 text-2xl font-bold text-cyan-700">{inProgressOrders}</div>
          <div className="text-[10px] text-cyan-600 font-semibold">Active processing</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Order Value</span>
          <div className="mt-1 text-xl font-bold text-[#1E3A8A]">{formatINR(totalOrderValue)}</div>
          <div className="text-[10px] text-[#64748B]">Booked Fulfillment</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Collected Receipts</span>
          <div className="mt-1 text-xl font-bold text-emerald-700">{formatINR(collectedPayments)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">{payments.length} Payments</div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs">
          <span className="text-[10px] font-semibold text-[#64748B]">Outstanding</span>
          <div className="mt-1 text-xl font-bold text-amber-700">{formatINR(outstandingPayments)}</div>
          <div className="text-[10px] text-amber-600 font-semibold">Unsettled Invoices</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0]">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
            activeTab === 'orders'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Fulfillment Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
            activeTab === 'payments'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payment History & Receipts ({payments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
            activeTab === 'invoices'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Tax Invoices ({invoices.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders Table */}
      {activeTab === 'orders' && (
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders by ID, service, ops..."
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-8 pr-3 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <span className="text-xs font-medium text-[#64748B]">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Service Category</th>
                  <th className="px-4 py-3 text-right">Order Value</th>
                  <th className="px-4 py-3">Operations Specialist</th>
                  <th className="px-4 py-3">Attributed Sales Rep</th>
                  <th className="px-4 py-3 text-center">Stage Progress</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredOrders.slice(0, 25).map((order) => {
                  const pct = Math.round((order.stagesCompleted / order.stagesTotal) * 100);
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-[#F59E0B]">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0F172A]">
                        {order.serviceCategory}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#0F172A]">
                        {formatINR(order.orderValue)}
                      </td>
                      <td className="px-4 py-3 text-[#1E293B] font-medium">
                        {order.assignedOpsName}
                      </td>
                      <td className="px-4 py-3 text-[#475569]">
                        {order.assignedSalesName || 'Sales Team'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[10px] font-bold text-[#0F172A]">
                            {order.stagesCompleted}/{order.stagesTotal}
                          </span>
                          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[#E2E8F0]">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="rounded border border-[#CBD5E1] bg-white px-2 py-0.5 text-[10px] font-bold text-[#0F172A]"
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right text-[#64748B]">
                        {formatDateFull(order.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Payments History Table */}
      {activeTab === 'payments' && (
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions, customer, ref..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-8 pr-3 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
              />
            </div>

            <span className="text-xs font-medium text-[#64748B]">
              Showing {filteredPayments.length} of {payments.length} transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="px-4 py-3">Receipt ID</th>
                  <th className="px-4 py-3">Customer Entity</th>
                  <th className="px-4 py-3">Transaction Reference</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Settlement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredPayments.slice(0, 25).map((pay) => (
                  <tr
                    key={pay.id}
                    onClick={() => setSelectedPaymentId(pay.id)}
                    className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-emerald-600">
                      #{pay.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#0F172A]">
                      {pay.customerName}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#475569]">
                      {pay.transactionRef}
                    </td>
                    <td className="px-4 py-3 text-[#1E293B]">
                      {pay.method}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#0F172A]">
                      {formatINR(pay.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#64748B]">
                      {formatDateFull(pay.paymentDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Tax Invoices Table */}
      {activeTab === 'invoices' && (
        <div className="rounded-xl border border-[#D5E2F1] bg-white shadow-xs overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] p-4 bg-[#F8FAFC]">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoices by ID, client..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-8 pr-3 py-1.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
              />
            </div>

            <span className="text-xs font-medium text-[#64748B]">
              Showing {invoices.length} Tax Invoices
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="px-4 py-3">Invoice ID</th>
                  <th className="px-4 py-3">Customer Entity</th>
                  <th className="px-4 py-3 text-right">Invoice Amount</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Balance Due</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Controller</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {invoices
                  .filter((inv) => {
                    if (!search.trim()) return true;
                    const q = search.toLowerCase();
                    return (
                      inv.id.toLowerCase().includes(q) ||
                      inv.customerName.toLowerCase().includes(q)
                    );
                  })
                  .map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoiceId(inv.id)}
                      className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-blue-600">
                        {inv.id}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0F2042]">
                        {inv.customerName}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#0F2042]">
                        {formatINR(inv.invoiceAmount)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600">
                        {formatINR(inv.paidAmount)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-rose-600">
                        {formatINR(inv.balanceAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inv.status === 'Partially Paid'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#64748B]">
                        {formatDateFull(inv.issueDate)}
                      </td>
                      <td className="px-4 py-3 text-[#64748B]">
                        {inv.assignedFinanceName || 'Rajesh Verma'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
