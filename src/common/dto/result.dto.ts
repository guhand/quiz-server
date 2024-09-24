import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
import { DateFilter, ExperienceLevel, PercentageFilter } from '../enum/enum';
import { CommonGetApiDto } from './commonGetApi.dto';

export class GetResultsDto extends CommonGetApiDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  positionId?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  subjectId?: number;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsEnum(PercentageFilter)
  percentage?: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: number;

  @IsOptional()
  @IsEnum(DateFilter)
  dateFilter?: DateFilter;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
