import React from 'react';
import { X, Briefcase, ExternalLink, PackageCheck, Receipt, CreditCard } from 'lucide-react';
import { Deal, Lead, Order, Invoice, Payment } from '../../types';
import { formatINR, formatDateFull } from '../../utils/formatters';

interface DealDetailModalProps {
  deal: Deal | null;
  lead?: Lead;
  orders: Order[];
  invoices: Invoice[];
  payments: Payment[];
  onClose: () => void;
  onSelectLead: (id: string) => void;
  onSelectOrder: (id: string) => void;
  onSelectPayment: (id: string) => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  lead,
  orders,
  invoices,
  payments,
  onClose,
  onSelectLead,
  onSelectOrder,
  onSelectPayment,
}) => {
  if (!deal) return null;

  const dealOrders = orders.filter((o) => o.dealId === deal.id);
  const dealInvoices = invoices.filter((i) => i.dealId === deal.id);
  const dealPayments = payments.filter((p) => p.dealId === deal.id);

  const getPriorityBadge = (p: string) => {
    if (p === 'High') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (p === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-[#8B5CF6]">
              #{deal.id}
            </span>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">{deal.title}</h3>
              <p className="text-xs text-[#64748B]">Category: {deal.serviceCategory}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPriorityBadge(deal.priority)}`}>
              {deal.priority} Priority
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Deal Value Overview Card */}
          <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div>
              <span className="text-[11px] font-medium text-[#64748B]">Recognized Deal Value</span>
              <div className="text-2xl font-bold text-[#0F172A]">{formatINR(deal.amount)}</div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-[#64748B]">Pipeline Stage</span>
              <div className="text-sm font-bold text-emerald-600">{deal.stage}</div>
            </div>
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#E2E8F0] p-4 text-xs">
            <div>
              <span className="text-[#64748B]">Sales Representative:</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{deal.assignedSalesName}</div>
            </div>
            <div>
              <span className="text-[#64748B]">Created On:</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{formatDateFull(deal.createdAt)}</div>
            </div>
            <div>
              <span className="text-[#64748B]">Expected Close Date:</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{formatDateFull(deal.expectedCloseDate)}</div>
            </div>
            <div>
              <span className="text-[#64748B]">Actual Close Date:</span>
              <div className="font-bold text-emerald-600 mt-0.5">
                {deal.closedAt ? formatDateFull(deal.closedAt) : 'Pending'}
              </div>
            </div>
          </div>

          {/* Associated Lead Link */}
          {lead && (
            <div
              onClick={() => onSelectLead(lead.id)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-blue-100 bg-[#EFF6FF] p-3.5 hover:bg-blue-100 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                  Associated Lead
                </span>
                <div className="text-sm font-bold text-[#1E3A8A]">{lead.companyName}</div>
                <div className="text-xs text-[#3B82F6]">{lead.name} • {lead.email}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#2563EB]" />
            </div>
          )}

          {/* Associated Orders */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] mb-2 flex items-center gap-1.5">
              <PackageCheck className="h-3.5 w-3.5 text-[#F59E0B]" />
              Fulfillment Orders ({dealOrders.length})
            </h4>
            {dealOrders.length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic">No active fulfillment orders yet.</p>
            ) : (
              <div className="space-y-2">
                {dealOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => onSelectOrder(o.id)}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E2E8F0] p-2.5 hover:bg-[#F8FAFC] transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#2563EB]">#{o.id}</span>
                      <span className="ml-2 font-medium text-[#1E293B]">{o.serviceCategory}</span>
                      <div className="text-[10px] text-[#64748B]">Assigned to: {o.assignedOpsName}</div>
                    </div>
                    <div className="text-right">
                      <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        {o.status} ({o.stagesCompleted}/{o.stagesTotal} stages)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payments Received */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] mb-2 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-[#10B981]" />
              Recorded Payments ({dealPayments.length})
            </h4>
            {dealPayments.length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic">No payments recorded for this deal yet.</p>
            ) : (
              <div className="space-y-2">
                {dealPayments.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectPayment(p.id)}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E2E8F0] p-2.5 hover:bg-[#F8FAFC] transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#10B981]">#{p.id}</span>
                      <span className="ml-2 font-medium text-[#1E293B]">{p.method}</span>
                      <div className="text-[10px] text-[#64748B] font-mono">{p.transactionRef}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#0F172A]">{formatINR(p.amount)}</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
