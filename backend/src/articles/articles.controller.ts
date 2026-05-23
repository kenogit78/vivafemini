import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Article, ArticleCategory } from './schemas/article.schema';
import { ArticlesService } from './articles.service';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all articles, optionally by category' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ['stress', 'nutrition', 'sleep', 'fitness'],
  })
  findAll(@Query('category') category?: ArticleCategory): Promise<Article[]> {
    return this.articlesService.findAll(category);
  }
}
