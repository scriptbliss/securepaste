import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './types/database-config.type';

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    dbUrl: process.env.DATABASE_URL || '',
  }),
);
