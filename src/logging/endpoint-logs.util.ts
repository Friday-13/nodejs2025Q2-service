import { LoggingService } from './logging.service';

export function logRequest(logger: LoggingService, req: Request) {
  const method = req.method;
  const url = req.url;
  const body = JSON.stringify(req.body);

  logger.log(`📥 [Request] ${method} ${url} | Body: ${body}`);
}

export function logResponse(
  logger: LoggingService,
  status: string = '200',
  message: string = 'OK',
) {
  logger.log(`📤 [Response] ${status} ${message}`);
}
