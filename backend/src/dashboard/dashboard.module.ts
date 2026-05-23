import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { CycleTipsModule } from '../cycle-tips/cycle-tips.module';
import { CycleModule } from '../cycle/cycle.module';
import { SymptomsModule } from '../symptoms/symptoms.module';
import { UsersModule } from '../users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    UsersModule,
    CycleModule,
    SymptomsModule,
    CycleTipsModule,
    ArticlesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
