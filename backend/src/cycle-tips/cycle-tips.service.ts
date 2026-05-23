import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CycleTip, CycleTipDocument } from './schemas/cycle-tip.schema';

@Injectable()
export class CycleTipsService {
  constructor(
    @InjectModel(CycleTip.name)
    private readonly cycleTipModel: Model<CycleTipDocument>,
  ) {}

  
  async findByDay(day: number): Promise<CycleTipDocument> {
    const tip = await this.cycleTipModel.findOne({ day }).exec();
    if (!tip) {
      throw new NotFoundException(`No cycle tip found for day ${day}`);
    }
    return tip;
  }

  
  async findByDays(days: number[]): Promise<CycleTipDocument[]> {
    return this.cycleTipModel.find({ day: { $in: days } }).sort({ day: 1 }).exec();
  }
}
