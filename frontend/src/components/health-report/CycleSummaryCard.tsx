import { cn } from '@/lib/cn';
import { formatMonthLabel } from '@/lib/date-format';
import type { HealthReport } from '@/types';

export interface CycleSummaryCardProps {
  cycleSummary: HealthReport['cycleSummary'];
  month: string;
}

interface SummaryPill {
  icon: string;
  label: string;
  value: string;
  borderClass: string;
  textClass: string;
}

export function CycleSummaryCard({
  cycleSummary,
  month,
}: CycleSummaryCardProps) {
  const pills: SummaryPill[] = [
    {
      icon: '🔄',
      label: 'Cycle Length',
      value: `${cycleSummary.cycleLength} Days`,
      borderClass: 'border-orange-400',
      textClass: 'text-orange-600',
    },
    {
      icon: '👯',
      label: 'Period Duration',
      value: `${cycleSummary.periodDuration} Days`,
      borderClass: 'border-primary-light',
      textClass: 'text-primary',
    },
    {
      icon: '📅',
      label: 'Estimated Next Period',
      value: cycleSummary.estimatedNextPeriod,
      borderClass: 'border-violet-400',
      textClass: 'text-violet-700',
    },
    {
      icon: '💧',
      label: 'Ovulation Window',
      value: cycleSummary.ovulationWindow,
      borderClass: 'border-blue-400',
      textClass: 'text-blue-700',
    },
  ];

  return (
    <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <h3 className="text-sm font-bold text-text-primary">
        Cycle Summary – {formatMonthLabel(month)}
      </h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {pills.map((pill) => (
          <div
            key={pill.label}
            className={cn(
              'inline-flex items-center gap-2 rounded-pill border-2 bg-white px-3 py-2',
              pill.borderClass,
            )}
          >
            <span aria-hidden>{pill.icon}</span>
            <span className={cn('text-[10px] font-medium sm:text-xs', pill.textClass)}>
              {pill.label}:{' '}
              <span className="font-semibold">{pill.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
