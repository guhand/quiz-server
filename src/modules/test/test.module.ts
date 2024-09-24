import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestRepository } from './test.repository';
import { QuestionModule } from './question/question.module';
import { AuthService } from '../auth/auth.service';
import { AuthRespository } from '../auth/auth.repository';

@Module({
  controllers: [TestController],
  providers: [TestService, TestRepository, AuthService, AuthRespository],
  imports: [QuestionModule],
})
export class TestModule {}
