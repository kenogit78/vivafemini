export interface User {
  id: string;
  name: string;
  avatar: string;
  referralBannerDismissed: boolean;
  pregnancyWidgetDismissed: boolean;
  pregnancyTestSelection?: string;
}

export interface CycleSummary {
  lastPeriodStart: string;
  cycleLength: number;
  periodDuration: number;
  estimatedNextPeriod: string;
  ovulationWindow: string;
  currentCycleDay: number;
  avgCycleLength: number;
  cycleProgress: number;
  nextPeriodDate: string;
  nextPeriodDaysAway: number;
  fertileWindowStart: string;
  calendarMonth: string;
  periodDays: number[];
  ovulationDays: number[];
}

export interface SymptomLog {
  id: string;
  userId: string;
  date: string;
  physicalPain: string[];
  moodAndMental: string[];
  digestion: string[];
  periodIndicators: string[];
  sexualHealth: string[];
  flowIntensity: number;
  notes: string;
  topSymptom: string;
  totalSymptoms: number;
  createdAt: string;
}

export interface SymptomFrequency {
  category: string;
  percentage: number;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  imageUrl: string;
  excerpt: string;
  category: string;
}

export interface CycleTip {
  day: number;
  title: string;
  body: string;
  emoji: string;
  tagline: string;
  bgColor: string;
}

export interface DashboardData {
  user: User;
  cycleSummary: CycleSummary;
  dailyCheckOffs: {
    symptoms: string[];
    healthReport: string;
  };
  trendWatch: {
    mostFrequentSymptom: string;
    symptomIntensityChange: string;
  };
  cycleHighlights: CycleTip[];
  recommendedArticles: Article[];
}

export interface HealthReport {
  cycleSummary: Pick<
    CycleSummary,
    'cycleLength' | 'periodDuration' | 'estimatedNextPeriod' | 'ovulationWindow'
  >;
  flowSummary: {
    avgCycleLength: number;
    insight: string;
    tips: string[];
  };
  periodLengthChart: { date: string; value: number }[];
  symptomFrequency: SymptomFrequency[];
  historicalLogs: SymptomLog[];
}

export interface CreateSymptomLogPayload {
  date: string;
  physicalPain?: string[];
  moodAndMental?: string[];
  digestion?: string[];
  periodIndicators?: string[];
  sexualHealth?: string[];
  flowIntensity?: number;
  notes?: string;
}

export type UpdateSymptomLogPayload = Partial<CreateSymptomLogPayload>;

export interface LogPeriodPayload {
  periodStart: string;
  periodEnd?: string;
  notes?: string;
  cycleLength?: number;
}

export interface UpdateUserPayload {
  referralBannerDismissed?: boolean;
  pregnancyWidgetDismissed?: boolean;
  pregnancyTestSelection?: string;
}
