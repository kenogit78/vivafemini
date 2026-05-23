import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HealthReportResponse } from '../common/interfaces/health-report.interface';
import { HealthReportService } from './health-report.service';

@ApiTags('health-report')
@Controller('health-report')
export class HealthReportController {
  constructor(private readonly healthReportService: HealthReportService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get monthly health report for a user' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  @ApiQuery({ name: 'month', required: false, example: '2025-10' })
  getReport(
    @Param('userId') userId: string,
    @Query('month') month?: string,
  ): Promise<HealthReportResponse> {
    return this.healthReportService.getReport(userId, month);
  }
}
