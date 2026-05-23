import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CycleSummaryResponse } from '../common/interfaces/cycle-summary.interface';
import { CycleService } from './cycle.service';
import { LogPeriodDto } from './dto/log-period.dto';
import { CycleLog } from './schemas/cycle-log.schema';

@ApiTags('cycle')
@Controller('cycle')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Get(':userId/summary')
  @ApiOperation({ summary: 'Get cycle summary for calendar and tracking' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  getSummary(@Param('userId') userId: string): Promise<CycleSummaryResponse> {
    return this.cycleService.getSummary(userId);
  }

  @Post(':userId/log')
  @ApiOperation({ summary: 'Log a new period start' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  @ApiResponse({ status: 201, description: 'Period logged successfully' })
  logPeriod(
    @Param('userId') userId: string,
    @Body() logPeriodDto: LogPeriodDto,
  ): Promise<CycleLog> {
    return this.cycleService.logPeriod(userId, logPeriodDto);
  }
}
