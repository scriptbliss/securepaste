import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AppConfig } from 'src/config/types/app-config.type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const appConfig = this.configService.get<AppConfig>('app');
    if (!appConfig) {
      throw new Error('App config not found!');
    }
    const isProd = appConfig.environment === 'production';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const getMessageFromException = (ex: unknown): string => {
      if (ex instanceof HttpException) {
        const res = ex.getResponse();
        if (typeof res === 'string') {
          return res;
        }

        if (typeof res === 'object' && res !== null && 'message' in res) {
          const msg = (res as Record<string, unknown>).message;
          if (typeof msg === 'string') {
            return msg;
          }
          if (Array.isArray(msg)) {
            return msg.join(', ');
          }
        }
      }

      return 'Internal server error';
    };

    const message = getMessageFromException(exception);

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(isProd
        ? {}
        : {
            error: exception instanceof Error ? exception.name : 'UnknownError',
            stack: exception instanceof Error ? exception.stack : undefined,
          }),
    };

    // Optional: Log the error (file, console, or external service)
    if (!isProd) {
      console.error(`[Exception] ${message}`, exception);
    }

    response.status(status).json(errorResponse);
  }
}
