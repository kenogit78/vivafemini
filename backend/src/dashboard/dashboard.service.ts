import { Injectable } from '@nestjs/common';
import { DashboardResponse } from '../common/interfaces/dashboard.interface';
import { getCurrentCycleDay } from '../common/utils/cycle.util';
import { ArticlesService } from '../articles/articles.service';
import { CycleTipsService } from '../cycle-tips/cycle-tips.service';
import { CycleService } from '../cycle/cycle.service';
import { SymptomsService } from '../symptoms/symptoms.service';
import { UsersService } from '../users/users.service';
import { SymptomLogDocument } from '../symptoms/schemas/symptom-log.schema';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cycleService: CycleService,
    private readonly symptomsService: SymptomsService,
    private readonly cycleTipsService: CycleTipsService,
    private readonly articlesService: ArticlesService,
  ) {}

  
  async getDashboard(userId: string): Promise<DashboardResponse> {
    const user = await this.usersService.findById(userId);
    const cycleSummary = await this.cycleService.getSummary(userId);
    const recentLogs = await this.symptomsService.findByUser(userId);

    const displayLog = this.findTodayLog(recentLogs) ?? recentLogs[0] ?? null;
    const dailyCheckOffs = this.buildDailyCheckOffs(displayLog);
    const trendWatch = this.buildTrendWatch(recentLogs);

    const currentDay = getCurrentCycleDay(
      user.lastPeriodStart,
      user.cycleLength,
    );
    const highlightDays = [
      currentDay,
      Math.min(currentDay + 1, user.cycleLength),
      Math.min(currentDay + 2, user.cycleLength),
    ];
    const cycleHighlights =
      await this.cycleTipsService.findByDays(highlightDays);

    const allArticles = await this.articlesService.findAll();
    const recommendedArticles = this.pickRecommendedArticles(allArticles);

    return {
      user: {
        name: user.name,
        avatar: user.avatar,
        referralBannerDismissed: user.referralBannerDismissed ?? false,
        pregnancyWidgetDismissed: user.pregnancyWidgetDismissed ?? false,
        pregnancyTestSelection: user.pregnancyTestSelection,
      },
      cycleSummary,
      dailyCheckOffs,
      trendWatch,
      cycleHighlights,
      recommendedArticles,
    };
  }

  
  private pickRecommendedArticles(
    articles: Awaited<ReturnType<ArticlesService['findAll']>>,
  ): Awaited<ReturnType<ArticlesService['findAll']>> {
    const order: Array<'stress' | 'nutrition' | 'sleep'> = [
      'stress',
      'nutrition',
      'sleep',
    ];
    const picked = order
      .map((category) => articles.find((article) => article.category === category))
      .filter((article): article is NonNullable<typeof article> => Boolean(article));
    return picked.length > 0 ? picked : articles.slice(0, 3);
  }

  
  private buildDailyCheckOffs(
    displayLog: SymptomLogDocument | null,
  ): DashboardResponse['dailyCheckOffs'] {
    if (!displayLog) {
      return {
        symptoms: [],
        healthReport: 'No activity logged today',
      };
    }

    const symptoms: string[] = [];

    const bloating = displayLog.digestion.find((s) =>
      s.toLowerCase().includes('bloat'),
    );
    if (bloating) {
      symptoms.push(bloating.startsWith('Mild') ? bloating : `Mild ${bloating}`);
    }

    const craving = displayLog.moodAndMental.find((s) =>
      s.toLowerCase().includes('craving'),
    );
    if (craving) {
      symptoms.push(craving);
    }

    if (symptoms.length === 0) {
      const fallback = [
        ...displayLog.digestion,
        ...displayLog.moodAndMental,
        ...displayLog.physicalPain,
      ].slice(0, 2);
      symptoms.push(...fallback);
    }

    return {
      symptoms: symptoms.length > 0 ? symptoms : ['No symptoms logged'],
      healthReport: displayLog.notes || 'Symptoms logged today',
    };
  }

  
  private buildTrendWatch(
    logs: SymptomLogDocument[],
  ): DashboardResponse['trendWatch'] {
    if (logs.length === 0) {
      return {
        mostFrequentSymptom: 'None',
        symptomIntensityChange: 'Stable',
      };
    }

    const symptomCounts = new Map<string, number>();
    for (const log of logs) {
      const all = [
        ...log.physicalPain,
        ...log.moodAndMental,
        ...log.digestion,
        ...log.periodIndicators,
        ...log.sexualHealth,
      ];
      for (const symptom of all) {
        symptomCounts.set(symptom, (symptomCounts.get(symptom) ?? 0) + 1);
      }
    }

    let mostFrequentSymptom = 'Bloating';
    let maxCount = 0;
    for (const [symptom, count] of symptomCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentSymptom = symptom;
      }
    }

    const recent = logs.slice(0, 7);
    const older = logs.slice(7, 14);
    const recentAvg =
      recent.reduce((sum, l) => sum + l.flowIntensity, 0) /
      (recent.length || 1);
    const olderAvg =
      older.reduce((sum, l) => sum + l.flowIntensity, 0) /
      (older.length || 1);

    let symptomIntensityChange: DashboardResponse['trendWatch']['symptomIntensityChange'] =
      'Stable';
    if (recentAvg > olderAvg + 0.5) {
      symptomIntensityChange = 'Increasing';
    } else if (recentAvg < olderAvg - 0.5) {
      symptomIntensityChange = 'Decreasing';
    }

    return { mostFrequentSymptom, symptomIntensityChange };
  }

  
  private findTodayLog(
    logs: SymptomLogDocument[],
  ): SymptomLogDocument | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      logs.find((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === today.getTime();
      }) ?? null
    );
  }
}
