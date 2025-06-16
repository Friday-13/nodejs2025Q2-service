import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { logResponse } from 'src/logging/endpoint-logs.util';
import { LoggingService } from 'src/logging/logging.service';

@Catch()
export class ExceptionFilterWithLogging implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggingService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    let message = 'Unknown error';
    if (exception instanceof Error) {
      if (exception instanceof HttpException) {
        message = exception.message;
      } else {
        message = `name: ${exception.name}; message: ${exception.message}; stack: ${exception.stack}`;
      }
    }

    logResponse(this.logger, String(httpStatus), message);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
