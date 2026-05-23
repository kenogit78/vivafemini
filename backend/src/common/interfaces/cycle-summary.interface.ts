export interface CycleSummaryResponse {
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
