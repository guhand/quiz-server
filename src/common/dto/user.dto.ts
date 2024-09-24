import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DateFilter, Role, ExperienceLevel } from '../enum/enum';
import { Transform } from 'class-transformer';
import { CommonGetApiDto } from './commonGetApi.dto';
import { OmitType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'first name is too short',
  })
  @MaxLength(20, {
    message: 'first name is too long',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1, {
    message: 'last name cannot be empty',
  })
  @MaxLength(20, {
    message: 'last name is too long',
  })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^[6-9]{1}[0-9]{9}$/, {
    message:
      'Mobile number should be an India number and it should contain only 10 digits',
  })
  mobile: string;

  @IsNotEmpty()
  @IsEnum(Role)
  roleId: number;

  @Transform(({ value }) => value.split('T')[0]) // Transform date format
  @IsOptional()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsPositive()
  positionId?: number;

  @IsOptional()
  @IsBoolean()
  isFresher?: boolean;

  @IsOptional()
  @IsPositive()
  yearsOfExperience?: number;
}

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'roleId',
] as const) {
  @IsNotEmpty()
  @IsPositive()
  userId: number;
}

export class GetUsersDto extends CommonGetApiDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  positionId?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  subjectId?: number;

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

export class UploadBulkUsersDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsPositive()
  subjectId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsPositive()
  positionId: number;
}
