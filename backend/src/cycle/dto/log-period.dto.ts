import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class LogPeriodDto {
  @ApiProperty({ example: '2025-10-07' })
  @IsDateString()
  @IsNotEmpty()
  periodStart: string;

  @ApiPropertyOptional({ example: '2025-10-11' })
  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsNumber()
  @Min(21)
  @Max(45)
  cycleLength?: number;

  @ApiPropertyOptional({ example: 'Light flow, felt tired' })
  @IsOptional()
  @IsString()
  notes?: string;
}
