'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import { emitDataChanged } from '@/lib/app-events';
import { cn } from '@/lib/cn';

type PregnancyOption = 'none' | 'not-taken' | 'positive' | 'faint' | 'negative';

const OPTIONS: { id: PregnancyOption; icon: string; label: string }[] = [
  { id: 'not-taken', icon: '🚫', label: "Didn't take test" },
  { id: 'positive', icon: '✅', label: 'Positive' },
  { id: 'faint', icon: '〰️', label: 'Faint line' },
  { id: 'negative', icon: '❌', label: 'Negative' },
];

export interface PregnancyTestWidgetProps {
  initialDismissed?: boolean;
  initialSelection?: string;
  className?: string;
}

function parseSelection(value?: string): PregnancyOption {
  if (
    value === 'not-taken' ||
    value === 'positive' ||
    value === 'faint' ||
    value === 'negative'
  ) {
    return value;
  }
  return 'none';
}

export function PregnancyTestWidget({
  initialDismissed = false,
  initialSelection,
  className,
}: PregnancyTestWidgetProps) {
  const [dismissed, setDismissed] = useState<boolean>(initialDismissed);
  const [selected, setSelected] = useState<PregnancyOption>(
    parseSelection(initialSelection),
  );

  if (dismissed) {
    return null;
  }

  const canApply = selected !== 'none';

  const persist = async (
    selection: PregnancyOption,
    widgetDismissed: boolean,
  ): Promise<void> => {
    await api.updateUser({
      pregnancyTestSelection:
        selection === 'none' ? undefined : selection,
      pregnancyWidgetDismissed: widgetDismissed,
    });
    emitDataChanged();
  };

  const handleDismiss = (): void => {
    setDismissed(true);
    void persist(selected, true).catch(() => {});
  };

  const handleApply = (): void => {
    if (!canApply) {
      return;
    }
    setDismissed(true);
    void persist(selected, true).catch(() => {});
  };

  return (
    <div
      className={cn(
        'relative rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
        aria-label="Dismiss pregnancy test widget"
      >
        <X className="h-4 w-4" />
      </button>

      <h3 className="pr-6 text-sm font-bold text-text-primary">
        Hi! Did you take your pregnancy test?
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full text-lg',
                  isSelected
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                    : 'bg-primary-bg text-primary',
                )}
              >
                {option.icon}
              </span>
              <span className="text-center text-[10px] leading-tight text-text-secondary">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!canApply}
        onClick={handleApply}
        className={cn(
          'mt-4 w-full rounded-pill py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95',
          canApply
            ? 'bg-primary text-white hover:bg-primary-light'
            : 'cursor-not-allowed bg-gray-200 text-text-secondary',
        )}
      >
        Apply
      </button>
    </div>
  );
}
