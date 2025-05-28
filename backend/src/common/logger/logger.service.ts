import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { ClsService } from 'nestjs-cls';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { redactSensitive } from '../utils/redact-sensitive.util';
import { sanitizeStackTrace } from '../utils/sanitize-stack-trace.util';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/types/app-config.type';

type Metadata = Record<string, unknown>;

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly isProd: boolean;
  private readonly logger: winston.Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly cls: ClsService,
  ) {
    const appConfig = this.configService.get<AppConfig>('app');
    if (!appConfig) {
      throw new Error('App config not found!');
    }
    this.isProd = appConfig.environment === 'production';

    const baseFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
    );

    const devFormat = winston.format.combine(
      baseFormat,
      nestWinstonModuleUtilities.format.nestLike('SecurePaste', {
        prettyPrint: true,
        colors: true,
      }),
    );

    const prodFormat = winston.format.combine(
      baseFormat,
      winston.format.json(),
    );

    this.logger = winston.createLogger({
      level: this.isProd ? 'info' : 'debug',
      format: this.isProd ? prodFormat : devFormat,
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
          options: { mode: 0o600 },
        }),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
          options: { mode: 0o600 },
        }),
      ],
      exitOnError: false,
      handleExceptions: true,
      handleRejections: true,
    });
  }

  private buildMeta(
    context?: string,
    metadata?: Metadata,
    stack?: string,
  ): Metadata | undefined {
    const meta: Metadata = {};
    const warnings: string[] = [];

    if (metadata) {
      Object.assign(
        meta,
        this.isProd
          ? redactSensitive(metadata, undefined, 0, 10, warnings)
          : metadata,
      );
    }

    if (context) {
      meta.context = context;
    }

    if (stack) {
      meta.stack = stack;
    }
    // there always exists a correlationId - because of CorrelationIdMiddleware
    const correlationId: string | undefined = this.cls.isActive()
      ? (this.cls.get('correlationId') ?? undefined)
      : undefined;
    if (correlationId) {
      meta.correlationId = correlationId;
    }

    if (warnings.length) {
      meta.redactionWarnings = warnings;
    }

    return Object.keys(meta).length ? meta : undefined;
  }

  log(message: string, context?: string, metadata?: Metadata) {
    this.logger.info(message, this.buildMeta(context, metadata));
  }

  error(
    message: string | Error,
    context?: string,
    stack?: string,
    metadata?: Metadata,
  ) {
    if (message instanceof Error) {
      this.logger.error(
        message.message,
        this.buildMeta(
          context,
          metadata,
          this.isProd
            ? sanitizeStackTrace(message.stack ?? stack)
            : (message.stack ?? stack),
        ),
      );
    } else {
      this.logger.error(
        message,
        this.buildMeta(
          context,
          metadata,
          this.isProd ? sanitizeStackTrace(stack) : stack,
        ),
      );
    }
  }

  warn(message: string, context?: string, metadata?: Metadata) {
    this.logger.warn(message, this.buildMeta(context, metadata));
  }

  debug(message: string, context?: string, metadata?: Metadata) {
    this.logger.debug(message, this.buildMeta(context, metadata));
  }

  verbose(message: string, context?: string, metadata?: Metadata) {
    this.logger.verbose(message, this.buildMeta(context, metadata));
  }
}
