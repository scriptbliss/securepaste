import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { v4 as uuidv4, validate as validateUUID } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const rawCorrelationId = req.headers['x-correlation-id'];

    let correlationId: string;

    if (typeof rawCorrelationId === 'string') {
      correlationId = validateUUID(rawCorrelationId)
        ? rawCorrelationId
        : uuidv4();
    } else if (Array.isArray(rawCorrelationId) && rawCorrelationId.length > 0) {
      correlationId = validateUUID(rawCorrelationId[0])
        ? rawCorrelationId[0]
        : uuidv4();
    } else {
      correlationId = uuidv4();
    }

    this.cls.set('correlationId', correlationId);
    res.setHeader('x-correlation-id', correlationId);
    next();
  }
}
