import { registerAs } from '@nestjs/config';
import { CryptoConfig } from './types/crypto-config.type';

export default registerAs(
  'crypto',
  (): CryptoConfig => ({
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    ivLength: Number(process.env.ENCRYPTION_IV_LENGTH) || 16,
    secretKey: process.env.SECRET_KEY || '',
  }),
);
