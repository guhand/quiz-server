import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CommonGetApiDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  page?: number;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  search?: string;
}
