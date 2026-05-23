import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSymptomLogDto } from './dto/create-symptom-log.dto';
import { UpdateSymptomLogDto } from './dto/update-symptom-log.dto';
import { SymptomLog } from './schemas/symptom-log.schema';
import { SymptomsService } from './symptoms.service';

@ApiTags('symptoms')
@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get symptom logs for a user' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  @ApiQuery({ name: 'month', required: false, example: '2025-10' })
  findByUser(
    @Param('userId') userId: string,
    @Query('month') month?: string,
  ): Promise<SymptomLog[]> {
    return this.symptomsService.findByUser(userId, month);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new symptom log' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  create(
    @Param('userId') userId: string,
    @Body() createDto: CreateSymptomLogDto,
  ): Promise<SymptomLog> {
    return this.symptomsService.create(userId, createDto);
  }

  @Patch(':userId/:logId')
  @ApiOperation({ summary: 'Update a symptom log' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  @ApiParam({ name: 'logId', description: 'Symptom log MongoDB ID' })
  update(
    @Param('userId') userId: string,
    @Param('logId') logId: string,
    @Body() updateDto: UpdateSymptomLogDto,
  ): Promise<SymptomLog> {
    return this.symptomsService.update(userId, logId, updateDto);
  }

  @Delete(':userId/:logId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a symptom log' })
  @ApiParam({ name: 'userId', description: 'User MongoDB ID' })
  @ApiParam({ name: 'logId', description: 'Symptom log MongoDB ID' })
  @ApiResponse({ status: 204, description: 'Log deleted' })
  async remove(
    @Param('userId') userId: string,
    @Param('logId') logId: string,
  ): Promise<void> {
    await this.symptomsService.remove(userId, logId);
  }
}
