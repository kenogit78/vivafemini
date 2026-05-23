import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SymptomLogDocument = HydratedDocument<SymptomLog>;

@Schema({
  collection: 'symptomlogs',
  timestamps: { createdAt: true, updatedAt: false },
})
export class SymptomLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: [String], default: [] })
  physicalPain: string[];

  @Prop({ type: [String], default: [] })
  moodAndMental: string[];

  @Prop({ type: [String], default: [] })
  digestion: string[];

  @Prop({ type: [String], default: [] })
  periodIndicators: string[];

  @Prop({ type: [String], default: [] })
  sexualHealth: string[];

  @Prop({ min: 1, max: 10, default: 1 })
  flowIntensity: number;

  @Prop({ trim: true, default: '' })
  notes: string;

  @Prop({ trim: true, default: 'None' })
  topSymptom: string;

  @Prop({ default: 0 })
  totalSymptoms: number;

  createdAt?: Date;
}

export const SymptomLogSchema = SchemaFactory.createForClass(SymptomLog);
