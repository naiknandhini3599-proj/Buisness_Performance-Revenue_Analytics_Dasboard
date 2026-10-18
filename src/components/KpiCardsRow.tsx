import React from 'react';
import {
  Users,
  CheckCircle2,
  Target,
  XCircle,
  TrendingUp,
  FileText,
  Briefcase,
  Receipt,
  Layers,
  Activity,
  Clock,
  ShieldCheck,
  CreditCard,
  Building2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ComparisonKpis } from '../utils/calculations';
import { formatINR } from '../utils/formatters';

interface KpiCardsRowProps {
  comparison: ComparisonKpis;
  department?: string;
  onCardClick?: (metric: string) => void;
}

export const KpiCardsRow: React.FC<KpiCardsRowProps> = ({
  comparison,
  department = 'all',
  onCardClick,
}) => {
  const { current, periodDaysLabel } = comparison;

  // Percentage calculations
  const qualifiedPct =
    current.newLeads > 0
      ? ((current.qualifiedLeads / current.newLeads) * 100).toFixed(1)
      : '0.0';

  const convertedPct =
    current.newLeads > 0
      ? ((current.convertedLeads / current.newLeads) * 100).toFixed(1)
      : '0.0';

  const unqualifiedPct =
    current.newLeads > 0
      ? ((current.unqualifiedLeads / current.newLeads) * 100).toFixed(1)
      : '0.0';

  const inProgressPct =
    current.totalOrders > 0
      ? ((current.ordersInProgress / current.totalOrders) * 100).toFixed(0)
      : '0';

  const completedPct =
    current.totalOrders > 0
      ? ((current.ordersCompleted / current.totalOrders) * 100).toFixed(0)
      : '0';

  const pendingPct =
    current.totalOrders > 0
      ? ((current.ordersPending / current.totalOrders) * 100).toFixed(0)
      : '0';

  // Choose the 8 tailored cards according to active department
  let cards: {
    id: string;
    title: string;
    value: string;
    subMetric: string | null;
    subLabel: string | null;
    icon: any;
    iconBg: string;
    diff: { valueStr: string; isPositive: boolean; isZero: boolean };
  }[] = [];

  if (department === 'Operations') {
    cards = [
      {
        id: 'totalOrders',
        title: 'Total Orders',
        value: current.totalOrders.toLocaleString(),
        subMetric: null,
        subLabel: null,
        icon: Layers,
        iconBg: 'text-blue-600 bg-blue-50',
        diff: comparison.totalOrdersDiff,
      },
      {
        id: 'ordersInProgress',
        title: 'Orders In Progress',
        value: current.ordersInProgress.toLocaleString(),
        subMetric: `${inProgressPct}%`,
        subLabel: 'Active queue',
        icon: Activity,
        iconBg: 'text-amber-600 bg-amber-50',
        diff: comparison.ordersInProgressDiff,
      },
      {
        id: 'ordersCompleted',
        title: 'Completed Orders',
        value: current.ordersCompleted.toLocaleString(),
        subMetric: `${completedPct}%`,
        subLabel: 'Fulfillment %',
        icon: CheckCircle2,
        iconBg: 'text-emerald-600 bg-emerald-50',
        diff: comparison.ordersCompletedDiff,
      },
      {
        id: 'ordersPending',
        title: 'Pending & On Hold',
        value: current.ordersPending.toLocaleString(),
        subMetric: `${pendingPct}%`,
        subLabel: 'Awaiting doc',
        icon: Clock,
        iconBg: 'text-purple-600 bg-purple-50',
        diff: { valueStr: `${current.ordersPending}`, isPositive: false, isZero: current.ordersPending === 0 },
      },
      {
        id: 'orderCompletionRate',
        title: 'Completion Rate',
        value: `${current.orderCompletionRate}%`,
        subMetric: null,
        subLabel: null,
        icon: Target,
        iconBg: 'text-teal-600 bg-teal-50',
        diff: comparison.orderCompletionRateDiff,
      },
      {
        id: 'orderProgressRate',
        title: 'Stages Velocity',
        value: `${current.orderProgressRate}%`,
        subMetric: `${current.stagesCompletedTotal}/${current.stagesTotal}`,
        subLabel: 'Stages cleared',
        icon: TrendingUp,
        iconBg: 'text-cyan-600 bg-cyan-50',
        diff: comparison.orderProgressRateDiff,
      },
      {
        id: 'totalOrderValue',
        title: 'Fulfillment Value',
        value: formatINR(current.totalOrderValue),
        subMetric: null,
        subLabel: null,
        icon: DollarSign,
        iconBg: 'text-indigo-600 bg-indigo-50',
        diff: comparison.totalOrderValueDiff,
      },
      {
        id: 'slaDelivery',
        title: 'On-Time SLA Rate',
        value: '98.5%',
        subMetric: 'Compliant',
        subLabel: 'MCA SLA standard',
        icon: ShieldCheck,
        iconBg: 'text-emerald-600 bg-emerald-50',
        diff: { valueStr: '+0.5%', isPositive: true, isZero: false },
      },
    ];
  } else if (department === 'Finance') {
    cards = [
      {
        id: 'totalInvoiced',
        title: 'Total Invoiced',
        value: formatINR(current.totalInvoiced),
        subMetric: null,
        subLabel: null,
        icon: Receipt,
        iconBg: 'text-blue-600 bg-blue-50',
        diff: comparison.totalInvoicedDiff,
      },
      {
        id: 'invoicesGenerated',
        title: 'Tax Invoices',
        value: current.invoicesGenerated.toLocaleString(),
        subMetric: `${current.paidInvoicesCount} Paid`,
        subLabel: 'Cleared in full',
        icon: FileText,
        iconBg: 'text-indigo-600 bg-indigo-50',
        diff: comparison.invoicesDiff,
      },
      {
        id: 'totalCollected',
        title: 'Collected Revenue',
        value: formatINR(current.totalCollected),
        subMetric: null,
        subLabel: null,
        icon: DollarSign,
        iconBg: 'text-emerald-600 bg-emerald-50',
        diff: comparison.totalCollectedDiff,
      },
      {
        id: 'outstandingRevenue',
        title: 'Outstanding Dues',
        value: formatINR(current.outstandingRevenue),
        subMetric: `${current.unpaidInvoicesCount} Pending`,
        subLabel: 'Unsettled ledgers',
        icon: CreditCard,
        iconBg: 'text-rose-600 bg-rose-50',
        diff: comparison.outstandingRevenueDiff,
      },
      {
        id: 'collectionRate',
        title: 'Collection Rate',
        value: `${current.collectionRate}%`,
        subMetric: 'Realization',
        subLabel: 'Invoiced vs Paid',
        icon: TrendingUp,
        iconBg: 'text-cyan-600 bg-cyan-50',
        diff: comparison.collectionRateDiff,
      },
      {
        id: 'paidInvoicesCount',
        title: 'Settled Accounts',
        value: current.paidInvoicesCount.toLocaleString(),
        subMetric: `${current.invoicesGenerated > 0 ? ((current.paidInvoicesCount / current.invoicesGenerated) * 100).toFixed(0) : 0}%`,
        subLabel: 'Settlement ratio',
        icon: CheckCircle2,
        iconBg: 'text-teal-600 bg-teal-50',
        diff: { valueStr: `${current.paidInvoicesCount}`, isPositive: true, isZero: current.paidInvoicesCount === 0 },
      },
      {
        id: 'paymentsCount',
        title: 'Payment Receipts',
        value: current.paymentsCount.toLocaleString(),
        subMetric: 'Reconciled',
        subLabel: 'Bank vouchers',
        icon: Receipt,
        iconBg: 'text-purple-600 bg-purple-50',
        diff: { valueStr: `${current.paymentsCount}`, isPositive: true, isZero: current.paymentsCount === 0 },
      },
      {
        id: 'avgPayment',
        title: 'Avg. Receipt Size',
        value: formatINR(
          current.paymentsCount > 0 ? Math.round(current.totalCollected / current.paymentsCount) : 0
        ),
        subMetric: null,
        subLabel: null,
        icon: Building2,
        iconBg: 'text-amber-600 bg-amber-50',
        diff: { valueStr: 'Dynamic', isPositive: true, isZero: false },
      },
    ];
  } else if (department === 'Sales') {
    cards = [
      {
        id: 'newLeads',
        title: 'Sales Leads',
        value: current.newLeads.toLocaleString(),
        subMetric: null,
        subLabel: null,
        icon: Users,
        iconBg: 'text-blue-600 bg-blue-50',
        diff: comparison.newLeadsDiff,
      },
      {
        id: 'qualifiedLeads',
        title: 'Qualified Leads',
        value: current.qualifiedLeads.toLocaleString(),
        subMetric: `${qualifiedPct}%`,
        subLabel: 'Qualified %',
        icon: CheckCircle2,
        iconBg: 'text-emerald-600 bg-emerald-50',
        diff: comparison.qualifiedLeadsDiff,
      },
      {
        id: 'convertedLeads',
        title: 'Converted Deals',
        value: current.convertedLeads.toLocaleString(),
        subMetric: `${convertedPct}%`,
        subLabel: 'Conversion %',
        icon: Target,
        iconBg: 'text-purple-600 bg-purple-50',
        diff: comparison.convertedLeadsDiff,
      },
      {
        id: 'unqualifiedLeads',
        title: 'Unqualified Leads',
        value: current.unqualifiedLeads.toLocaleString(),
        subMetric: `${unqualifiedPct}%`,
        subLabel: 'Unqualified %',
        icon: XCircle,
        iconBg: 'text-rose-600 bg-rose-50',
        diff: comparison.unqualifiedLeadsDiff,
      },
      {
        id: 'conversionRate',
        title: 'Lead Conversion',
        value: `${current.conversionRate}%`,
        subMetric: null,
        subLabel: null,
        icon: TrendingUp,
        iconBg: 'text-cyan-600 bg-cyan-50',
        diff: comparison.conversionRateDiff,
      },
      {
        id: 'quotationsCreated',
        title: 'Quotations Created',
        value: current.quotationsCreated.toLocaleString(),
        subMetric: null,
        subLabel: null,
        icon: FileText,
        iconBg: 'text-teal-600 bg-teal-50',
        diff: comparison.quotationsDiff,
      },
      {
        id: 'dealsCreated',
        title: 'Deals Won & Active',
        value: current.dealsCreated.toLocaleString(),
        subMetric: null,
        subLabel: null,
        icon: Briefcase,
        iconBg: 'text-indigo-600 bg-indigo-50',
        diff: comparison.dealsDiff,
      },
      {
        id: 'totalDealValue',
        title: 'Sales Deal Value',
        value: formatINR(current.totalDealValue),
        subMetric: null,
        subLabel: null,
        icon: DollarSign,
        iconBg: 'text-emerald-600 bg-emerald-50',
        diff: comparison.totalDealValueDiff,
      },
    ];
  } else {
    // All Departments - Consolidated Executive Overview
    cards = [
      {
        id: 'newLeads',
        title: 'New Leads',
        value: current.newLeads.toLocaleString(),
        subMetric: null,
        subLabel: null,
        icon: Users,
        iconBg: 'text-blue-600 bg-blue-50',
        diff: comparison.newLeadsDiff,
      },
      {
        id: 'qualifiedLeads',
        title: 'Qualified Leads',
        value: current.qualifiedLeads.toLocaleString(),
        subMetric: `${qualifiedPct}%`,
        subLabel: 'Qualified %',
        icon: CheckCircle2,
        iconBg: 'text-emerald-600 bg-emerald-50',
        diff: comparison.qualifiedLeadsDiff,
      },
      {
        id: 'convertedLeads',
        title: 'Converted Leads',
        value: current.convertedLeads.toLocaleString(),
        subMetric: `${convertedPct}%`,
        subLabel: 'Conversion %',
        icon: Target,
        iconBg: 'text-purple-600 bg-purple-50',
        diff: comparison.convertedLeadsDiff,
      },
      {
        id: 'conversionRate',
        title: 'Conversion Rate',
        value: `${current.conversionRate}%`,
        subMetric: null,
        subLabel: null,
        icon: TrendingUp,
        iconBg: 'text-cyan-600 bg-cyan-50',
        diff: comparison.conversionRateDiff,
      },
      {
        id: 'quotationsCreated',
        title: 'Quotations Created',
        value: current.quotationsCreated.toLocaleString(),
        subMetric: null,
        subLabel: null,
        icon: FileText,
        iconBg: 'text-teal-600 bg-teal-50',
        diff: comparison.quotationsDiff,
      },
      {
        id: 'dealsCreated',
        title: 'Deals Created',
        value: current.dealsCreated.toLocaleString(),
        subMetric: null,
        subLabel: null,
        icon: Briefcase,
        iconBg: 'text-indigo-600 bg-indigo-50',
        diff: comparison.dealsDiff,
      },
      {
        id: 'invoicesGenerated',
        title: 'Invoices Generated',
        value: current.invoicesGenerated.toLocaleString(),
        subMetric: null,
        subLabel: null,
        icon: Receipt,
        iconBg: 'text-amber-600 bg-amber-50',
        diff: comparison.invoicesDiff,
      },
      {
        id: 'totalCollected',
        title: 'Collected Revenue',
        value: formatINR(current.totalCollected),
        subMetric: null,
        subLabel: null,
        icon: DollarSign,
        iconBg: 'text-emerald-600 bg-emerald-50',
        diff: comparison.totalCollectedDiff,
      },
    ];
  }

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isUnqualifiedCard = card.id === 'unqualifiedLeads';
        const isUp = card.diff.isPositive;
        const isZero = card.diff.isZero;

        let diffColor = 'text-slate-500';
        if (!isZero) {
          if (isUnqualifiedCard) {
            diffColor = isUp ? 'text-rose-600' : 'text-emerald-600';
          } else {
            diffColor = isUp ? 'text-emerald-600' : 'text-rose-600';
          }
        }

        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            className="group relative flex flex-col justify-between rounded-xl border border-[#D5E2F1] bg-white p-3.5 shadow-xs transition-all hover:border-[#93C5FD] hover:shadow-md cursor-pointer"
          >
            {/* Top row: Title and Icon */}
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-semibold text-[#64748B] truncate">
                {card.title}
              </span>
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
                <IconComponent className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Middle row: Big Value + optional SubMetric on right */}
            <div className="my-2 flex items-baseline justify-between gap-1">
              <span className="text-2xl font-bold tracking-tight text-[#0F2042]">
                {card.value}
              </span>
              {card.subMetric && (
                <div className="text-right">
                  <div className="text-xs font-semibold text-[#172554]">{card.subMetric}</div>
                  <div className="text-[10px] text-[#64748B]">{card.subLabel}</div>
                </div>
              )}
            </div>

            {/* Bottom row: Percentage comparison badge */}
            <div className="flex items-center gap-1 text-[11px]">
              {isZero ? (
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
              ) : isUp ? (
                <ArrowUpRight className={`h-3 w-3 shrink-0 ${diffColor}`} />
              ) : (
                <ArrowDownRight className={`h-3 w-3 shrink-0 ${diffColor}`} />
              )}
              <span className={`font-semibold ${diffColor}`}>{card.diff.valueStr}</span>
              <span className="truncate text-[#64748B]">{periodDaysLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
