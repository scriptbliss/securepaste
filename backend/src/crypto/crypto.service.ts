import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { CryptoConfig } from 'src/config/types/crypto-config.type';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class CryptoService {
  private readonly algorithm: string;
  private readonly ivLength: number;
  private readonly key: Buffer;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const cryptoConfig = configService.get<CryptoConfig>('crypto');
    if (!cryptoConfig) {
      throw new Error('Crypto config not found!');
    }
    this.algorithm = cryptoConfig.algorithm;
    this.ivLength = cryptoConfig.ivLength;
    const secretKey = cryptoConfig.secretKey;
    this.key = crypto.createHash('sha256').update(secretKey).digest();
    this.logger.log('CryptoService initialized', CryptoService.name);
  }

  encrypt(text: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    this.logger.debug('Text encrypted', CryptoService.name);
    return {
      encrypted: encrypted.toString('hex'),
      iv: iv.toString('hex'),
    };
  }

  decrypt(encrypted: string, iv: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex'),
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'hex')),
      decipher.final(),
    ]);
    this.logger.debug('Text decrypted', CryptoService.name);
    return decrypted.toString('utf8');
  }
}
