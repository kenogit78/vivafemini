import { CycleSummaryResponse } from './cycle-summary.interface';
import { SymptomLog } from '../../symptoms/schemas/symptom-log.schema';

export interface FlowSummary {
  avgCycleLength: number;
  insight: string;
  tips: string[];
}

export interface PeriodLengthChartPoint {
  date: string;
  value: number;
}

export interface SymptomFrequencyItem {
  category: string;
  percentage: number;
  color: string;
}

export interface HealthReportResponse {
  cycleSummary: Pick<
    CycleSummaryResponse,
    'cycleLength' | 'periodDuration' | 'estimatedNextPeriod' | 'ovulationWindow'
  >;
  flowSummary: FlowSummary;
  periodLengthChart: PeriodLengthChartPoint[];
  symptomFrequency: SymptomFrequencyItem[];
  historicalLogs: SymptomLog[];
}
