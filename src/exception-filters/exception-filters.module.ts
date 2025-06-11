import { Module } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { LoggingModule } from 'src/logging/logging.module';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [LoggingModule],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class ExceptionFiltersModule {}
