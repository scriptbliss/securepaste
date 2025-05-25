import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
    PrismaModule,
    PasteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
