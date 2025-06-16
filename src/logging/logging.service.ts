import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class LoggingService extends ConsoleLogger implements LoggerService {
  private logDir: string;
  private logFileName = 'my-log';
  private logFilePostfix: string;
  private logFileSequece: number;
  private logFileTimeStamp: number;

  private logFileSize: number;
  private logMode: 'file' | 'console';
  private logFileRotation: number;
  constructor(private configService: ConfigService) {
    super();

    const envLogDir = this.configService.get('LOG_DIR') || './logs';
    this.logDir = envLogDir;

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
    return path.join(
      this.logDir,
      `${this.logFileName}-${this.logFilePostfix}.log`,
    );
  }

  private async print(message: string) {
    if (this.logMode === 'console') {
      console.log(message);
    } else {
      if (!this.logFilePostfix) {
        await this.generateNewPostfix();
      }

      const messageSize = Buffer.byteLength(message + '\n', 'utf-8');
      const fileSize = await this.getLogFileSize();

      if (fileSize + messageSize > this.logFileSize) {
        await this.generateNewPostfix();
      }
      await this.rotateLogs();
      await fs.appendFile(this.logFilePath, message + '\n');
    }
  }

  private async getLogFileSize() {
    if (await this.isLogFileExists()) {
      const { size } = await fs.stat(this.logFilePath);
      return size;
    }
    return 0;
  }

  private async isLogFileExists() {
    try {
      await fs.stat(this.logFilePath);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  }

  private async generateNewPostfix() {
    const timestamp = Date.now();
    if (timestamp !== this.logFileTimeStamp) {
      this.logFileTimeStamp = timestamp;
      this.logFileSequece = 0;
    } else {
      this.logFileSequece += 0;
    }

    this.logFilePostfix =
      this.logFileTimeStamp + '-' + `${this.logFileSequece}`.padStart(4, '0');
  }

  private async rotateLogs() {
    const fileList = (await fs.readdir(this.logDir)).sort();
    if (fileList.length > this.logFileRotation) {
      const fileToRemove = fileList.slice(
        0,
        fileList.length - this.logFileRotation,
      );
      fileToRemove.forEach(async (fileName) => {
        const filePath = path.join(this.logDir, fileName);
        await fs.rm(filePath);
      });
    }
  }
}
