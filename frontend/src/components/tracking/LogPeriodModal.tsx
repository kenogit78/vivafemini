'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import { emitDataChanged } from '@/lib/app-events';
import { Spinner } from '@/components/ui/Spinner';

export interface LogPeriodModalProps {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export function LogPeriodModal({
  open,
  onClose,
  defaultDate,
}: LogPeriodModalProps) {
  const [periodStart, setPeriodStart] = useState<string>(
    defaultDate ?? new Date().toISOString().split('T')[0],
  );
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const handleSubmit = async (): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      await api.logPeriod({ periodStart, notes: notes.trim() || undefined });
      emitDataChanged();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log period');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-period-title"
    >
      <div className="w-full max-w-md rounded-card bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="log-period-title" className="text-lg font-bold text-text-primary">
            Log period start
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary hover:bg-primary-bg"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="block text-sm font-medium text-text-primary">
          Period start date
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            className="mt-1 w-full rounded-card border border-gray-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-text-primary">
          Notes (optional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-none rounded-card border border-gray-200 px-3 py-2 text-sm"
            placeholder="How are you feeling?"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={saving || !periodStart}
          onClick={() => void handleSubmit()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-primary py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? (
            <>
              <Spinner size="sm" />
              Saving…
            </>
          ) : (
            'Save period'
          )}
        </button>
      </div>
    </div>
  );
}
