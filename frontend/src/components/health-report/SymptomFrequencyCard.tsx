import { DonutChart } from '@/components/ui/DonutChart';
import type { SymptomFrequency } from '@/types';

export interface SymptomFrequencyCardProps {
  items: SymptomFrequency[];
}

export function SymptomFrequencyCard({ items }: SymptomFrequencyCardProps) {
  return (
    <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <h3 className="text-sm font-bold text-text-primary">Symptom Frequency</h3>
      <p className="mt-1 text-xs text-text-secondary">
        Study your body system & understand your wellbeing
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.category}
            className="flex flex-col items-center text-center"
          >
            <DonutChart
              percentage={item.percentage}
              color={item.color}
              size={72}
            />
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span className="text-[10px] leading-tight text-text-secondary">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
        {items.map((item) => (
          <div key={`legend-${item.category}`} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="text-xs text-text-secondary">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
