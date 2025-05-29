import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './../../generated/prisma';
// import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connection established', PrismaService.name);
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database connection closed', PrismaService.name);
  }
}
