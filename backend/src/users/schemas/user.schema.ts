import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: { createdAt: true, updatedAt: false } })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  avatar: string;

  @Prop({ default: 28, min: 21, max: 45 })
  cycleLength: number;

  @Prop({ default: 5, min: 2, max: 10 })
  periodDuration: number;

  @Prop({ required: true, type: Date })
  lastPeriodStart: Date;

  @Prop({ default: false })
  referralBannerDismissed: boolean;

  @Prop({ default: false })
  pregnancyWidgetDismissed: boolean;

  @Prop({ required: false, trim: true })
  pregnancyTestSelection?: string;

  createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
