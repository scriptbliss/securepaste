import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/types/app-config.type';
import { GlobalExceptionFilter } from './common/filter/global-exception/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(configService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigins = configService.get<string>('CORS_ORIGIN');
  console.info('corsOrigins', corsOrigins);
  app.enableCors({
    origin: corsOrigins,
    credentials: true, // if using cookies or sessions
  });

  const appConfig = configService.get<AppConfig>('app');
  if (!appConfig) {
    throw new Error('App config not found!');
  }
  console.log('appConfig', appConfig);
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
