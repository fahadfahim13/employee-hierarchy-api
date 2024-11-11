import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CustomLogger } from 'src/logging/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, headers } = request;
    const now = Date.now();
    const requestId = headers['x-request-id'] || `req-${now}`;

    // Log request
    this.logger.log(`Incoming Request: ${method} ${url}`, 'LoggingInterceptor');

    if (Object.keys(body).length > 0) {
      this.logger.debug(
        `Request Body: ${JSON.stringify(body)}`,
        'LoggingInterceptor',
      );
    }

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          // Log successful response
          const responseTime = Date.now() - now;
          this.logger.log(
            `Response: ${method} ${url} ${response.statusCode} - ${responseTime}ms`,
            'LoggingInterceptor',
          );
          this.logger.debug(
            `Response Body: ${JSON.stringify(data)}`,
            'LoggingInterceptor',
          );
        },
        error: (error) => {
          // Log error response
          const responseTime = Date.now() - now;
          this.logger.error(
            `Response Error: ${method} ${url} ${error.status || 500} - ${responseTime}ms`,
            error.stack,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }
}
