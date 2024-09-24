import { Module } from '@nestjs/common';
import { ResultsService } from './result.service';
import { ResultController } from './result.controller';
import { ResultRepository } from './result.repository';

@Module({
  controllers: [ResultController],
  providers: [ResultsService, ResultRepository],
})
export class ResultsModule {}
