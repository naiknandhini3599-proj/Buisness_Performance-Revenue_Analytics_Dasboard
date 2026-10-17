import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, FileText, Briefcase, Package, CreditCard, ArrowRight } from 'lucide-react';
import { Lead, Quotation, Deal, Order, Payment } from '../../types';
import { formatINR } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  quotations: Quotation[];
  deals: Deal[];
  orders: Order[];
  payments: Payment[];
  onSelectLead: (id: string) => void;
  onSelectQuotation: (id: string) => void;
  onSelectDeal: (id: string) => void;
  onSelectOrder: (id: string) => void;
  onSelectPayment: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  leads,
  quotations,
  deals,
  orders,
  payments,
  onSelectLead,
  onSelectQuotation,
  onSelectDeal,
  onSelectOrder,
  onSelectPayment,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedLeads = q
    ? leads.filter(
        (l) =>
          l.id.toLowerCase().includes(q) ||
          l.companyName.toLowerCase().includes(q) ||
          l.name.toLowerCase().includes(q) ||
          l.serviceInterest.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedQuotes = q
    ? quotations.filter(
        (quot) =>
          quot.id.toLowerCase().includes(q) ||
          quot.serviceCategory.toLowerCase().includes(q) ||
          quot.leadId.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedDeals = q
    ? deals.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.serviceCategory.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedOrders = q
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.serviceCategory.toLowerCase().includes(q) ||
          o.assignedOpsName.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedPayments = q
    ? payments.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.transactionRef.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const totalMatches =
    matchedLeads.length +
    matchedQuotes.length +
    matchedDeals.length +
    matchedOrders.length +
    matchedPayments.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0] max-h-[80vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-[#E2E8F0] px-4 py-3">
          <Search className="h-5 w-5 text-[#64748B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type ID, company name, service or contact (e.g. L-209610, Q-10467, D-822, Acme)..."
            className="w-full bg-transparent px-3 text-sm font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-2 text-xs text-[#94A3B8] hover:text-[#0F172A]"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded p-1 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-xs text-[#94A3B8]">
              Search across all Leads, Quotations, Deals, Orders, and Receipts with instant drill-down.
            </div>
          )}

          {query && totalMatches === 0 && (
            <div className="py-8 text-center text-xs text-[#64748B]">
              No records matching <span className="font-semibold text-[#0F172A]">"{query}"</span>.
            </div>
          )}

          {/* Matched Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Leads ({matchedLeads.length})
              </div>
              <div className="space-y-1">
                {matchedLeads.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onClose();
                      onSelectLead(l.id);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-[#F1F5F9] transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#2563EB]">#{l.id}</span>
                      <span className="ml-2 font-semibold text-[#0F172A]">{l.companyName}</span>
                      <span className="ml-2 text-[#64748B]">({l.name})</span>
                    </div>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#2563EB]">
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Quotations */}
          {matchedQuotes.length > 0 && (
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#06B6D4] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Quotations ({matchedQuotes.length})
              </div>
              <div className="space-y-1">
                {matchedQuotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      onClose();
                      onSelectQuotation(q.id);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-[#F1F5F9] transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#06B6D4]">#{q.id}</span>
                      <span className="ml-2 font-medium text-[#0F172A]">{q.serviceCategory}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F172A]">{formatINR(q.finalAmount)}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-[#475569]">
                        {q.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Deals */}
          {matchedDeals.length > 0 && (
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> Deals ({matchedDeals.length})
              </div>
              <div className="space-y-1">
                {matchedDeals.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onClose();
                      onSelectDeal(d.id);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-[#F1F5F9] transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#8B5CF6]">#{d.id}</span>
                      <span className="ml-2 font-semibold text-[#0F172A]">{d.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F172A]">{formatINR(d.amount)}</span>
                      <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
                        {d.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" /> Orders ({matchedOrders.length})
              </div>
              <div className="space-y-1">
                {matchedOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      onClose();
                      onSelectOrder(o.id);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-[#F1F5F9] transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#F59E0B]">#{o.id}</span>
                      <span className="ml-2 font-medium text-[#0F172A]">{o.serviceCategory}</span>
                    </div>
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Payments */}
          {matchedPayments.length > 0 && (
            <div>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Payments ({matchedPayments.length})
              </div>
              <div className="space-y-1">
                {matchedPayments.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onSelectPayment(p.id);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-[#F1F5F9] transition-colors text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#10B981]">#{p.id}</span>
                      <span className="ml-2 font-medium text-[#0F172A]">{p.customerName}</span>
                    </div>
                    <span className="font-bold text-[#0F172A]">{formatINR(p.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
