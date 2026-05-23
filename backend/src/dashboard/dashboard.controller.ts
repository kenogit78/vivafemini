import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DashboardResponse } from '../common/interfaces/dashboard.interface';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get home dashboard data for a user' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  getDashboard(@Param('userId') userId: string): Promise<DashboardResponse> {
    return this.dashboardService.getDashboard(userId);
  }
}
