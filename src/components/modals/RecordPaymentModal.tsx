import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';

export const RecordPaymentModal: React.FC = () => {
  const { isRecordPaymentOpen, setIsRecordPaymentOpen, recordPayment, invoices, setSelectedPaymentId } = useApp();

  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id || '');
  const [amount, setAmount] = useState('15000');
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [transactionRef, setTransactionRef] = useState(`TXN-IND-${Date.now().toString().slice(-6)}`);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isRecordPaymentOpen) return null;

  const payAmt = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmt <= 0) return;

    const inv = invoices.find((i) => i.id === invoiceId) || invoices[0];
    const newPay = recordPayment({
      invoiceId: inv?.id || 'INV-3140',
      dealId: inv?.dealId || 'D-845',
      orderId: inv?.orderId,
      customerName: inv?.customerName || 'Enterprise Client',
      amount: payAmt,
      status: 'Paid',
      method,
      transactionRef: transactionRef.trim() || `TXN-IND-${Date.now().toString().slice(-6)}`,
      assignedSalesId: inv?.assignedSalesId || 'u-6',
      assignedFinanceId: 'u-7',
      assignedFinanceName: 'Rajesh Verma',
      notes,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsRecordPaymentOpen(false);
      setSelectedPaymentId(newPay.id);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Capture / Reconcile Payment</h2>
              <p className="text-xs text-slate-300">Record bank transaction receipt against tax invoice</p>
            </div>
          </div>
          <button
            onClick={() => setIsRecordPaymentOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-900">Payment Captured & Reconciled!</h3>
            <p className="text-xs text-slate-500">Opening payment receipt details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Invoice to Settle *</label>
              <select
                value={invoiceId}
                onChange={(e) => {
                  setInvoiceId(e.target.value);
                  const matched = invoices.find((i) => i.id === e.target.value);
                  if (matched) {
                    setAmount((matched.balanceAmount || matched.invoiceAmount).toString());
                  }
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
              >
                {invoices.slice(0, 30).map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {inv.customerName} (Bal: ₹{inv.balanceAmount.toLocaleString('en-IN')} / ₹{inv.invoiceAmount.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount (₹) *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Payment Channel / Mode</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Net Banking">Net Banking (IMPS/NEFT)</option>
                  <option value="NEFT/RTGS">NEFT / RTGS Wire</option>
                  <option value="Credit Card">Corporate Credit Card</option>
                  <option value="Cheque">Bank Demand Draft / Cheque</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Reference / UTR Number *</label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="TXN-IND-20261016-98124"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reconciliation Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Bank confirmation timestamp, voucher number, or billing remarks..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsRecordPaymentOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md shadow-emerald-500/20"
              >
                Record Payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
