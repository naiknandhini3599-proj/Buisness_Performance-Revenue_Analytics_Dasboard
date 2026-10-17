import React from 'react';
import { X, Package, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { Order, Deal, Lead, Payment, Invoice } from '../../types';
import { formatINR, formatDateFull } from '../../utils/formatters';

interface OrderDetailModalProps {
  order: Order | null;
  deal?: Deal;
  lead?: Lead;
  payments: Payment[];
  invoices: Invoice[];
  onClose: () => void;
  onSelectDeal: (id: string) => void;
  onSelectLead: (id: string) => void;
  onSelectPayment: (id: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  deal,
  lead,
  payments,
  invoices,
  onClose,
  onSelectDeal,
  onSelectLead,
  onSelectPayment,
}) => {
  if (!order) return null;

  const orderPayments = payments.filter((p) => p.orderId === order.id || (deal && p.dealId === deal.id));
  const completionPct = order.stagesTotal > 0
    ? Math.round((order.stagesCompleted / order.stagesTotal) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-[#D97706]">
              #{order.id}
            </span>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">{order.serviceCategory}</h3>
              <p className="text-xs text-[#64748B]">Assigned Specialist: {order.assignedOpsName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-[#0F172A]">
              {order.status}
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
          {/* Stage Progress Card */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F172A]">Fulfillment Stage Progress</span>
              <span className="font-bold text-[#2563EB]">
                {order.stagesCompleted} of {order.stagesTotal} Stages Completed ({completionPct}%)
              </span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {/* Key Dates & Meta */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#E2E8F0] p-4 text-xs">
            <div>
              <span className="text-[#64748B]">Creation Date:</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{formatDateFull(order.createdAt)}</div>
            </div>
            <div>
              <span className="text-[#64748B]">Expected Completion:</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{formatDateFull(order.expectedCompletionDate)}</div>
            </div>
            <div>
              <span className="text-[#64748B]">Order Recognized Value:</span>
              <div className="font-bold text-[#2563EB] mt-0.5">{formatINR(order.orderValue)}</div>
            </div>
            <div>
              <span className="text-[#64748B]">Overdue Status:</span>
              <div className={`font-bold mt-0.5 ${order.isOverdue ? 'text-rose-600' : 'text-emerald-600'}`}>
                {order.isOverdue ? 'Overdue' : 'On Track'}
              </div>
            </div>
          </div>

          {/* Links */}
          {deal && (
            <div
              onClick={() => onSelectDeal(deal.id)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-purple-100 bg-[#FAF5FF] p-3.5 hover:bg-purple-100 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">
                  Parent Deal
                </span>
                <div className="text-sm font-bold text-[#581C87]">{deal.title}</div>
                <div className="text-xs text-[#7C3AED]">Deal ID: #{deal.id}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#8B5CF6]" />
            </div>
          )}

          {lead && (
            <div
              onClick={() => onSelectLead(lead.id)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-blue-100 bg-[#EFF6FF] p-3.5 hover:bg-blue-100 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                  Customer Entity
                </span>
                <div className="text-sm font-bold text-[#1E3A8A]">{lead.companyName}</div>
                <div className="text-xs text-[#3B82F6]">Contact: {lead.name}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#2563EB]" />
            </div>
          )}

          {/* Payments for this Order */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] mb-2">Related Receipts & Payments</h4>
            {orderPayments.length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic">No payment receipts linked directly to this order.</p>
            ) : (
              <div className="space-y-1.5">
                {orderPayments.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectPayment(p.id)}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E2E8F0] p-2 hover:bg-[#F8FAFC] text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#10B981]">#{p.id}</span>
                      <span className="ml-2 text-[#475569]">{p.method}</span>
                    </div>
                    <div className="font-bold text-[#0F172A]">{formatINR(p.amount)}</div>
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
