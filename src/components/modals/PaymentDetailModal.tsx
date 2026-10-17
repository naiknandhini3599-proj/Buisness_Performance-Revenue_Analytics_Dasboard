import React from 'react';
import { X, CreditCard, ExternalLink, CheckCircle } from 'lucide-react';
import { Payment, Deal, Order } from '../../types';
import { formatINR, formatDateFull } from '../../utils/formatters';

interface PaymentDetailModalProps {
  payment: Payment | null;
  deal?: Deal;
  order?: Order;
  onClose: () => void;
  onSelectDeal: (id: string) => void;
  onSelectOrder: (id: string) => void;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  payment,
  deal,
  order,
  onClose,
  onSelectDeal,
  onSelectOrder,
}) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-[#059669]">
              #{payment.id}
            </span>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">{payment.customerName}</h3>
              <p className="text-xs text-[#64748B]">Paid: {formatDateFull(payment.paymentDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {payment.status}
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
          {/* Amount Card */}
          <div className="rounded-xl border border-emerald-100 bg-[#ECFDF5] p-5 text-center">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Collected Amount
            </span>
            <div className="text-3xl font-bold text-[#065F46] mt-1">
              {formatINR(payment.amount)}
            </div>
            <div className="mt-2 text-xs font-medium text-emerald-700">
              Payment Method: {payment.method}
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="rounded-xl border border-[#E2E8F0] p-4 text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Transaction Reference:</span>
              <span className="font-mono font-semibold text-[#0F172A]">{payment.transactionRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Invoice Number:</span>
              <span className="font-semibold text-[#0F172A]">#{payment.invoiceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Date & Timestamp:</span>
              <span className="text-[#0F172A]">{payment.paymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Bank Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Settled / Reconciled
              </span>
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
                  Applied to Deal
                </span>
                <div className="text-sm font-bold text-[#581C87]">{deal.title}</div>
                <div className="text-xs text-[#7C3AED]">Deal #{deal.id} • Value {formatINR(deal.amount)}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#8B5CF6]" />
            </div>
          )}

          {order && (
            <div
              onClick={() => onSelectOrder(order.id)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-amber-100 bg-[#FFFBEB] p-3.5 hover:bg-amber-100 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
                  Applied to Order
                </span>
                <div className="text-sm font-bold text-[#78350F]">{order.serviceCategory}</div>
                <div className="text-xs text-[#B45309]">Order #{order.id}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#D97706]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
