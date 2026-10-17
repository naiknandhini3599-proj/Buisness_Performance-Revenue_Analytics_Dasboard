import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { DateFilterRange } from '../../types';

interface CustomDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRange: DateFilterRange;
  onApply: (range: DateFilterRange) => void;
}

export const CustomDateRangeModal: React.FC<CustomDateRangeModalProps> = ({
  isOpen,
  onClose,
  currentRange,
  onApply,
}) => {
  const [start, setStart] = useState(currentRange.startDate);
  const [end, setEnd] = useState(currentRange.endDate);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(start) > new Date(end)) {
      setError('Start date must be before or equal to End date.');
      return;
    }

    onApply({
      preset: 'custom',
      startDate: start,
      endDate: end,
      label: `${start} to ${end}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-50">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E8F0] p-6">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#2563EB]" />
            <h3 className="text-base font-bold text-[#0F172A]">Custom Date Range</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                setError('');
              }}
              className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              End Date
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
                setError('');
              }}
              className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs font-medium text-[#0F172A] focus:border-[#2563EB] focus:outline-hidden"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#CBD5E1] px-3.5 py-1.5 text-xs font-medium text-[#475569] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
            >
              <Check className="h-3.5 w-3.5" />
              Apply Range
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
