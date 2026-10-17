import React, { useState } from 'react';
import { X, Search, FileText, Users, Briefcase, Package } from 'lucide-react';
import { Quotation, Lead, Deal, Order } from '../../types';
import { formatINR, formatDateFull } from '../../utils/formatters';

interface RecordListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'quotations' | 'leads' | 'deals' | 'orders';
  records: any[];
  onSelectRecord: (type: string, id: string) => void;
}

export const RecordListModal: React.FC<RecordListModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  records,
  onSelectRecord,
}) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!isOpen) return null;

  const filtered = records.filter((rec) => {
    if (statusFilter !== 'ALL' && rec.status !== statusFilter && rec.stage !== statusFilter) {
      return false;
    }
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      (rec.id && rec.id.toLowerCase().includes(q)) ||
      (rec.serviceCategory && rec.serviceCategory.toLowerCase().includes(q)) ||
      (rec.companyName && rec.companyName.toLowerCase().includes(q)) ||
      (rec.title && rec.title.toLowerCase().includes(q)) ||
      (rec.name && rec.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
            <p className="text-xs text-[#64748B]">Showing {filtered.length} of {records.length} records</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] px-6 py-3 bg-white">
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by ID, name, or service..."
              className="w-full rounded-lg border border-[#CBD5E1] pl-8 pr-3 py-1.5 text-xs focus:border-[#2563EB] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] px-2.5 py-1 text-xs text-[#0F172A] focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              {type === 'quotations' && (
                <>
                  <option value="Accepted">Accepted</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
              {type === 'leads' && (
                <>
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Unqualified">Unqualified</option>
                </>
              )}
              {type === 'deals' && (
                <>
                  <option value="Won">Won</option>
                  <option value="In Discussion">In Discussion</option>
                </>
              )}
              {type === 'orders' && (
                <>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto p-6">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-white border-b border-[#E2E8F0] text-[11px] font-semibold text-[#64748B]">
              <tr>
                <th className="pb-2">ID</th>
                <th className="pb-2">{type === 'leads' ? 'Company / Contact' : type === 'deals' ? 'Deal Title' : 'Service'}</th>
                <th className="pb-2 text-right">Value / Amount</th>
                <th className="pb-2 text-center">Status</th>
                <th className="pb-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onSelectRecord(
                      type === 'quotations' ? 'Quotation' : type === 'leads' ? 'Lead' : type === 'deals' ? 'Deal' : 'Order',
                      item.id
                    );
                  }}
                  className="cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-2.5 font-bold text-[#2563EB]">#{item.id}</td>
                  <td className="py-2.5 font-medium text-[#1E293B]">
                    {item.companyName ? `${item.companyName} (${item.name})` : item.title || item.serviceCategory}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#0F172A]">
                    {item.finalAmount ? formatINR(item.finalAmount) : item.amount ? formatINR(item.amount) : item.orderValue ? formatINR(item.orderValue) : '-'}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                      {item.status || item.stage}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[#64748B]">
                    {formatDateFull(item.createdAt || item.issueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
