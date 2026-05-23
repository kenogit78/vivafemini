import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CycleTipDocument = HydratedDocument<CycleTip>;

@Schema({ collection: 'cycletips' })
export class CycleTip {
  @Prop({ required: true, min: 1, max: 35 })
  day: number;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  body: string;

  @Prop({ required: true, trim: true })
  emoji: string;

  @Prop({ required: true, trim: true })
  tagline: string;

  @Prop({ required: true, trim: true })
  bgColor: string;
}

export const CycleTipSchema = SchemaFactory.createForClass(CycleTip);
