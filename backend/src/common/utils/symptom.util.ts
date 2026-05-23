export interface SymptomCategoryInput {
  physicalPain: string[];
  moodAndMental: string[];
  digestion: string[];
  periodIndicators: string[];
  sexualHealth: string[];
}

export interface SymptomStats {
  topSymptom: string;
  totalSymptoms: number;
}

const CATEGORY_LABELS: Record<keyof SymptomCategoryInput, string> = {
  physicalPain: 'Physical Pain',
  moodAndMental: 'Mood & Mental',
  digestion: 'Digestion & Appetite',
  periodIndicators: 'Period Indicators',
  sexualHealth: 'Sexual Health',
};

export function computeSymptomStats(
  symptoms: SymptomCategoryInput,
): SymptomStats {
  const entries = Object.entries(symptoms) as [
    keyof SymptomCategoryInput,
    string[],
  ][];

  let topSymptom = 'None';
  let maxCount = 0;
  let totalSymptoms = 0;

  for (const [key, items] of entries) {
    const count = items.length;
    totalSymptoms += count;
    if (count > maxCount) {
      maxCount = count;
      topSymptom = CATEGORY_LABELS[key];
    }
  }

  return { topSymptom, totalSymptoms };
}

export function getAllSymptomCategories(): (keyof SymptomCategoryInput)[] {
  return [
    'physicalPain',
    'moodAndMental',
    'digestion',
    'periodIndicators',
    'sexualHealth',
  ];
}

export const SYMPTOM_CATEGORY_DISPLAY: Record<
  keyof SymptomCategoryInput,
  { label: string; color: string }
> = {
  physicalPain: { label: 'Physical Pain', color: '#E91E8C' },
  moodAndMental: { label: 'Mood & Mental', color: '#9C27B0' },
  digestion: { label: 'Digestion & Appetite', color: '#4CAF50' },
  periodIndicators: { label: 'Period Indicators', color: '#FFC107' },
  sexualHealth: { label: 'Sexual Health', color: '#FF69B4' },
};
