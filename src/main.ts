import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(LoggingService));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .addServer('/')
    .setDescription('Home music library service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory);
  SwaggerModule.setup('doc', app, documentFactory);

  const configService = app.get(ConfigService);
  const loggingService = app.get(LoggingService);

  process.on('uncaughtException', async (err) => {
    loggingService.fatal(err);
  });

  process.on('unhandledRejection', async (err) => {
    loggingService.error(err);
  });
  const port = configService.get('PORT');
  await app.listen(port);
  throw new Error('Hehehe error');
}
bootstrap();
