import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { computeSymptomStats } from '../common/utils/symptom.util';
import { Article, ArticleDocument } from '../articles/schemas/article.schema';
import { CycleTip, CycleTipDocument } from '../cycle-tips/schemas/cycle-tip.schema';
import { CycleLog, CycleLogDocument } from '../cycle/schemas/cycle-log.schema';
import { SymptomLog, SymptomLogDocument } from '../symptoms/schemas/symptom-log.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

export interface SeedResult {
  message: string;
  userId: string;
  counts: {
    users: number;
    cycleLogs: number;
    symptomLogs: number;
    articles: number;
    cycleTips: number;
  };
}

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(CycleLog.name)
    private readonly cycleLogModel: Model<CycleLogDocument>,
    @InjectModel(SymptomLog.name)
    private readonly symptomLogModel: Model<SymptomLogDocument>,
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    @InjectModel(CycleTip.name)
    private readonly cycleTipModel: Model<CycleTipDocument>,
  ) {}

  
  async seedAll(): Promise<SeedResult> {
    await Promise.all([
      this.userModel.deleteMany({}),
      this.cycleLogModel.deleteMany({}),
      this.symptomLogModel.deleteMany({}),
      this.articleModel.deleteMany({}),
      this.cycleTipModel.deleteMany({}),
    ]);

    const today = startOfDay(new Date());
    const cycleLength = 28;
    const periodDuration = 5;
    
    const lastPeriodStart = addDays(today, -14);
    const previousPeriodStart = addDays(lastPeriodStart, -cycleLength);

    const user = await this.userModel.create({
      name: 'Emmanuelle',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      cycleLength,
      periodDuration,
      lastPeriodStart,
    });

    const cycleLogs = await this.cycleLogModel.insertMany([
      {
        userId: user._id,
        periodStart: previousPeriodStart,
        periodEnd: addDays(previousPeriodStart, periodDuration - 1),
        cycleLength,
        notes: 'Regular flow, mild cramps',
      },
      {
        userId: user._id,
        periodStart: lastPeriodStart,
        periodEnd: addDays(lastPeriodStart, periodDuration - 1),
        cycleLength,
        notes: 'Heavier flow days 2–3',
      },
    ]);

    const symptomTemplates = [
      {
        dayOffset: 0,
        physicalPain: ['Cramps', 'Lower back pain'],
        moodAndMental: ['Irritable'],
        digestion: [] as string[],
        periodIndicators: ['Heavy flow'],
        sexualHealth: [] as string[],
        flowIntensity: 7,
        notes: 'Period day 1',
      },
      {
        dayOffset: 1,
        physicalPain: ['Cramps'],
        moodAndMental: ['Tired'],
        digestion: ['Bloating'],
        periodIndicators: ['Heavy flow'],
        sexualHealth: [],
        flowIntensity: 6,
        notes: '',
      },
      {
        dayOffset: 2,
        physicalPain: ['Cramps'],
        moodAndMental: ['Cravings'],
        digestion: ['Bloating'],
        periodIndicators: ['Medium flow'],
        sexualHealth: [],
        flowIntensity: 4,
        notes: 'Logged Pilates',
      },
      {
        dayOffset: 4,
        physicalPain: [],
        moodAndMental: ['Happy'],
        digestion: [],
        periodIndicators: ['Light flow'],
        sexualHealth: [],
        flowIntensity: 2,
        notes: '',
      },
      {
        dayOffset: 8,
        physicalPain: ['Headache'],
        moodAndMental: ['Anxious'],
        digestion: ['Bloating'],
        periodIndicators: [],
        sexualHealth: [],
        flowIntensity: 1,
        notes: '',
      },
      {
        dayOffset: 11,
        physicalPain: [],
        moodAndMental: ['Energetic', 'Happy'],
        digestion: [],
        periodIndicators: [],
        sexualHealth: ['Increased sex drive'],
        flowIntensity: 1,
        notes: 'Ovulation window',
      },
      {
        dayOffset: 15,
        physicalPain: ['Breast tenderness'],
        moodAndMental: ['Cravings', 'Mood swings'],
        digestion: ['Bloating'],
        periodIndicators: ['Spotting'],
        sexualHealth: [],
        flowIntensity: 1,
        notes: 'Luteal phase',
      },
      {
        dayOffset: 18,
        physicalPain: ['Cramps', 'Headache'],
        moodAndMental: ['Irritable', 'Cravings'],
        digestion: ['Bloating'],
        periodIndicators: [],
        sexualHealth: [],
        flowIntensity: 2,
        notes: 'PMS symptoms',
      },
      {
        dayOffset: 20,
        physicalPain: ['Cramps'],
        moodAndMental: ['Tired'],
        digestion: ['Mild Bloating', 'Cravings'],
        periodIndicators: [],
        sexualHealth: [],
        flowIntensity: 2,
        notes: 'Pilates (Logged)',
      },
    ];

    const symptomSeedData = symptomTemplates
      .map((template) => ({
        date: addDays(lastPeriodStart, template.dayOffset),
        physicalPain: template.physicalPain,
        moodAndMental: template.moodAndMental,
        digestion: template.digestion,
        periodIndicators: template.periodIndicators,
        sexualHealth: template.sexualHealth,
        flowIntensity: template.flowIntensity,
        notes: template.notes,
      }))
      .filter((entry) => entry.date.getTime() <= today.getTime());

    const symptomLogs = await Promise.all(
      symptomSeedData.map(async (entry) => {
        const categories = {
          physicalPain: entry.physicalPain,
          moodAndMental: entry.moodAndMental,
          digestion: entry.digestion,
          periodIndicators: entry.periodIndicators,
          sexualHealth: entry.sexualHealth,
        };
        const { topSymptom, totalSymptoms } = computeSymptomStats(categories);
        return this.symptomLogModel.create({
          userId: user._id,
          ...entry,
          ...categories,
          topSymptom,
          totalSymptoms,
        });
      }),
    );

    const articles = await this.articleModel.insertMany([
      {
        title: '5 Ways to Reduce Stress During Your Cycle',
        imageUrl:
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
        excerpt:
          'Practical ways to manage stress and support hormonal balance all month long.',
        readTime: '5 min read',
        category: 'stress',
      },
      {
        title: 'Best Nutrition Tips for Better Energy',
        imageUrl:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        excerpt:
          'Fuel your body with iron-rich, cycle-friendly foods for steady energy.',
        readTime: '4 min read',
        category: 'nutrition',
      },
      {
        title: 'How Sleep Affects Hormonal Balance',
        imageUrl:
          'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
        excerpt:
          'Understand the link between rest, hormones, and how you feel during your cycle.',
        readTime: '6 min read',
        category: 'sleep',
      },
      {
        title: 'Gentle Pilates for Cycle Syncing',
        imageUrl:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        excerpt:
          'Low-impact movement tailored to follicular, ovulation, and luteal phases.',
        readTime: '7 min read',
        category: 'fitness',
      },
      {
        title: 'Why Hydration Reduces Bloating',
        imageUrl:
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        excerpt:
          'The science behind water intake and digestive comfort before your period.',
        readTime: '3 min read',
        category: 'nutrition',
      },
    ]);

    const cycleTips = await this.cycleTipModel.insertMany(
      buildCycleTipsSeed(),
    );

    return {
      message: 'Database seeded successfully with VivaFemini sample data',
      userId: user._id.toString(),
      counts: {
        users: 1,
        cycleLogs: cycleLogs.length,
        symptomLogs: symptomLogs.length,
        articles: articles.length,
        cycleTips: cycleTips.length,
      },
    };
  }
}

interface CycleTipSeed {
  day: number;
  title: string;
  body: string;
  emoji: string;
  tagline: string;
  bgColor: string;
}

function buildCycleTipsSeed(): CycleTipSeed[] {
  const tips: CycleTipSeed[] = [
    {
      day: 1,
      title: 'Rest & Recover',
      body: 'Your period has started. Prioritize rest, warmth, and gentle movement.',
      emoji: '🛏️',
      tagline: 'Listen to your body',
      bgColor: '#FFF0F5',
    },
    {
      day: 5,
      title: 'Stay Comfortable',
      body: 'Flow may be lighter. Stay hydrated and choose iron-rich snacks.',
      emoji: '🥗',
      tagline: 'Nourish yourself',
      bgColor: '#FFF0F5',
    },
    {
      day: 14,
      title: 'Peak Energy',
      body: 'Ovulation window — you may feel more social and energetic.',
      emoji: '✨',
      tagline: 'Embrace your rhythm',
      bgColor: '#F3E5F5',
    },
    {
      day: 21,
      title: 'Luteal Care',
      body: 'PMS may appear. Track symptoms and reduce caffeine if bloating occurs.',
      emoji: '🌸',
      tagline: 'Prepare with kindness',
      bgColor: '#FFF8E1',
    },
    {
      day: 22,
      title: 'Mind Your Mood',
      body: 'Cravings and mood shifts are normal. Gentle yoga can help.',
      emoji: '🧘',
      tagline: 'Move gently',
      bgColor: '#FFF8E1',
    },
    {
      day: 28,
      title: 'Cycle Reset',
      body: 'Your next period may be near. Stock supplies and plan downtime.',
      emoji: '🔄',
      tagline: 'Ready for a new cycle',
      bgColor: '#FFF0F5',
    },
  ];

  for (let day = 1; day <= 35; day++) {
    if (tips.some((t) => t.day === day)) {
      continue;
    }
    tips.push({
      day,
      title: `Day ${day} Insight`,
      body: 'Track how you feel today — patterns help predict your next phase.',
      emoji: '💜',
      tagline: 'Know your cycle',
      bgColor: '#FFF0F5',
    });
  }

  return tips.sort((a, b) => a.day - b.day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
