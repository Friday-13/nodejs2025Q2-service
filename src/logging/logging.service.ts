import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';

@Injectable()
export class LoggingService extends ConsoleLogger implements LoggerService {
  private logFileName = 'my-log';
  private logFilePostfix: string;
  private logFileSize: number;
  private logMode: 'file' | 'console';
  constructor(private configService: ConfigService) {
    super();
    const envFileSize: string =
      this.configService.get('LOG_FILE_SIZE_KB') || '10';
    this.logFileSize = parseFloat(envFileSize) * 1024;
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

  private get logFilePath() {
    return `/usr/app/logs/${this.logFileName}-${this.logFilePostfix}.log`;
  }

  private async print(message: string) {
    if (this.logMode === 'console') {
      console.log(message);
    } else {
      if (!this.logFilePostfix) {
        this.logFilePostfix = Date.now() + '-' + randomUUID().slice(0, 5);
      }

      const messageSize = Buffer.byteLength(message + '\n', 'utf-8');
      const fileStat = await fs.stat(this.logFilePath).catch(async (err) => {
        if (err.code === 'ENOENT') {
          await fs.appendFile(this.logFilePath, '');
          return { size: 0 };
        }
        throw err;
      });
      if (fileStat.size + messageSize > this.logFileSize) {
        console.log('Creating new file');
        this.logFilePostfix = Date.now() + '-' + randomUUID().slice(0, 5);
      }
      await fs.appendFile(this.logFilePath, message + '\n');
    }
  }
}
