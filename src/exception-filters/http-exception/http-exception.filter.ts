import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { logResponse } from 'src/logging/endpoint-logs.util';
import { LoggingService } from 'src/logging/logging.service';

@Catch(HttpException)
export class HttpExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(private readonly logger: LoggingService) {
    super();
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('hehehehe');
    const status = exception.getStatus();
    const message = exception.message;
    super.catch(exception, host);
    logResponse(this.logger, status.toString(), message);
  }
}
