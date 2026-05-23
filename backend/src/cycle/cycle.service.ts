import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  averageCycleLength,
  buildCycleCalendar,
  formatDateRange,
  formatShortDate,
} from '../common/utils/cycle.util';
import { CycleSummaryResponse } from '../common/interfaces/cycle-summary.interface';
import { UsersService } from '../users/users.service';
import { LogPeriodDto } from './dto/log-period.dto';
import { CycleLog, CycleLogDocument } from './schemas/cycle-log.schema';

@Injectable()
export class CycleService {
  constructor(
    @InjectModel(CycleLog.name)
    private readonly cycleLogModel: Model<CycleLogDocument>,
    private readonly usersService: UsersService,
  ) {}

  
  async getSummary(userId: string): Promise<CycleSummaryResponse> {
    const user = await this.usersService.findById(userId);
    const logs = await this.cycleLogModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ periodStart: -1 })
      .exec();

    const historicalLengths = logs
      .map((log) => log.cycleLength)
      .filter((len) => len > 0);

    const avgCycleLength = averageCycleLength(
      historicalLengths,
      user.cycleLength,
    );

    const calendar = buildCycleCalendar({
      lastPeriodStart: user.lastPeriodStart,
      cycleLength: user.cycleLength,
      periodDuration: user.periodDuration,
    });

    return {
      lastPeriodStart: user.lastPeriodStart.toISOString().split('T')[0],
      cycleLength: user.cycleLength,
      periodDuration: user.periodDuration,
      estimatedNextPeriod: formatShortDate(calendar.estimatedNextPeriod),
      ovulationWindow: formatDateRange(
        calendar.ovulationWindowStart,
        calendar.ovulationWindowEnd,
      ),
      currentCycleDay: calendar.currentCycleDay,
      avgCycleLength,
      cycleProgress: calendar.cycleProgress,
      nextPeriodDate: formatShortDate(calendar.nextPeriodDate),
      nextPeriodDaysAway: calendar.nextPeriodDaysAway,
      fertileWindowStart: formatShortDate(calendar.fertileWindowStart),
      calendarMonth: calendar.calendarMonth,
      periodDays: calendar.periodDays,
      ovulationDays: calendar.ovulationDays,
    };
  }

  
  async logPeriod(
    userId: string,
    logPeriodDto: LogPeriodDto,
  ): Promise<CycleLogDocument> {
    const user = await this.usersService.findById(userId);
    const periodStart = new Date(logPeriodDto.periodStart);

    if (Number.isNaN(periodStart.getTime())) {
      throw new BadRequestException('Invalid periodStart date');
    }

    const cycleLength = logPeriodDto.cycleLength ?? user.cycleLength;

    const cycleLog = new this.cycleLogModel({
      userId: new Types.ObjectId(userId),
      periodStart,
      periodEnd: logPeriodDto.periodEnd
        ? new Date(logPeriodDto.periodEnd)
        : undefined,
      cycleLength,
      notes: logPeriodDto.notes ?? '',
    });

    await this.usersService.update(userId, {
      lastPeriodStart: logPeriodDto.periodStart,
      cycleLength,
    });

    return cycleLog.save();
  }
}
