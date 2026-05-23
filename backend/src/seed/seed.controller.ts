import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedResult, SeedService } from './seed.service';

@ApiTags('seed')
@Controller()
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Seed all collections with sample data' })
  @ApiResponse({ status: 201, description: 'All collections seeded' })
  seed(): Promise<SeedResult> {
    return this.seedService.seedAll();
  }
}
