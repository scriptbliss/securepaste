import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CryptoConfig } from 'src/config/types/crypto-config.type';

@Injectable()
export class CryptoService {
  private readonly algorithm: string;
  private readonly ivLength: number;
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const cryptoConfig = configService.get<CryptoConfig>('crypto');
    if (!cryptoConfig) {
      throw new Error('Crypto config not found!');
    }
    this.algorithm = cryptoConfig.algorithm;
    this.ivLength = cryptoConfig.ivLength;
    const secretKey = cryptoConfig.secretKey;
    this.key = crypto.createHash('sha256').update(secretKey).digest();
  }

  encrypt(text: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
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
    return decrypted.toString('utf8');
  }
}
