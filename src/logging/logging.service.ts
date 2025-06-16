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
  private logFileRotation: number;
  constructor(private configService: ConfigService) {
    super();

    const envFileSize: string =
      this.configService.get('LOG_FILE_SIZE_KB') || '10';
    this.logFileSize = parseFloat(envFileSize) * 1024;

    const envMode = this.configService.get('LOG_MODE');
    this.logMode = envMode === 'file' ? 'file' : 'console';

    const rotationEnv = this.configService.get('LOG_FILE_ROTATE_NUMBER');
    this.logFileRotation = rotationEnv ? Number(rotationEnv) : 3;
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
        this.logFilePostfix = Date.now() + '-' + randomUUID().slice(0, 5);
        const fileList = (await fs.readdir('/usr/app/logs')).sort();
        if (fileList.length >= this.logFileRotation) {
          const fileToRemove = fileList.slice(
            0,
            fileList.length - this.logFileRotation + 1,
          );
          fileToRemove.forEach(
            async (fileName) => await fs.rm(`/usr/app/logs/${fileName}`),
          );
        }
        const newfileList = (await fs.readdir('/usr/app/logs')).sort();
        console.log(newfileList);
      }
      await fs.appendFile(this.logFilePath, message + '\n');
    }
  }
}
