import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleCategory, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}

  
  async findAll(category?: ArticleCategory): Promise<ArticleDocument[]> {
    const filter = category ? { category } : {};
    return this.articleModel.find(filter).sort({ createdAt: -1 }).exec();
  }
}
