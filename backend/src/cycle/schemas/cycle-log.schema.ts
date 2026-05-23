import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CycleLogDocument = HydratedDocument<CycleLog>;

@Schema({
  collection: 'cyclelogs',
  timestamps: { createdAt: true, updatedAt: false },
})
export class CycleLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  periodStart: Date;

  @Prop({ type: Date })
  periodEnd?: Date;

  @Prop({ required: true, min: 21, max: 45 })
  cycleLength: number;

  @Prop({ trim: true, default: '' })
  notes: string;

  createdAt?: Date;
}

export const CycleLogSchema = SchemaFactory.createForClass(CycleLog);
