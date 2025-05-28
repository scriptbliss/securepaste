import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${userAgent} - ${ip}`;

      if (statusCode >= 500) {
        this.logger.error(message, RequestLoggerMiddleware.name);
      } else if (statusCode >= 400) {
        this.logger.warn(message, RequestLoggerMiddleware.name);
      } else {
        this.logger.log(message, RequestLoggerMiddleware.name);
      }
    });

    next();
  }
}
