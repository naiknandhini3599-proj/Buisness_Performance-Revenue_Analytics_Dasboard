import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ComparisonKpis,
  DailyRevenuePoint,
  PaymentMethodStat,
  InvoiceStatusStat,
} from '../utils/calculations';
import { Payment, Invoice } from '../types';
import { formatINR } from '../utils/formatters';

interface FinanceAnalyticsSectionProps {
  currentKpi: ComparisonKpis['current'];
  dailyRevenueTrend: DailyRevenuePoint[];
  paymentMethods: PaymentMethodStat[];
  invoiceStatuses: InvoiceStatusStat[];
  recentPayments: Payment[];
  recentInvoices: Invoice[];
  onSelectPayment?: (paymentId: string) => void;
  onSelectInvoice?: (invoiceId: string) => void;
  onOpenOrdersPage?: () => void;
}

export const FinanceAnalyticsSection: React.FC<FinanceAnalyticsSectionProps> = ({
  currentKpi,
  dailyRevenueTrend,
  paymentMethods,
  invoiceStatuses,
  recentPayments,
  recentInvoices,
  onSelectPayment,
  onSelectInvoice,
  onOpenOrdersPage,
}) => {
  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Collection Trends & Payment Methods */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card 1: Daily Cash Inflow & Collections Trend (2 cols) */}
        <div className="rounded-xl border border-[#D5E2F1] bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F2042]">
                  Payment Collections & Cash Inflow Velocity
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Daily reconciled bank remittances and realized collections vs billing volume
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-[#64748B]">Total Realized</div>
              <div className="text-sm font-bold text-emerald-600">
                {formatINR(currentKpi.totalCollected)}
              </div>
            </div>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="financeCollectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  stroke="#CBD5E1"
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val) || 0), 'Collected']}
                  labelStyle={{ fontWeight: 'bold', color: '#0F2042' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  name="Collected Revenue"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#financeCollectedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#F0F4FA] pt-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Reconciled Collections</span>
              </div>
              <div className="text-[11px] text-[#64748B]">
                Efficiency Rate: <span className="font-semibold text-emerald-700">{currentKpi.collectionRate}%</span>
              </div>
            </div>
            <span className="text-[11px] text-[#64748B]">Source: Bank Reconciliation Ledgers</span>
          </div>
        </div>

        {/* Card 2: Payment Methods Breakdown (1 col) */}
        <div className="flex flex-col justify-between rounded-xl border border-[#D5E2F1] bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F2042]">Payment Channels</h3>
                  <p className="text-[11px] text-[#64748B]">Remittance distribution</p>
                </div>
              </div>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                {paymentMethods.length} Methods
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {paymentMethods.map((pm) => (
                <div key={pm.method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1E293B]">{pm.method}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0F2042]">{formatINR(pm.amount)}</span>
                      <span className="text-[10px] text-[#64748B]">({pm.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pm.percentage}%`,
                        backgroundColor: pm.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-[#F0F4FA] pt-3 text-center text-[11px] text-[#64748B]">
            Primary gateway: <strong className="text-[#0F2042]">UPI Instant Remittance</strong>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Tax Invoices Status & Recent Transactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Invoices Status & Receivables Aging (1 col) */}
        <div className="rounded-xl border border-[#D5E2F1] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F2042]">Tax Invoices Status</h3>
                <p className="text-[11px] text-[#64748B]">Billing & balance ledger</p>
              </div>
            </div>
            <button
              onClick={onOpenOrdersPage}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {invoiceStatuses.map((stat) => (
              <div
                key={stat.status}
                className="flex items-center justify-between rounded-lg border border-[#E2E8F0] p-3 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: stat.color }}
                  />
                  <div>
                    <div className="text-xs font-bold text-[#0F2042]">{stat.status}</div>
                    <div className="text-[10px] text-[#64748B]">{stat.count} Tax Invoices</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#0F2042]">{formatINR(stat.amount)}</div>
                  <div className="text-[10px] text-[#64748B]">{stat.percentage}% of invoiced</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-amber-50/70 border border-amber-200 p-3">
            <div className="text-xs font-bold text-amber-900">Outstanding Receivables</div>
            <div className="text-sm font-extrabold text-amber-700 mt-0.5">
              {formatINR(currentKpi.outstandingRevenue)}
            </div>
            <div className="text-[10px] text-amber-800 mt-1">
              Active accounts pending client disbursement. Monitored by Rajesh Verma (Finance Controller).
            </div>
          </div>
        </div>

        {/* Recent Payment Reconciliations & Transactions Table (2 cols) */}
        <div className="rounded-xl border border-[#D5E2F1] bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F2042]">
                  Recent Payment Transactions & Reconciliations
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Verified bank transaction references and settlement receipts
                </p>
              </div>
            </div>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {recentPayments.length} Reconciled
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B]">
                  <th className="pb-2">Receipt ID</th>
                  <th className="pb-2">Customer Account</th>
                  <th className="pb-2">Channel</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2">Txn Reference</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {recentPayments.slice(0, 7).map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPayment?.(p.id)}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 font-bold text-blue-600 group-hover:underline">
                      {p.id}
                    </td>
                    <td className="py-2.5 font-semibold text-[#0F2042] max-w-[140px] truncate">
                      {p.customerName}
                    </td>
                    <td className="py-2.5 text-[#64748B]">{p.method}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-2.5 text-[11px] text-[#64748B] font-mono truncate max-w-[130px]">
                      {p.transactionRef}
                    </td>
                    <td className="py-2.5 text-[#64748B] text-[11px] whitespace-nowrap">
                      {new Date(p.paymentDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        <span>Paid</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#F0F4FA] pt-2 text-[11px] text-[#64748B]">
            <span>Finance Controller: Rajesh Verma</span>
            <span>Click any record to inspect audit details</span>
          </div>
        </div>
      </div>
    </div>
  );
};
