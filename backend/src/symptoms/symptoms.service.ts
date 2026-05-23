import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { parseMonthParam } from '../common/utils/date.util';
import { computeSymptomStats } from '../common/utils/symptom.util';
import { CreateSymptomLogDto } from './dto/create-symptom-log.dto';
import { UpdateSymptomLogDto } from './dto/update-symptom-log.dto';
import { SymptomLog, SymptomLogDocument } from './schemas/symptom-log.schema';

@Injectable()
export class SymptomsService {
  constructor(
    @InjectModel(SymptomLog.name)
    private readonly symptomLogModel: Model<SymptomLogDocument>,
  ) {}

  
  async findByUser(
    userId: string,
    month?: string,
  ): Promise<SymptomLogDocument[]> {
    const filter: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };

    const monthRange = parseMonthParam(month);
    if (monthRange) {
      filter.date = { $gte: monthRange.start, $lte: monthRange.end };
    }

    return this.symptomLogModel.find(filter).sort({ date: -1 }).exec();
  }

  
  async create(
    userId: string,
    createDto: CreateSymptomLogDto,
  ): Promise<SymptomLogDocument> {
    const symptomInput = {
      physicalPain: createDto.physicalPain ?? [],
      moodAndMental: createDto.moodAndMental ?? [],
      digestion: createDto.digestion ?? [],
      periodIndicators: createDto.periodIndicators ?? [],
      sexualHealth: createDto.sexualHealth ?? [],
    };

    const { topSymptom, totalSymptoms } = computeSymptomStats(symptomInput);

    const log = new this.symptomLogModel({
      userId: new Types.ObjectId(userId),
      date: new Date(createDto.date),
      ...symptomInput,
      flowIntensity: createDto.flowIntensity ?? 1,
      notes: createDto.notes ?? '',
      topSymptom,
      totalSymptoms,
    });

    return log.save();
  }

  
  async update(
    userId: string,
    logId: string,
    updateDto: UpdateSymptomLogDto,
  ): Promise<SymptomLogDocument> {
    const existing = await this.findOneOrFail(userId, logId);

    const merged = {
      physicalPain: updateDto.physicalPain ?? existing.physicalPain,
      moodAndMental: updateDto.moodAndMental ?? existing.moodAndMental,
      digestion: updateDto.digestion ?? existing.digestion,
      periodIndicators: updateDto.periodIndicators ?? existing.periodIndicators,
      sexualHealth: updateDto.sexualHealth ?? existing.sexualHealth,
    };

    const { topSymptom, totalSymptoms } = computeSymptomStats(merged);

    const updated = await this.symptomLogModel
      .findOneAndUpdate(
        { _id: logId, userId: new Types.ObjectId(userId) },
        {
          ...updateDto,
          date: updateDto.date ? new Date(updateDto.date) : existing.date,
          ...merged,
          topSymptom,
          totalSymptoms,
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(
        `Symptom log "${logId}" not found for user "${userId}"`,
      );
    }

    return updated;
  }

  
  async remove(userId: string, logId: string): Promise<void> {
    const result = await this.symptomLogModel
      .deleteOne({ _id: logId, userId: new Types.ObjectId(userId) })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Symptom log "${logId}" not found for user "${userId}"`,
      );
    }
  }

  
  async findOneOrFail(
    userId: string,
    logId: string,
  ): Promise<SymptomLogDocument> {
    const log = await this.symptomLogModel
      .findOne({ _id: logId, userId: new Types.ObjectId(userId) })
      .exec();

    if (!log) {
      throw new NotFoundException(
        `Symptom log "${logId}" not found for user "${userId}"`,
      );
    }

    return log;
  }
}
