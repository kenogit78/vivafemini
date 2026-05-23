import { Injectable } from '@nestjs/common';
import { getDatesInMonth, parseMonthParam } from '../common/utils/date.util';
import {
  getAllSymptomCategories,
  SYMPTOM_CATEGORY_DISPLAY,
} from '../common/utils/symptom.util';
import {
  HealthReportResponse,
  PeriodLengthChartPoint,
  SymptomFrequencyItem,
} from '../common/interfaces/health-report.interface';
import { CycleService } from '../cycle/cycle.service';
import { SymptomsService } from '../symptoms/symptoms.service';
import { SymptomLogDocument } from '../symptoms/schemas/symptom-log.schema';

@Injectable()
export class HealthReportService {
  constructor(
    private readonly cycleService: CycleService,
    private readonly symptomsService: SymptomsService,
  ) {}

  
  async getReport(
    userId: string,
    month?: string,
  ): Promise<HealthReportResponse> {
    const monthRange = parseMonthParam(month ?? toCurrentMonth());
    const monthKey = monthRange?.label ?? toCurrentMonth();

    const cycleSummary = await this.cycleService.getSummary(userId);
    const logs = await this.symptomsService.findByUser(userId, monthKey);

    const flowSummary = this.buildFlowSummary(logs, cycleSummary.avgCycleLength);
    const periodLengthChart = this.buildPeriodLengthChart(
      logs,
      monthKey,
    );
    const symptomFrequency = this.buildSymptomFrequency(logs);

    return {
      cycleSummary: {
        cycleLength: cycleSummary.cycleLength,
        periodDuration: cycleSummary.periodDuration,
        estimatedNextPeriod: cycleSummary.estimatedNextPeriod,
        ovulationWindow: cycleSummary.ovulationWindow,
      },
      flowSummary,
      periodLengthChart,
      symptomFrequency,
      historicalLogs: logs,
    };
  }

  
  private buildFlowSummary(
    logs: SymptomLogDocument[],
    avgCycleLength: number,
  ): HealthReportResponse['flowSummary'] {
    const bloatingCount = logs.filter((log) =>
      log.digestion.some((s) => s.toLowerCase().includes('bloat')),
    ).length;
    const crampCount = logs.filter((log) =>
      log.physicalPain.some((s) => s.toLowerCase().includes('cramp')),
    ).length;

    const insight =
      bloatingCount > crampCount
        ? 'PMS symptoms were more frequent this month, especially bloating and cravings during the luteal phase.'
        : 'Cramps and physical discomfort were the dominant symptoms this month, peaking around your period days.';

    const tips = [
      'Low sleep nights → higher cramp scores',
      'Low hydration → increased bloating',
      'Gentle movement on day 1–2 can ease cramp intensity',
    ];

    return {
      avgCycleLength,
      insight,
      tips,
    };
  }

  
  private buildPeriodLengthChart(
    logs: SymptomLogDocument[],
    monthKey: string,
  ): PeriodLengthChartPoint[] {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    const dates = getDatesInMonth(year, monthIndex);

    const logByDate = new Map<string, number>();
    for (const log of logs) {
      const key = log.date.toISOString().split('T')[0];
      logByDate.set(key, log.flowIntensity);
    }

    return dates.map((date) => ({
      date,
      value: logByDate.get(date) ?? 0,
    }));
  }

  
  private buildSymptomFrequency(
    logs: SymptomLogDocument[],
  ): SymptomFrequencyItem[] {
    const categories = getAllSymptomCategories();
    const totalLogs = logs.length || 1;

    return categories.map((key) => {
      const { label, color } = SYMPTOM_CATEGORY_DISPLAY[key];
      const count = logs.filter((log) => log[key].length > 0).length;
      const percentage = Math.round((count / totalLogs) * 100);

      return {
        category: label,
        percentage: Math.min(100, percentage),
        color,
      };
    });
  }
}

function toCurrentMonth(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}
