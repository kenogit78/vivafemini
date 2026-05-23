import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CycleTip } from './schemas/cycle-tip.schema';
import { CycleTipsService } from './cycle-tips.service';

@ApiTags('cycle-tips')
@Controller('cycle-tips')
export class CycleTipsController {
  constructor(private readonly cycleTipsService: CycleTipsService) {}

  @Get(':day')
  @ApiOperation({ summary: 'Get cycle tip for a specific cycle day' })
  @ApiParam({ name: 'day', description: 'Cycle day (1–35)', example: 21 })
  @ApiResponse({ status: 200, description: 'Cycle tip returned' })
  @ApiResponse({ status: 404, description: 'Tip not found' })
  findByDay(@Param('day', ParseIntPipe) day: number): Promise<CycleTip> {
    return this.cycleTipsService.findByDay(day);
  }
}
