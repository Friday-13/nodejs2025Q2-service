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
  private logLevel: number;
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

    const logLevelEnv = this.configService.get('LOG_LEVEL');
    this.logLevel = isNaN(logLevelEnv) ? 6 : Number(logLevelEnv);
  }

  fatal(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 0) {
      this.print(`My Fatal: ${message}; ${optionalParams}`, true);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 1) {
      this.print(`My Error:${message}; ${optionalParams}`, true);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 2) {
      this.print(`My Warn:${message}; ${optionalParams}`);
    }
  }

  log(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 3) {
      this.print(`My Log:${message}; ${optionalParams}`);
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 4) {
      this.print(`My Debug:${message}; ${optionalParams}`);
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= 5) {
      this.print(`My Verbose:${message}; ${optionalParams}`);
    }
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
