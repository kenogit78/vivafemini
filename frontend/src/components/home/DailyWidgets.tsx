import { cn } from '@/lib/cn';
import type { DashboardData } from '@/types';

export interface DailyWidgetsProps {
  dailyCheckOffs: DashboardData['dailyCheckOffs'];
  trendWatch: DashboardData['trendWatch'];
  className?: string;
}

export function DailyWidgets({
  dailyCheckOffs,
  trendWatch,
  className,
}: DailyWidgetsProps) {
  const intensityLabel = trendWatch.symptomIntensityChange.startsWith('Stable')
    ? 'Stable 😌'
    : `${trendWatch.symptomIntensityChange} 😊`;

  return (
    <div className={cn('grid gap-4 lg:grid-cols-2', className)}>
      <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-sm font-bold text-text-primary">Daily Check-Offs</h3>
        <dl className="mt-3 space-y-3">
          <div className="flex items-start justify-between gap-2 text-sm">
            <dt className="shrink-0 text-text-secondary">Symptoms</dt>
            <dd className="flex flex-wrap justify-end gap-1.5">
              {dailyCheckOffs.symptoms.length > 0 ? (
                dailyCheckOffs.symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="rounded-pill bg-primary-bg px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {symptom}
                  </span>
                ))
              ) : (
                <span className="text-text-secondary">None logged</span>
              )}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-2 text-sm">
            <dt className="text-text-secondary">Health Report</dt>
            <dd className="text-right font-medium text-emerald-600">
              {dailyCheckOffs.healthReport}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-sm font-bold text-text-primary">
          📊 Trend Watch
        </h3>
        <dl className="mt-3 space-y-3">
          <div className="flex items-center justify-between gap-2 text-sm">
            <dt className="text-text-secondary">Most Frequent Symptom</dt>
            <dd>
              <span className="rounded-pill bg-primary-bg px-3 py-1 text-xs font-semibold text-primary">
                {trendWatch.mostFrequentSymptom}
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <dt className="text-text-secondary">Symptom Intensity Change</dt>
            <dd>
              <span className="rounded-pill bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                {intensityLabel}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
