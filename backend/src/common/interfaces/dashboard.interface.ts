import { CycleSummaryResponse } from './cycle-summary.interface';
import { Article } from '../../articles/schemas/article.schema';
import { CycleTip } from '../../cycle-tips/schemas/cycle-tip.schema';

export interface DashboardUser {
  name: string;
  avatar: string;
  referralBannerDismissed: boolean;
  pregnancyWidgetDismissed: boolean;
  pregnancyTestSelection?: string;
}

export interface DailyCheckOffs {
  symptoms: string[];
  healthReport: string;
}

export interface TrendWatch {
  mostFrequentSymptom: string;
  symptomIntensityChange: 'Increasing' | 'Decreasing' | 'Stable';
}

export interface DashboardResponse {
  user: DashboardUser;
  cycleSummary: CycleSummaryResponse;
  dailyCheckOffs: DailyCheckOffs;
  trendWatch: TrendWatch;
  cycleHighlights: CycleTip[];
  recommendedArticles: Article[];
}
