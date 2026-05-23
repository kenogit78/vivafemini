import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Emmanuelle' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-avatar' })
  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsNumber()
  @Min(21)
  @Max(45)
  cycleLength?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(10)
  periodDuration?: number;

  @ApiPropertyOptional({ example: '2025-10-01' })
  @IsOptional()
  @IsDateString()
  lastPeriodStart?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  referralBannerDismissed?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  pregnancyWidgetDismissed?: boolean;

  @ApiPropertyOptional({ example: 'positive' })
  @IsOptional()
  @IsString()
  pregnancyTestSelection?: string;
}
