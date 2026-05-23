import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../articles/schemas/article.schema';
import { CycleTip, CycleTipSchema } from '../cycle-tips/schemas/cycle-tip.schema';
import { CycleLog, CycleLogSchema } from '../cycle/schemas/cycle-log.schema';
import { SymptomLog, SymptomLogSchema } from '../symptoms/schemas/symptom-log.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: CycleLog.name, schema: CycleLogSchema },
      { name: SymptomLog.name, schema: SymptomLogSchema },
      { name: Article.name, schema: ArticleSchema },
      { name: CycleTip.name, schema: CycleTipSchema },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
