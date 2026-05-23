import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';
import { CycleTipsModule } from './cycle-tips/cycle-tips.module';
import { CycleModule } from './cycle/cycle.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthReportModule } from './health-report/health-report.module';
import { SeedModule } from './seed/seed.module';
import { SymptomsModule } from './symptoms/symptoms.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CycleModule,
    SymptomsModule,
    HealthReportModule,
    ArticlesModule,
    CycleTipsModule,
    DashboardModule,
    SeedModule,
  ],
})
export class AppModule {}
