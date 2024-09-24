import { OmitType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CommonGetApiDto } from './commonGetApi.dto';
import { DateFilter } from '../enum/enum';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  subject: string;
}

export class UpdateSubjectDto extends CreateSubjectDto {
  @IsNotEmpty()
  @IsPositive()
  subjectId: number;
}

export class GetSubjectsDto extends CommonGetApiDto {}

export class CreateOptionDto {
  @IsNotEmpty()
  @IsString()
  option: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsPositive()
  subjectId: number;

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray()
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class GetQuestionsDto extends CommonGetApiDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;
}

export class UpdateQuestionDto extends OmitType(CreateQuestionDto, [
  'subjectId',
] as const) {
  @IsNotEmpty()
  @IsPositive()
  questionId: number;
}

export class AssignTestDto {
  @IsNotEmpty()
  @IsPositive()
  userId: number;

  @IsNotEmpty()
  @IsPositive()
  subjectId: number;
}

class AnswerDto {
  @IsNotEmpty()
  @IsPositive()
  questionId: number;

  @IsNotEmpty()
  @IsPositive()
  optionId: number;
}

export class SubmitTestDto {
  @IsNotEmpty()
  @IsPositive()
  subjectId: number;

  @IsArray()
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class ReassignTestDto {
  @IsNotEmpty()
  @IsPositive()
  subjectId: number;

  @IsNotEmpty()
  @IsPositive()
  userId: number;
}

export class GetReassignedTestDto extends CommonGetApiDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  positionId?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  subjectId?: number;

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
