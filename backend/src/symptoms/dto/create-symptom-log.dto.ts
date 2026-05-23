import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateSymptomLogDto {
  @ApiProperty({ example: '2025-10-09' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ example: ['Cramps', 'Headache'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  physicalPain?: string[];

  @ApiPropertyOptional({ example: ['Happy', 'Cravings'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  moodAndMental?: string[];

  @ApiPropertyOptional({ example: ['Bloating'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  digestion?: string[];

  @ApiPropertyOptional({ example: ['Spotting'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  periodIndicators?: string[];

  @ApiPropertyOptional({ example: ['Increased sex drive'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sexualHealth?: string[];

  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  flowIntensity?: number;

  @ApiPropertyOptional({ example: 'Felt better after rest' })
  @IsOptional()
  @IsString()
  notes?: string;
}
