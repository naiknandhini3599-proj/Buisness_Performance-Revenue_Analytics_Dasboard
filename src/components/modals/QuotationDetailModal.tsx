import React from 'react';
import { X, FileText, User, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { Quotation, Lead, Deal } from '../../types';
import { formatINR, formatDateFull } from '../../utils/formatters';

interface QuotationDetailModalProps {
  quotation: Quotation | null;
  lead?: Lead;
  deal?: Deal;
  onClose: () => void;
  onSelectLead: (id: string) => void;
  onSelectDeal: (id: string) => void;
}

export const QuotationDetailModal: React.FC<QuotationDetailModalProps> = ({
  quotation,
  lead,
  deal,
  onClose,
  onSelectLead,
  onSelectDeal,
}) => {
  if (!quotation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-[#2563EB]">
              #{quotation.id}
            </span>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">{quotation.serviceCategory}</h3>
              <p className="text-xs text-[#64748B]">Issued: {formatDateFull(quotation.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-[#0F172A]">
              {quotation.status}
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
          {/* Financial Breakdown */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <h4 className="text-xs font-bold text-[#0F172A] mb-3">Quote Pricing Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Base Service Fee</span>
                <span className="font-medium text-[#0F172A]">{formatINR(quotation.amount)}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>GST (18%)</span>
                <span className="font-medium text-[#0F172A]">{formatINR(quotation.taxAmount)}</span>
              </div>
              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between font-bold text-[#0F172A]">
                <span>Total Quotation Amount</span>
                <span className="text-base text-[#2563EB]">{formatINR(quotation.finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Details & Validity */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#E2E8F0] p-4 text-xs">
            <div>
              <span className="text-[#64748B]">Sales Representative:</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{quotation.assignedSalesName}</div>
            </div>
            <div>
              <span className="text-[#64748B]">Valid Until:</span>
              <div className="font-bold text-[#0F172A] mt-0.5">{formatDateFull(quotation.expiryDate)}</div>
            </div>
            <div className="col-span-2">
              <span className="text-[#64748B]">Proposal Scope:</span>
              <div className="text-[#334155] mt-0.5">{quotation.notes || 'Full package onboarding, compliance & government filings.'}</div>
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
                <div className="text-xs text-[#3B82F6]">{lead.name} ({lead.city})</div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#2563EB]" />
            </div>
          )}

          {/* Associated Deal Link if won */}
          {deal && (
            <div
              onClick={() => onSelectDeal(deal.id)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-purple-100 bg-[#FAF5FF] p-3.5 hover:bg-purple-100 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">
                  Converted To Deal
                </span>
                <div className="text-sm font-bold text-[#581C87]">{deal.title}</div>
                <div className="text-xs text-[#7C3AED]">Recognized Value: {formatINR(deal.amount)}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#8B5CF6]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
