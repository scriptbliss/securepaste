import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { Express } from 'express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filter/global-exception/global-exception.filter';
import { LoggerService } from './common/logger/logger.service';
import { AppConfig } from './config/types/app-config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const expressApp = app.getHttpAdapter().getInstance() as Express;
  expressApp.set('trust proxy', true);

  const configService = app.get(ConfigService);

  // 1. Enable CORS first
  const corsOrigins = configService.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigins,
    credentials: true, // if using cookies or sessions
  });

  // 2. Set up logger
  const loggerService = app.get(LoggerService);
  app.useLogger(loggerService);

  // 3. Register global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(configService, loggerService));

  const appConfig = configService.get<AppConfig>('app');
  if (!appConfig) {
    throw new Error('App config not found!');
  }
  const server_host: string = appConfig.host;
  const server_port: number = appConfig.port;

  await app.listen(server_port, server_host);
  console.log(`Server running on http://${server_host}:${server_port}`);
}
bootstrap()
  .then(() => {
    console.log('Bootstrap completed successfully');
  })
  .catch((err) => {
    console.error('Bootstrap failed:', err);
  });
