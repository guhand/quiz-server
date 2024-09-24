import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { CommonGetApiDto } from './commonGetApi.dto';

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  position: string;
}

export class UpdatePositionDto extends CreatePositionDto {
  @IsNotEmpty()
  @IsPositive()
  positionId: number;
}

export class GetPositionsDto extends CommonGetApiDto {}
