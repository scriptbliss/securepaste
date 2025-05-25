import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // const isProd = process.env.NODE_ENV === 'production';
    const isProd = false;

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
