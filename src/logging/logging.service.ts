import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';

@Injectable()
export class LoggingService extends ConsoleLogger implements LoggerService {
  private logMode: 'console' | 'file';
  constructor(private configService: ConfigService) {
    super();
    const mode = this.configService.get('LOG_MODE');
    this.logMode = mode === 'file' ? 'file' : 'console';
  }

  log(message: any, ...optionalParams: any[]) {
    this.print(`My Log: ${message}; ${optionalParams}`);
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.print(`My Fatal: ${message}; ${optionalParams}`);
  }

  error(message: any, ...optionalParams: any[]) {
    this.print(`My Error: ${message}; ${optionalParams}`);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.print(`My Warn: ${message}; ${optionalParams}`);
  }
  debug(message: any, ...optionalParams: any[]) {
    this.print(`My Debug: ${message}; ${optionalParams}`);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.print(`My Verbose: ${message}; ${optionalParams}`);
  }

  private async print(message: string) {
    if (this.logMode === 'console') {
      console.log(message);
    } else {
      await fs.appendFile('/usr/app/logs/my-log.log', message + '\n');
    }
  }
}
