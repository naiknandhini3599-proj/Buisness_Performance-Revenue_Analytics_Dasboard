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
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ComparisonKpis } from '../utils/calculations';

interface KpiCardsRowProps {
  comparison: ComparisonKpis;
  onCardClick?: (metric: string) => void;
}

export const KpiCardsRow: React.FC<KpiCardsRowProps> = ({ comparison, onCardClick }) => {
  const { current, periodDaysLabel } = comparison;

  const qualifiedPct = current.newLeads > 0
    ? ((current.qualifiedLeads / current.newLeads) * 100).toFixed(1)
    : '0.0';

  const convertedPct = current.newLeads > 0
    ? ((current.convertedLeads / current.newLeads) * 100).toFixed(1)
    : '0.0';

  const unqualifiedPct = current.newLeads > 0
    ? ((current.unqualifiedLeads / current.newLeads) * 100).toFixed(1)
    : '0.0';

  const cards = [
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
      iconBg: 'text-emerald-600 bg-emerald-50',
      diff: comparison.invoicesDiff,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isUp = card.diff.isPositive;
        const diffColor = isUp ? 'text-emerald-600' : 'text-rose-600';

        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            className="group relative flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-xs transition-all hover:border-[#CBD5E1] hover:shadow-md cursor-pointer"
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
              <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
                {card.value}
              </span>
              {card.subMetric && (
                <div className="text-right">
                  <div className="text-xs font-semibold text-[#0F172A]">{card.subMetric}</div>
                  <div className="text-[10px] text-[#94A3B8]">{card.subLabel}</div>
                </div>
              )}
            </div>

            {/* Bottom row: Percentage comparison badge */}
            <div className="flex items-center gap-1 text-[11px]">
              {isUp ? (
                <ArrowUpRight className={`h-3 w-3 shrink-0 ${diffColor}`} />
              ) : (
                <ArrowDownRight className={`h-3 w-3 shrink-0 ${diffColor}`} />
              )}
              <span className={`font-semibold ${diffColor}`}>{card.diff.valueStr}</span>
              <span className="truncate text-[#94A3B8]">vs. {periodDaysLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
