import { SEXUAL_HEALTH } from '@/constants/symptoms';
import { SymptomSection } from './SymptomSection';

export interface SexualHealthCardProps {
  selected: string[];
  onToggle: (symptom: string) => void;
}

export function SexualHealthCard({
  selected,
  onToggle,
}: SexualHealthCardProps) {
  return (
    <SymptomSection
      title="Sexual Health"
      symptoms={SEXUAL_HEALTH}
      selectedSymptoms={selected}
      onToggle={onToggle}
    />
  );
}
