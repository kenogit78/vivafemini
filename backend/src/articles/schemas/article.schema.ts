import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleCategory = 'stress' | 'nutrition' | 'sleep' | 'fitness';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({
  collection: 'articles',
  timestamps: { createdAt: true, updatedAt: false },
})
export class Article {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  imageUrl: string;

  @Prop({ required: true, trim: true })
  excerpt: string;

  @Prop({ required: true, trim: true })
  readTime: string;

  @Prop({
    required: true,
    enum: ['stress', 'nutrition', 'sleep', 'fitness'],
  })
  category: ArticleCategory;

  createdAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
