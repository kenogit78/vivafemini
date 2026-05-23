export interface SymptomOption {
  emoji: string;
  label: string;
}

export const PERIOD_INDICATORS: SymptomOption[] = [
  { emoji: '🩸', label: 'Spotting' },
  { emoji: '💧', label: 'heavier flow' },
  { emoji: '💦', label: 'lighter flow' },
  { emoji: '🌵', label: 'Vaginal Dryness' },
];

export const SEXUAL_HEALTH: SymptomOption[] = [
  { emoji: '🔥', label: 'Increased sex drive' },
  { emoji: '😴', label: 'Decreased sex drive' },
  { emoji: '💧', label: 'Vaginal discharge' },
];

export const PHYSICAL_PAIN: SymptomOption[] = [
  { emoji: '🩸', label: 'Cramps' },
  { emoji: '😵', label: 'Diarrhoea' },
  { emoji: '😴', label: 'Fatigue' },
  { emoji: '🤕', label: 'Headache' },
  { emoji: '🤢', label: 'Nausea' },
  { emoji: '🫶', label: 'Breast tenderness' },
  { emoji: '😣', label: 'Abdominal pain' },
  { emoji: '🩻', label: 'Pelvic pain' },
  { emoji: '💧', label: 'Water retention' },
  { emoji: '🚶', label: 'Lower back pain' },
  { emoji: '🍽️', label: 'Appetite changes' },
];

export const MOOD_AND_MENTAL: SymptomOption[] = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😔', label: 'Low Motivation' },
  { emoji: '🤯', label: 'Mood swings' },
  { emoji: '😤', label: 'Irritability' },
  { emoji: '🍫', label: 'Cravings' },
  { emoji: '😭', label: 'Tearfulness' },
  { emoji: '🧠', label: 'Difficulty Concentrating' },
];

export const DIGESTION: SymptomOption[] = [
  { emoji: '🤢', label: 'Nausea' },
  { emoji: '🫃', label: 'Bloating' },
  { emoji: '😣', label: 'Constipation' },
  { emoji: '😤', label: 'Loss of appetite' },
  { emoji: '😋', label: 'Increased appetite' },
];
