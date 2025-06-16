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
      useFactory: (configService: ConfigService) =>
        new FileLoggingService('home_library', 'log', configService),
    },
    {
      provide: 'ERROR_FILE_LOGGING',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new FileLoggingService('home_library', 'err', configService),
    },
  ],
  exports: [LoggingService],
})
export class LoggingModule {}
