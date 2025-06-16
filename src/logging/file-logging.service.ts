import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class FileLoggingService {
  private logDir: string;
  private logFilePostfix: string;
  private logFileSequece: number;
  private logFileTimeStamp: number;

  private logFileSize: number;
  private logFileRotation: number;

  constructor(
    private logFileName: string,
    private logFileExt: string,
    private configService: ConfigService,
  ) {
    const envLogDir = this.configService.get('LOG_DIR') || './logs';
    this.logDir = envLogDir;

    const envFileSize: string =
      this.configService.get('LOG_FILE_SIZE_KB') || '10';
    this.logFileSize = parseFloat(envFileSize) * 1024;

    const rotationEnv = this.configService.get('LOG_FILE_ROTATE_NUMBER');
    this.logFileRotation = rotationEnv ? Number(rotationEnv) : 3;
  }
  async print(message: string) {
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

  private get logFilePath() {
    return path.join(
      this.logDir,
      `${this.logFileName}-${this.logFilePostfix}.${this.logFileExt}`,
    );
  }
}
