import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log(`My Log: ${message}; ${optionalParams}`);
  }

  fatal(message: any, ...optionalParams: any[]) {
    console.log(`My Fatal: ${message}; ${optionalParams}`);
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(`My Error: ${message}; ${optionalParams}`);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(`My Warn: ${message}; ${optionalParams}`);
  }
  debug(message: any, ...optionalParams: any[]) {
    console.log(`My Debug: ${message}; ${optionalParams}`);
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(`My Verbose: ${message}; ${optionalParams}`);
  }
}
