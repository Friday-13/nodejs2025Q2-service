import { Request } from 'express';
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
  switch (status[0]) {
    case '2':
      logger.log(`📤 [Response] ${status} ${message}`);
      break;
    case '4':
      logger.warn(`📤 [Response] ${status} ${message}`);
      break;
    case '5':
      logger.error(`📤 [Response] ${status} ${message}`);
      break;
    default:
      logger.log(`📤 [Response] ${status} ${message}`);
  }

  if (status[0] === '2') {
    logger.log(`📤 [Response] ${status} ${message}`);
  } else if (status[0] === '4') {
    logger.warn(`📤 [Response] ${status} ${message}`);
  }
}
