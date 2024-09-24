import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/common/database/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PositionModule } from '../position/position.module';
import { TestModule } from '../test/test.module';
import { QuestionModule } from '../test/question/question.module';
import { ResultsModule } from '../result/result.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    PositionModule,
    TestModule,
    QuestionModule,
    ResultsModule,
    DashboardModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
