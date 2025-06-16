import { Module } from '@nestjs/common';
import { LoggingModule } from 'src/logging/logging.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilterWithLogging } from './exception-with-logging/exception-with-logging.filter';

@Module({
  imports: [LoggingModule],
  providers: [{ provide: APP_FILTER, useClass: ExceptionFilterWithLogging }],
})
export class ExceptionFiltersModule {}
