import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import {
  CorrelationIdMiddleware,
  RequestLoggerMiddleware,
} from './common/middleware';
import appConfig from './config/app.config';
import cryptoConfig from './config/crypto.config';
import databaseConfig from './config/database.config';
import validationSchema from './config/validation.schema';
import { PasteModule } from './paste/paste.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // fallback to `.env`
      load: [appConfig, databaseConfig, cryptoConfig],
      validationSchema,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        // mounts the ClsMiddleware for all routes
        mount: true,
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    PrismaModule,
    PasteModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware, RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
