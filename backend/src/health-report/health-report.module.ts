import { Module } from '@nestjs/common';
import { CycleModule } from '../cycle/cycle.module';
import { SymptomsModule } from '../symptoms/symptoms.module';
import { HealthReportController } from './health-report.controller';
import { HealthReportService } from './health-report.service';

@Module({
  imports: [CycleModule, SymptomsModule],
  controllers: [HealthReportController],
  providers: [HealthReportService],
})
export class HealthReportModule {}
