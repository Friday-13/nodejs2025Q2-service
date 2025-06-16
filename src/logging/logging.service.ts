import {
  ConsoleLogger,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileLoggingService } from './file-logging.service';

@Injectable()
export class LoggingService extends ConsoleLogger implements LoggerService {
  private logMode: 'file' | 'console';
  constructor(
    private configService: ConfigService,
    @Inject('COMMON_FILE_LOGGING')
    private commonFileLogging: FileLoggingService,
    @Inject('ERROR_FILE_LOGGING')
    private errorFileLogging: FileLoggingService,
  ) {
    super();
    const envMode = this.configService.get('LOG_MODE');
    this.logMode = envMode === 'file' ? 'file' : 'console';
  }

  log(message: any, ...optionalParams: any[]) {
    this.print(`My Log: ${message}; ${optionalParams}`);
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.print(`My Fatal: ${message}; ${optionalParams}`);
  }

  error(message: any, ...optionalParams: any[]) {
    this.print(`My Error: ${message}; ${optionalParams}`, true);
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

  private async print(message: string, isError: boolean = false) {
    if (this.logMode === 'console') {
      console.log(message);
    } else {
      await this.commonFileLogging.print(message);
      if (isError) {
        await this.errorFileLogging.print(message);
      }
    }
  }
}
