import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { PositionRepository } from './position.repository';

@Module({
  controllers: [PositionController],
  providers: [PositionService, PositionRepository],
})
export class PositionModule {}
