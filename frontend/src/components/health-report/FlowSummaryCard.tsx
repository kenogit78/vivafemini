import type { HealthReport } from '@/types';

export interface FlowSummaryCardProps {
  flowSummary: HealthReport['flowSummary'];
}

export function FlowSummaryCard({ flowSummary }: FlowSummaryCardProps) {
  return (
    <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <h3 className="text-sm font-bold text-text-primary">
        Flow & Symptom Summary
      </h3>
      <p className="mt-1 text-xs text-text-secondary">
        Understand your symptoms linked to sleep & activity
      </p>

      <p className="mt-4 text-sm leading-relaxed text-text-primary">
        Your average cycle length is {flowSummary.avgCycleLength} days.{' '}
        {flowSummary.insight}
      </p>

      <h4 className="mt-4 text-sm font-bold text-primary">Tips To Adhere To:</h4>
      <ul className="mt-2 space-y-2">
        {flowSummary.tips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-2 text-sm text-text-primary"
          >
            <span className="mt-1 text-primary" aria-hidden>
              •
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
