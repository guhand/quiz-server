import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Config } from './common/config/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/exception.filter';

/**
 * @function bootstrap
 * @description Bootstraps the Nest.js application, setting up configurations and starting the server.
 * @returns {Promise<void>} Promise that resolves when the application is successfully started.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['log', 'debug', 'error', 'warn'],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(Config.port);
}

bootstrap();
