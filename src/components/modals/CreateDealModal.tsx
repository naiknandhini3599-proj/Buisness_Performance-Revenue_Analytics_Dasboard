import React, { useState } from 'react';
import { X, Briefcase, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SERVICES } from '../../data/dummyData';
import { DealStage, DealPriority } from '../../types';

export const CreateDealModal: React.FC = () => {
  const { isCreateDealOpen, setIsCreateDealOpen, addDeal, leads, users, setSelectedDealId } = useApp();

  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [title, setTitle] = useState('');
  const [serviceCategory, setServiceCategory] = useState(SERVICES[0]);
  const [amount, setAmount] = useState('25000');
  const [stage, setStage] = useState<DealStage>('Won');
  const [priority, setPriority] = useState<DealPriority>('High');
  const [assignedSalesId, setAssignedSalesId] = useState('u-6');
  const [success, setSuccess] = useState(false);

  if (!isCreateDealOpen) return null;

  const dealVal = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dealVal <= 0) return;

    const lead = leads.find((l) => l.id === leadId);
    const rep = users.find((u) => u.id === assignedSalesId);

    const dealTitle = title.trim() || `${lead?.companyName || 'Corporate'} - ${serviceCategory}`;
    const newDeal = addDeal({
      leadId: leadId || leads[0]?.id || 'L-209645',
      quotationIds: [],
      title: dealTitle,
      serviceCategory,
      amount: dealVal,
      stage,
      priority,
      assignedSalesId,
      assignedSalesName: rep?.name || 'Aazam Afroz',
      expectedCloseDate: '2026-10-31T18:00:00.000Z',
      closedAt: stage === 'Won' ? '2026-10-16T15:30:00.000Z' : undefined,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsCreateDealOpen(false);
      setSelectedDealId(newDeal.id);
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
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Register Commercial Deal</h2>
              <p className="text-xs text-slate-300">Book recognized revenue contract into pipeline</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateDealOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-900">Deal Registered Successfully!</h3>
            <p className="text-xs text-slate-500">Opening deal details view...</p>
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
                    setTitle(`${matched.companyName} - ${matched.serviceInterest}`);
                  }
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
              >
                {leads.slice(0, 30).map((l) => (
                  <option key={l.id} value={l.id}>{l.companyName} ({l.name} - #{l.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Acme Tech - Private Limited Company Incorporation"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
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
                <label className="block font-semibold text-slate-700 mb-1">Recognized Deal Value (₹) *</label>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="25000"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pipeline Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as DealStage)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Won">Won (Closed / Booked)</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority Rating</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as DealPriority)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
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

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreateDealOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-md shadow-blue-500/20"
              >
                Create Deal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
