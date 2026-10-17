import React from 'react';
import { X, Building, Mail, Phone, MapPin, Calendar, User, FileText, Briefcase } from 'lucide-react';
import { Lead, Quotation, Deal } from '../../types';
import { formatINR, formatDateFull } from '../../utils/formatters';

interface LeadDetailModalProps {
  lead: Lead | null;
  quotations: Quotation[];
  deals: Deal[];
  onClose: () => void;
  onSelectQuotation: (id: string) => void;
  onSelectDeal: (id: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  quotations,
  deals,
  onClose,
  onSelectQuotation,
  onSelectDeal,
}) => {
  if (!lead) return null;

  const leadQuotes = quotations.filter((q) => q.leadId === lead.id);
  const leadDeals = deals.filter((d) => d.leadId === lead.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Converted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Qualified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Unqualified':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-[#2563EB]">
              #{lead.id}
            </span>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">{lead.companyName}</h3>
              <p className="text-xs text-[#64748B]">Contact: {lead.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(lead.status)}`}>
              {lead.status}
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Contact Details Card */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#64748B]" />
              <span className="text-[#334155]">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#64748B]" />
              <span className="text-[#334155]">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#64748B]" />
              <span className="text-[#334155]">{lead.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#64748B]" />
              <span className="text-[#334155]">Rep: <strong>{lead.assignedSalesName}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#64748B]" />
              <span className="text-[#334155]">Created: {formatDateFull(lead.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-[#334155]">Source: <strong>{lead.source}</strong></span>
            </div>
          </div>

          {/* Service interest & Notes */}
          <div className="rounded-xl border border-[#E2E8F0] p-4">
            <h4 className="text-xs font-bold text-[#0F172A] mb-1">Service Interest</h4>
            <div className="text-xs font-semibold text-[#2563EB] mb-2">{lead.serviceInterest}</div>
            <h4 className="text-xs font-bold text-[#0F172A] mb-1">CRM Notes</h4>
            <p className="text-xs text-[#64748B]">{lead.notes || 'No extra notes recorded.'}</p>
          </div>

          {/* Associated Quotations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#2563EB]" />
                Associated Quotations ({leadQuotes.length})
              </h4>
            </div>
            {leadQuotes.length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic">No quotations issued for this lead.</p>
            ) : (
              <div className="space-y-2">
                {leadQuotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => onSelectQuotation(q.id)}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E2E8F0] p-2.5 hover:bg-[#F8FAFC] transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2563EB]">#{q.id}</span>
                      <span className="font-medium text-[#1E293B]">{q.serviceCategory}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#0F172A]">{formatINR(q.finalAmount)}</span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                        {q.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Associated Deals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#8B5CF6]" />
                Associated Deals ({leadDeals.length})
              </h4>
            </div>
            {leadDeals.length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic">No active deals created yet.</p>
            ) : (
              <div className="space-y-2">
                {leadDeals.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => onSelectDeal(d.id)}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E2E8F0] p-2.5 hover:bg-[#F8FAFC] transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#8B5CF6]">#{d.id}</span>
                      <span className="font-medium text-[#1E293B]">{d.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#0F172A]">{formatINR(d.amount)}</span>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {d.stage}
                      </span>
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
