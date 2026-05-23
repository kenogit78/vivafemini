import { cn } from '@/lib/cn';
import type { SymptomOption } from '@/constants/symptoms';

export interface SymptomSectionProps {
  title: string;
  symptoms: SymptomOption[];
  selectedSymptoms: string[];
  onToggle: (symptom: string) => void;
  className?: string;
}

export function SymptomSection({
  title,
  symptoms,
  selectedSymptoms,
  onToggle,
  className,
}: SymptomSectionProps) {
  return (
    <div
      className={cn(
        'rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md',
        className,
      )}
    >
      <h3 className="mb-3 text-sm font-bold text-text-primary">{title}</h3>
      <div className="flex flex-wrap gap-2 overflow-hidden">
        {symptoms.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom.label);
          return (
            <button
              key={symptom.label}
              type="button"
              onClick={() => onToggle(symptom.label)}
              className={cn(
                'rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-150 active:scale-95',
                isSelected
                  ? 'bg-primary text-white'
                  : 'border border-primary bg-white text-primary hover:bg-primary-bg',
              )}
            >
              {symptom.emoji} {symptom.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
