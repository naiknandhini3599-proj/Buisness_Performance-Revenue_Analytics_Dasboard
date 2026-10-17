import React, { useState } from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SERVICES } from '../../data/dummyData';
import { QuotationStatus } from '../../types';

export const CreateQuotationModal: React.FC = () => {
  const { isCreateQuotationOpen, setIsCreateQuotationOpen, addQuotation, leads, users, setSelectedQuotationId } = useApp();

  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [serviceCategory, setServiceCategory] = useState(SERVICES[0]);
  const [amount, setAmount] = useState('15000');
  const [status, setStatus] = useState<QuotationStatus>('Pending');
  const [assignedSalesId, setAssignedSalesId] = useState('u-6');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isCreateQuotationOpen) return null;

  const baseAmt = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
  const taxAmt = Math.round(baseAmt * 0.18);
  const finalAmt = baseAmt + taxAmt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (baseAmt <= 0) return;

    const rep = users.find((u) => u.id === assignedSalesId);
    const newQuote = addQuotation({
      leadId: leadId || leads[0]?.id || 'L-209645',
      serviceCategory,
      amount: baseAmt,
      taxAmount: taxAmt,
      discount: 0,
      finalAmount: finalAmt,
      status,
      expiryDate: '2026-11-15T18:00:00.000Z',
      assignedSalesId,
      assignedSalesName: rep?.name || 'Aazam Afroz',
      notes,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsCreateQuotationOpen(false);
      setSelectedQuotationId(newQuote.id);
    }, 1000);
  };

  const salesReps = users.filter((u) => u.department === 'Sales');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Generate Commercial Quotation</h2>
              <p className="text-xs text-slate-300">Create an official pricing estimate for client review</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateQuotationOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-900">Quotation Created Successfully!</h3>
            <p className="text-xs text-slate-500">Opening quotation overview modal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Account / Client *</label>
              <select
                value={leadId}
                onChange={(e) => {
                  setLeadId(e.target.value);
                  const matched = leads.find((l) => l.id === e.target.value);
                  if (matched) {
                    setServiceCategory(matched.serviceInterest);
                    setAssignedSalesId(matched.assignedSalesId);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
              >
                {leads.slice(0, 30).map((l) => (
                  <option key={l.id} value={l.id}>{l.companyName} ({l.name} - #{l.id})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Category</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quotation Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as QuotationStatus)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Accepted">Accepted / Won</option>
                  <option value="Sent">Sent to Client</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Base Amount (₹) *</label>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="15000"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">18% GST (₹)</label>
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 font-semibold text-slate-600">
                  ₹{taxAmt.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total (₹)</label>
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 font-bold text-blue-700">
                  ₹{finalAmt.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Sales Consultant</label>
              <select
                value={assignedSalesId}
                onChange={(e) => setAssignedSalesId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
              >
                {salesReps.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.designation || u.department})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quotation Scope & Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of deliverables, government filing fees, and professional disbursements..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreateQuotationOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-md shadow-blue-500/20"
              >
                Issue Quotation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
