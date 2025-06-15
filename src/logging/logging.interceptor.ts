import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { logRequest, logResponse } from './endpoint-logs.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    logRequest(this.loggingService, request);
    return next.handle().pipe(
      map((data) => {
        logResponse(
          this.loggingService,
          response.statusCode,
          JSON.stringify(data),
        );
        return data;
      }),
    );
  }
}
