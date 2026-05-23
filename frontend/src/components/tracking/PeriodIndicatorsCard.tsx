import { PERIOD_INDICATORS } from '@/constants/symptoms';
import { SymptomSection } from './SymptomSection';

export interface PeriodIndicatorsCardProps {
  selected: string[];
  onToggle: (symptom: string) => void;
}

export function PeriodIndicatorsCard({
  selected,
  onToggle,
}: PeriodIndicatorsCardProps) {
  return (
    <SymptomSection
      title="Period Indicators"
      symptoms={PERIOD_INDICATORS}
      selectedSymptoms={selected}
      onToggle={onToggle}
    />
  );
}
