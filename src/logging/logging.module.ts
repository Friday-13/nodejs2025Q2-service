import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingInterceptor } from './logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FileLoggingService } from './file-logging.service';

@Module({
  providers: [
    LoggingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: 'COMMON_FILE_LOGGING',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const envLogDir = configService.get('LOG_DIR') || './logs';
        const logDir = envLogDir;
        return new FileLoggingService(
          'home_library',
          'log',
          logDir,
          configService,
        );
      },
    },
    {
      provide: 'ERROR_FILE_LOGGING',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const envErrDir = configService.get('ERROR_DIR') || './errors';
        const errDir = envErrDir;
        return new FileLoggingService(
          'home_library',
          'err',
          errDir,
          configService,
        );
      },
    },
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
