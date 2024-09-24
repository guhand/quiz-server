import { IsOptional, IsEnum, IsString } from 'class-validator';
import { DateFilter } from '../enum/enum';

export class DashboardDto {
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
